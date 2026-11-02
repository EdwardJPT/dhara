import { render } from "preact";
import { useSignal, useComputed, Signal, useSignalEffect } from "@preact/signals";

import { ProjectsDisplay, useProjectDisplay } from "./home.projects";
import { TaskDisplay } from "./home.tasks";
import { UnsortedDisplay } from "./home.unsorted";
import { ErrorMessage } from "../components/error_messages";

import {
  ALL,
  TaskFiltersPriority,
  TaskFiltersStatus,
  TaskFiltersTime,
  defaultTaskFilters,
} from "../constants";

import { Goal, GoalSettings, Project, Task, UnsortedTask } from "./types";

interface BackEndData {
  projectList: Project[];
  taskList: Task[];
  unsortedList: UnsortedTask[];
  goalList: Goal[];
  isDemo: boolean;
}

interface AppProps extends BackEndData { }

export type TaskPriorityValue =
  (typeof TaskFiltersPriority)[keyof typeof TaskFiltersPriority];
export type TaskTimeValue =
  (typeof TaskFiltersTime)[keyof typeof TaskFiltersTime];
export type TaskStatusValue =
  (typeof TaskFiltersStatus)[keyof typeof TaskFiltersStatus];

export type TaskFilters = {
  selectedProject: number | string;
  priority: TaskPriorityValue;
  status: TaskStatusValue;
  time: TaskTimeValue;
};

const defaultGoalSettings: GoalSettings = {
  selectedGoal: "all",
  showGoals: false,
};

// Helper function to initialize data from LocalStorage if in demo mode
function loadDemoData<T>(key: string, backendData: T, isDemo: boolean): T {
  if (!isDemo) return backendData;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing " + key, e);
    }
  }
  localStorage.setItem(key, JSON.stringify(backendData));
  return backendData;
}

