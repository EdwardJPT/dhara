import { render } from "preact";
import { useSignal, useComputed, Signal, useSignalEffect } from "@preact/signals";
import { useMemo } from "preact/hooks";

import { ProjectDisplay } from "./project.project";
import { EditProjectForm } from "./project.editForm";
import { TaskForm } from "./project.taskForm";
import { TasksDisplay } from "./project.tasks";

import {
  ALL,
  TaskFiltersPriority,
  TaskFiltersStatus,
  TaskFiltersTime,
  TaskSorter,
} from "../constants";

import {
  todayUserTimeZone,
  getWeekRange,
  getMonthRange,
  getQuarterRange,
} from "../utils";

import { Project, Task } from "./types";

interface BackEndData {
  projectData: Project;
  taskList: Task[];
  countPriorityProjects: number;
  isDemo: boolean;
}

interface AppProps extends BackEndData { }

export type SortValue = (typeof TaskSorter)[keyof typeof TaskSorter];

// Helper to extract the updated project from your global demo_projects array
function loadDemoProject(backendProject: Project, isDemo: boolean): Project {
  if (!isDemo) return backendProject;

  const storedProjectsStr = localStorage.getItem("demo_projects");
  if (storedProjectsStr) {
    try {
      const storedProjects = JSON.parse(storedProjectsStr);
      // Find the project that matches the one we're currently looking at
      const foundProject = storedProjects.find((p: Project) => p.project_id === backendProject.project_id);
      if (foundProject) {
        return foundProject; // Use the stored edits!
      }
    } catch (e) {
      console.error("Error parsing demo_projects from LocalStorage", e);
    }
  }
  // Fallback to the backend mock data if nothing is found in localStorage
  return backendProject;
}

// Helper to extract and filter tasks from global demo_tasks array
function loadDemoTasks(backendTasks: Task[], projectId: number, isDemo: boolean): Task[] {
  if (!isDemo) return backendTasks;

  const storedTasksStr = localStorage.getItem("demo_tasks");
  if (storedTasksStr) {
    try {
      const storedTasks = JSON.parse(storedTasksStr);
      // Filter out only the tasks that belong to the current project
      const projectTasks = storedTasks.filter((t: Task) => t.project_id === projectId);
      return projectTasks;
    } catch (e) {
      console.error("Error parsing demo_tasks from LocalStorage", e);
    }
  }
  // Fallback to the backend mock data if nothing is found in localStorage
  return backendTasks;
}

function loadPrevData(key: string): boolean {
  const stored = localStorage.getItem(key);
  if (stored !== null) {
    try {
      return JSON.parse(stored) as boolean;
    } catch (e) {
      console.error("Error parsing " + key, e);
    }
  }
  return Math.random() >= 0.5;
}

function App({ projectData, taskList, countPriorityProjects, isDemo = false }: AppProps) {
  // Get the current project data (either from backend or localStorage)
  const initialProject = loadDemoProject(projectData, isDemo);
  const project = useSignal(initialProject);
  // Get the tasks, filtering by the initialProject's ID just like the Go backend does
  const initialTasks = loadDemoTasks(taskList, initialProject.project_id, isDemo);
  const tasks = useSignal(initialTasks);

  const isEditingProject = useSignal(false);
  const isAddingTasks = useSignal(false);

  const errorMessage = useSignal("");
  const setErrorMessage = (message: string) => (errorMessage.value = message);

  // Helper function to load initial task filters
  const getInitialTaskFilters = () => {
    const storedFilters = localStorage.getItem("projectTaskFilters");
    if (storedFilters) {
      try {
        return JSON.parse(storedFilters);
      } catch (e) {
        console.error("Failed to parse stored task filters from LocalStorage", e);
      }
    }
    return {
      selectedProject: ALL,
      priority: ALL,
      status: ALL,
      time: ALL,
    };
  };

  const taskFilters = useSignal(getInitialTaskFilters());

  // Sync back to Local Storage whenever taskFilters changes
  useSignalEffect(() => {
    localStorage.setItem("projectTaskFilters", JSON.stringify(taskFilters.value));
  });

  const showFilterDropdown = useSignal(loadPrevData("filterDropdown"));
  useSignalEffect(() => {
    // Explicitly reading .value outside the condition forces Preact to track it
    const currentDropdown = showFilterDropdown.value;
    localStorage.setItem("filterDropdown", JSON.stringify(currentDropdown));
  });

  // Helper function to load initial sorter
  const getInitialSortCategory = () => {
    const storedSorter = localStorage.getItem("taskSorter");
    if (storedSorter) {
      try {
        return JSON.parse(storedSorter);
      } catch (e) {
        console.error("Failed to parse stored task sorter from LocalStorage", e);
      }
    }
    return TaskSorter.Skip;
  };

  const sortCategory: Signal<SortValue> = useSignal(getInitialSortCategory());

  // Sync back to Local Storage whenever sortCategory changes
  useSignalEffect(() => {
    localStorage.setItem("taskSorter", JSON.stringify(sortCategory.value));
  });

  const sortFunctions = useMemo(
    () => ({
      [TaskSorter.DueDateAsc]: (a: Task, b: Task) => {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      },
      [TaskSorter.DueDateDesc]: (a: Task, b: Task) => {
        return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
      },
      [TaskSorter.DoneDateAsc]: (a: Task, b: Task) => {
        return (
          new Date(a.done_date).getTime() - new Date(b.done_date).getTime()
        );
      },
      [TaskSorter.DoneDateDesc]: (a: Task, b: Task) => {
        return (
          new Date(b.done_date).getTime() - new Date(a.done_date).getTime()
        );
      },
      [TaskSorter.Priority]: (a: Task, b: Task) => {
        return Number(b.priority) - Number(a.priority);
      },
    }),
    []
  );

  const shownTasks = useComputed(() => {
    let result = tasks.value;
    const today = todayUserTimeZone();
    if (!result) return [];
    // filter based on priority
    if (taskFilters.value.priority !== TaskFiltersPriority.ALL) {
      result = result.filter((t) => t.priority);
    }
    // filter based on finish status
    if (taskFilters.value.status !== TaskFiltersStatus.ALL) {
      if (taskFilters.value.status === TaskFiltersStatus.Unfinished) {
        result = result.filter((t) => !t.is_done);
      }
      if (taskFilters.value.status === TaskFiltersStatus.Finished) {
        result = result.filter((t) => t.is_done);
      }
      if (taskFilters.value.status === TaskFiltersStatus.Overdue) {
        result = result.filter(
          (t) => !t.is_done && new Date(today) > new Date(t.due_date)
        );
      }
    }
    // filter based on time range
    if (taskFilters.value.time !== ALL) {
      result = result.filter((t) => {
        if (taskFilters.value.time == TaskFiltersTime.Today) {
          return t.due_date == today;
        }
        if (taskFilters.value.time == TaskFiltersTime.ThisWeek) {
          const { startOfWeek, endOfWeek } = getWeekRange(new Date(today));
          return (
            new Date(t.due_date) >= startOfWeek &&
            new Date(t.due_date) <= endOfWeek
          );
        }
        if (taskFilters.value.time == TaskFiltersTime.SevenDays) {
          const thisDay = new Date(today);
          const next7DaysEnd = new Date(today);
          next7DaysEnd.setDate(thisDay.getDate() + 6); // +6 because today is day 1 of 7
          next7DaysEnd.setHours(23, 59, 59, 999);
          return (
            new Date(t.due_date) >= thisDay &&
            new Date(t.due_date) <= next7DaysEnd
          );
        }
        if (taskFilters.value.time == TaskFiltersTime.ThisMonth) {
          const { startOfMonth, endOfMonth } = getMonthRange(new Date(today));
          return (
            new Date(t.due_date) >= startOfMonth &&
            new Date(t.due_date) <= endOfMonth
          );
        }
        if (taskFilters.value.time == TaskFiltersTime.ThirtyDays) {
          const thisDay = new Date(today);
          const next30DaysEnd = new Date(today);
          next30DaysEnd.setDate(thisDay.getDate() + 29);
          next30DaysEnd.setHours(23, 59, 59, 999);
          return (
            new Date(t.due_date) >= thisDay &&
            new Date(t.due_date) <= next30DaysEnd
          );
        }
        if (taskFilters.value.time == TaskFiltersTime.ThisQuarter) {
          const { startOfQuarter, endOfQuarter } = getQuarterRange(
            new Date(today)
          );
          return (
            new Date(t.due_date) >= startOfQuarter &&
            new Date(t.due_date) <= endOfQuarter
          );
        }
        if (taskFilters.value.time == TaskFiltersTime.ThisYear) {
          const taskYear = new Date(t.due_date).getFullYear();
          const currentYear = new Date(today).getFullYear();
          return taskYear === currentYear;
        }
        // filter for clicking the calendar
        if (taskFilters.value.time) {
          return t.due_date == taskFilters.value.time;
        }
      });
    }
    // Return early if skip or the first value of options
    if (sortCategory.value === TaskSorter.Skip) return result;
    return [...result].sort(sortFunctions[sortCategory.value]);
  });

  return (
    <div class="flex w-full flex-col items-center px-3 sm:px-4 md:px-0">
      <h1 class="-mt-2.5 mb-5 md:mb-7.5 flex w-fit justify-center pt-3 text-center text-2xl font-bold text-gray-700 sm:text-3xl">
        Project Details & Edit
      </h1>

      <ProjectDisplay project={project} />

      {/* Controller buttons */}
      <div class="mx-auto mt-5 grid w-full max-w-3xl grid-cols-2 gap-2 text-sm sm:text-base md:text-lg">
        <div
          onClick={() => (isAddingTasks.value = !isAddingTasks.value)}
          class="flex w-full cursor-pointer items-center justify-center bg-white py-2 hover:bg-pink-50"
        >
          + Add Task
        </div>
        <div
          onClick={() => (isEditingProject.value = true)}
          class="flex w-full cursor-pointer items-center justify-center bg-white py-2 hover:bg-pink-50"
        >
          <img
            src="/static/images/pencil.svg"
            alt="clock icon"
            class="h-4 w-4 sm:h-5 sm:w-5"
          />
          &nbsp; Edit Project
        </div>
      </div>

      {isEditingProject.value && (
        <EditProjectForm
          project={project.value}
          isEditingProject={isEditingProject}
          countPriorityProjects={countPriorityProjects}
          setErrorMessage={setErrorMessage}
          isDemo={isDemo}
        />
      )}

      {isAddingTasks.value && (
        <>
          <div class="mx-auto my-5 w-full max-w-3xl border-t border-background"></div>
          <TaskForm
            isAddingTasks={isAddingTasks}
            project={project}
            setErrorMessage={setErrorMessage}
            isDemo={isDemo}
          />
        </>
      )}

      <div class="mx-auto my-5 w-full max-w-3xl border-t border-background"></div>

      <div class={`mb-2 flex flex-row flex-wrap items-center justify-center gap-2 md:gap-0 ${showFilterDropdown.value ? "md:mb-0" : "md:mb-3"}`}>
        <button
          onClick={() => (showFilterDropdown.value = !showFilterDropdown.value)}
          class="flex w-32 cursor-pointer flex-row items-center justify-center text-center text-sm font-medium hover:underline sm:w-35 sm:text-base md:mr-5 md:w-30"
        >
          <img src="/static/images/filter2.png" alt="" class="h-4 w-4" />
          <span class="w-full px-2 py-2 text-center text-ellipsis text-nowrap sm:py-3">
            &nbsp;Filters
          </span>
        </button>
        <div class="flex w-32 cursor-pointer flex-row items-center justify-center text-center text-sm font-medium hover:underline sm:w-35 sm:text-lg md:w-fit">
          <img src="/static/images/sort.png" alt="" class="h-4 w-2.5 sm:h-5 sm:w-3" />
          <select
            onChange={(e) => (sortCategory.value = e.currentTarget.value as SortValue)}
            value={sortCategory.value}
            id="tasksFilterPriority"
            name="tasksFilterPriority"
            class="w-full px-2 py-2 text-center text-ellipsis text-nowrap text-sm sm:py-3 sm:text-base md:w-35"
          >
            <option value={TaskSorter.Skip} disabled selected>
              Sort by
            </option>
            <option value={TaskSorter.DueDateAsc}>
              Due Date<span class="flex items-start text-3xl">&#8599;</span>
            </option>
            <option value={TaskSorter.DueDateDesc}>
              Due Date<span class="flex items-start text-3xl">&#8600;</span>
            </option>
            <option value={TaskSorter.DoneDateAsc}>
              Done Date<span class="flex items-start text-3xl">&#8599;</span>
            </option>
            <option value={TaskSorter.DoneDateDesc}>
              Done Date<span class="flex items-start text-3xl">&#8600;</span>
            </option>
            <option value={TaskSorter.Priority}>Priority</option>
          </select>
        </div>
      </div>

      {showFilterDropdown.value && (
        <div class="mb-4 flex w-full flex-row justify-center items-center">
          <div class="flex w-1/3 cursor-pointer flex-col items-center justify-center text-base font-medium sm:w-30">
            <label class="text-ellipsis text-nowrap">Priority</label>
            <select
              onChange={(e) =>
              (taskFilters.value = {
                ...taskFilters.value,
                priority: e.currentTarget.value,
              })
              }
              value={taskFilters.value.priority}
              id="tasksFilterPriority"
              name="tasksFilterPriority"
              class="border-border w-full rounded-sm border px-2 py-2 text-center text-ellipsis text-nowrap text-sm sm:py-3 sm:text-base"
            >
              <option value={TaskFiltersPriority.Priority}>
                Priority only
              </option>
              <option value={TaskFiltersPriority.ALL} selected>
                All
              </option>
            </select>
          </div>
          <div class="flex w-1/3 cursor-pointer flex-col items-center justify-center text-base font-medium sm:w-30">
            <label class="text-ellipsis text-nowrap">Status</label>
            <select
              onChange={(e) =>
              (taskFilters.value = {
                ...taskFilters.value,
                status: e.currentTarget.value,
              })
              }
              value={taskFilters.value.status}
              id="tasksFilterStatus"
              name="tasksFilterStatus"
              class="border-border w-full rounded-sm border px-2 py-2 text-center text-ellipsis text-nowrap text-sm sm:py-3 sm:text-base"
            >
              <option value={TaskFiltersStatus.ALL} selected>
                All
              </option>
              <option value={TaskFiltersStatus.Unfinished}>Unfinished</option>
              <option value={TaskFiltersStatus.Finished}>Finished</option>
              <option value={TaskFiltersStatus.Overdue}>Overdue</option>
            </select>
          </div>
          <div class="flex w-1/3 cursor-pointer flex-col items-center justify-center text-base font-medium sm:w-30">
            <label class="text-ellipsis text-nowrap">Time Range</label>
            <select
              onChange={(e) =>
              (taskFilters.value = {
                ...taskFilters.value,
                time: e.currentTarget.value,
              })
              }
              value={taskFilters.value.time}
              id="tasksFilterTime"
              name="tasksFilterTime"
              class="border-border w-full rounded-sm border px-2 py-2 text-center text-ellipsis text-nowrap text-sm sm:py-3 sm:text-base"
            >
              <option value={TaskFiltersTime.Today} selected>
                Today
              </option>
              <option value={TaskFiltersTime.ThisWeek}>
                This Week
              </option>
              <option value={TaskFiltersTime.SevenDays}>
                Next 7 Days
              </option>
              <option value={TaskFiltersTime.ThisMonth}>
                This Month
              </option>
              <option value={TaskFiltersTime.ThirtyDays}>
                Next 30 Days
              </option>
              <option value={TaskFiltersTime.ThisQuarter}>
                This Quarter
              </option>
              <option value={TaskFiltersTime.ThisYear}>
                This Year
              </option>
              <option value={TaskFiltersTime.ALL}>
                All
              </option>
            </select>
          </div>
        </div>
      )}

      <TasksDisplay
        tasks={tasks}
        shownTasks={shownTasks}
        project={project}
        sortCategory={sortCategory}
        setErrorMessage={setErrorMessage}
        isDemo={isDemo}
      />

      {errorMessage.value && (
        <ErrorMessage
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
}

interface ErrorProps {
  errorMessage: Signal<string>;
  setErrorMessage: (message: string) => string;
}

function ErrorMessage({ errorMessage, setErrorMessage }: ErrorProps) {
  return (
    <div class="fixed top-1/2 left-1/2 z-11 flex min-h-40 w-[90%] max-w-md -translate-1/2 items-center justify-center rounded-md border border-background bg-background px-5 py-8 text-white shadow-lg sm:w-auto sm:min-w-80 md:w-fit">
      <span
        onClick={() => {
          setErrorMessage("");
          setTimeout(() => { location.reload() }, 3500);
        }}
        class="absolute top-2 right-2 cursor-pointer text-2xl font-extrabold text-white"
      >
        &#x2715;
      </span>
      <div class="flex flex-col items-center justify-center">
        <p class="wrap-break-words text-center text-lg font-extrabold sm:text-xl">{errorMessage}</p>
      </div>
    </div>
  );
}

interface DataWindow extends Window, BackEndData { }
const dataWindow = window as unknown as DataWindow;

// Mount the frontend
render(
  <App
    projectData={dataWindow.projectData}
    taskList={dataWindow.taskList}
    countPriorityProjects={dataWindow.countPriorityProjects}
    isDemo={dataWindow.isDemo || false}
  />,
  document.getElementById("projects")!
);