function App({
  projectList,
  taskList,
  unsortedList,
  goalList,
  isDemo = false,
}: AppProps) {
  // Goals Section
  const goals = useSignal(loadDemoData("demo_goals", goalList, isDemo));
  useSignalEffect(() => {
    const currentGoals = goals.value;
    if (isDemo) {
      localStorage.setItem("demo_goals", JSON.stringify(currentGoals));
    }
  });

  // Helper function to load goal settings
  const getInitialGoalSettings = (): GoalSettings => {
    const storedSettings = localStorage.getItem("homeGoalSettings");
    if (storedSettings) {
      try {
        const settings: GoalSettings = JSON.parse(storedSettings);
        return {
          selectedGoal: typeof settings?.selectedGoal === "string" &&
            goals.value.some(goal => String(goal.goal_id) === settings.selectedGoal)
            ? settings.selectedGoal
            : "all",
          showGoals: settings?.showGoals === true,
        };
      } catch (e) {
        console.error("No stored goal settings from LocalStorage", e);
      }
    }
    return defaultGoalSettings;
  };
  const goalSettings: Signal<GoalSettings> = useSignal(getInitialGoalSettings());
  // Sync back to Local Storage whenever goalSettings.value changes
  useSignalEffect(() => {
    localStorage.setItem("homeGoalSettings", JSON.stringify(goalSettings.value));
  });

  // Projects Sections
  const projects = useSignal(loadDemoData("demo_projects", projectList, isDemo));
  useSignalEffect(() => {
    // Explicitly reading .value outside the condition forces Preact to track it
    const currentProjects = projects.value;
    if (isDemo) {
      localStorage.setItem("demo_projects", JSON.stringify(currentProjects));
    }
  });

  const projectDisplay = useProjectDisplay(projects, goals, goalSettings);

  // projectObj is an object of { project_id: project_title } so we can access
  // project.project_title from task.project_id
  const projectIdArr = projects.value.map((project) => project.project_id);
  const projectObj = useComputed(() => {
    // the backend always return empty string in case of query failure, etc,
    // but keeping this for safety
    const projectObj: { [K in (typeof projectIdArr)[number]]: string } = {};
    // if empty array return empty projectObj
    if (!projects.value) return projectObj;
    const len = projects.value.length;
    for (let i = 0; i < len; i++) {
      projectObj[projects.value[i].project_id] =
        projects.value[i].project_title;
    }
    return projectObj;
  });

  // Tasks Sections
  const tasks = useSignal(loadDemoData("demo_tasks", taskList, isDemo));
  useSignalEffect(() => {
    const currentTasks = tasks.value;
    if (isDemo) {
      localStorage.setItem("demo_tasks", JSON.stringify(currentTasks));
    }
  });

  // Helper function to load filters
  const getInitialFilters = (): TaskFilters => {
    const storedFilters = localStorage.getItem("taskFilters");
    if (storedFilters) {
      try {
        return JSON.parse(storedFilters);
      } catch (e) {
        console.error("No stored task filters from LocalStorage", e);
      }
    }
    return defaultTaskFilters;
  };
  // all the filters for tasks shown in task list
  const taskFilters: Signal<TaskFilters> = useSignal(getInitialFilters());
  // Sync back to Local Storage whenever taskFilters.value changes
  useSignalEffect(() => {
    localStorage.setItem("taskFilters", JSON.stringify(taskFilters.value));
  });

  useSignalEffect(() => {
    const selectedProject = taskFilters.value.selectedProject;
    if (selectedProject === ALL) return;

    const isShown = projectDisplay.shownProjects.value.some(
      project => project.project_id === Number(selectedProject)
    );

    if (!isShown) {
      taskFilters.value = {
        ...taskFilters.value,
        selectedProject: ALL,
      };
    }
  });

  // setter for the selected project
  const setSelectedProject = (projectId: number | string) => {
    taskFilters.value = {
      ...taskFilters.value,
      time: ALL,
      selectedProject: projectId,
    };
  };

  // to update the amount of to_dos_done of a project when a task is being
  // checked off/checked on
  const setProjects = (projectId: number, checked: boolean) => {
    const updateProject = (project: Project) => {
      if (project.project_id !== projectId) return project;

      const delta = checked ? 1 : -1;
      const newDoneCount = project.to_dos_done + delta;
      // Determine if the project's completion status should toggle
      const shouldToggleDone = checked
        ? project.to_dos_all === project.to_dos_done + 1 // About to complete last todo
        : project.to_dos_all === project.to_dos_done; // Was fully done before unchecking

      if (shouldToggleDone) {
        const done_date = checked ? Math.floor(new Date().getTime() / 1000) : 0;
        return {
          ...project,
          to_dos_done: newDoneCount,
          is_done: !project.is_done,
          done_date,
        };
      }
      return { ...project, to_dos_done: newDoneCount };
    };

    projects.value = projects.value.map(updateProject);
  };

  // Unsorted Sections
  const showUnsorted = useSignal(false);
  const unsorteds = useSignal(loadDemoData("demo_unsorteds", unsortedList, isDemo));
  useSignalEffect(() => {
    const currentUnsorteds = unsorteds.value;
    if (isDemo) {
      localStorage.setItem("demo_unsorteds", JSON.stringify(currentUnsorteds));
    }
  });

  const unfinishedUnsorted = useComputed(() => {
    let num = 0;
    const length = unsorteds.value?.length;
    for (let i = 0; i < length; i++) {
      num += Number(!unsorteds.value?.[i]?.is_done);
    }
    return num;
  });

  const errorMessage = useSignal("");
  const setErrorMessage = (message: string) => (errorMessage.value = message);

  const handleResetDemo = () => {
    if (!confirm("Are you sure you want to reset the demo? All your changes will be lost.")) return;

    // Clear the specific demo data keys
    localStorage.removeItem("demo_projects");
    localStorage.removeItem("demo_goals");
    localStorage.removeItem("demo_tasks");
    localStorage.removeItem("demo_unsorteds");
    localStorage.removeItem("demo_habits_groups");
    localStorage.removeItem("demo_habits_done_dates");

    // Reload the page to fetch fresh mock data from the Go backend
    window.location.reload();
  };

  return (
    // Projects Section
    <div class="mx-auto w-full min-w-0 max-w-6xl">
      {isDemo && (
        <div class="mb-6 flex flex-col items-start justify-between gap-3 rounded-md bg-blue-50 p-4 text-blue-900 shadow-sm border border-blue-200 sm:flex-row sm:items-center">
          <div class="min-w-0">
            <p class="font-semibold">You are viewing the Demo Mode</p>
            <p class="text-sm">Changes are saved locally to your browser.</p>
          </div>
          <button
            onClick={handleResetDemo}
            class="min-h-11 w-full shrink-0 rounded bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-100 border border-blue-300 transition-colors sm:min-h-0 sm:w-auto"
          >
            Reset Demo
          </button>
        </div>
      )}

      <ProjectsDisplay
        projects={projects}
        displayState={projectDisplay}
        goals={goals}
        goalSettings={goalSettings}
        setSelectedProject={setSelectedProject}
        showUnsorted={showUnsorted}
        unfinishedUnsorted={unfinishedUnsorted}
        isDemo={isDemo}
      />

      <div class="mt-5 border-t border-gray-900"></div>

      <TaskDisplay
        tasks={tasks}
        shownProjects={projectDisplay.shownProjects}
        taskFilters={taskFilters}
        projectObj={projectObj}
        setProjects={setProjects}
        setErrorMessage={setErrorMessage}
        isDemo={isDemo}
      />

      {showUnsorted.value && (
        <UnsortedDisplay
          unsorteds={unsorteds}
          showUnsorted={showUnsorted}
          projects={projects}
          tasks={tasks}
          setErrorMessage={setErrorMessage}
          isDemo={isDemo}
        />
      )}

      {errorMessage.value && (
        <ErrorMessage
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}

      {/* Div container for the form to add project */}
      <div id="form-container" class="flex items-center justify-center"></div>
    </div>
  );
}

interface DataWindow extends Window, BackEndData { }
const dataWindow = window as unknown as DataWindow;

// Mount the frontend
render(
  <App
    projectList={dataWindow.projectList}
    taskList={dataWindow.taskList}
    unsortedList={dataWindow.unsortedList}
    goalList={dataWindow.goalList}
    isDemo={dataWindow.isDemo || false}
  />,
  document.getElementById("home")!
);
