import { render } from "preact";
import { Signal, useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { useMemo } from "preact/hooks";

import { MonthBlock } from "./calendar.monthBlock";
import { TaskDetails } from "./calendar.task";
import { UnsortedDetails } from "./calendar.unsorted";
import { ErrorMessage } from "../components/error_messages";

import { monthNames } from "../constants";
import { todayUserTimeZone } from "../utils";
import { TasksWithProject, UnsortedTask, HabitDoneInfo } from "./types";
import { Project } from "../home/types";

interface BackEndData {
  dueDatesTasksList: { [key: string]: TasksWithProject[] };
  dueDatesUnsortedsList: { [key: string]: UnsortedTask[] };
  dueDatesHabitsList: { [key: string]: HabitDoneInfo[] };
  isDemo: boolean;
}

interface AppProps extends BackEndData { }

const today = todayUserTimeZone();
// Options of showMode to filter what would be shown to the user
const unfinished = "unfinished";
const all = "all";

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

// Helper function specifically for extracting and transforming Tasks & Projects
function getDemoGroupedTasks(fallbackData: { [key: string]: TasksWithProject[] }): { [key: string]: TasksWithProject[] } {
  const tasksStr = localStorage.getItem("demo_tasks");
  const projectsStr = localStorage.getItem("demo_projects");

  // If the user hasn't visited the other routes yet, use the initial backend demo data
  if (!tasksStr || !projectsStr) {
    return fallbackData;
  }

  try {
    const parsedTasks = JSON.parse(tasksStr);
    const parsedProjects = JSON.parse(projectsStr);

    // Ensure we extract the array whether it was saved as { storedTasks: [] } or just []
    const tasksArray = Array.isArray(parsedTasks) ? parsedTasks : (parsedTasks.storedTasks || []);
    const projectsArray = Array.isArray(parsedProjects) ? parsedProjects : (parsedProjects.storedProjects || []);

    const projectMap = new Map(projectsArray.map((p: any) => [p.project_id, p]));
    const groupedDueDates: { [key: string]: TasksWithProject[] } = {};

    tasksArray.forEach((task: any) => {
      const project = projectMap.get(task.project_id) as Project;
      if (!project) return;

      const combined: TasksWithProject = {
        task_id: task.task_id,
        task_title: task.task_title,
        task_desc: task.task_desc,
        task_priority: task.priority,
        task_due_date: task.due_date,
        task_is_done: task.is_done,
        task_done_date: task.done_date,
        project_title: project.project_title,
        project_priority: project.priority,
        project_due_date: project.due_date,
        project_is_done: project.is_done,
        project_done_date: project.done_date,
      };

      if (!groupedDueDates[task.due_date]) groupedDueDates[task.due_date] = [];
      groupedDueDates[task.due_date].push(combined);
    });

    return groupedDueDates;
  } catch (e) {
    console.error("Error formatting demo tasks and projects", e);
    return fallbackData;
  }
}

// Helper function for extracting and grouping Unsorted Tasks by due_date
function getDemoGroupedUnsorteds(
  fallbackData: { [key: string]: UnsortedTask[] }
): { [key: string]: UnsortedTask[] } {
  const unsortedsStr = localStorage.getItem("demo_unsorteds");

  // If the user hasn't visited the other route yet, use the initial backend demo data
  if (!unsortedsStr) {
    return fallbackData;
  }

  try {
    const parsedUnsorteds = JSON.parse(unsortedsStr);
    // Ensure we extract the array whether it was saved as { storedUnsorteds: [] } or just []
    const unsortedsArray = Array.isArray(parsedUnsorteds)
      ? parsedUnsorteds
      : parsedUnsorteds.storedUnsorteds || [];

    const groupedDueDates: { [key: string]: UnsortedTask[] } = {};

    unsortedsArray.forEach((unsorted: UnsortedTask) => {
      // Group by due_date
      if (!groupedDueDates[unsorted.due_date]) {
        groupedDueDates[unsorted.due_date] = [];
      }
      groupedDueDates[unsorted.due_date].push(unsorted);
    });

    return groupedDueDates;
  } catch (e) {
    console.error("Error formatting demo unsorteds", e);
    return fallbackData;
  }
}

function App({
  dueDatesTasksList,
  dueDatesUnsortedsList,
  dueDatesHabitsList,
  isDemo = false,
}: AppProps) {
  const tasksListSignal = useSignal(
    isDemo ? getDemoGroupedTasks(dueDatesTasksList) : dueDatesTasksList
  );

  const unsortedsListSignal = useSignal(
    isDemo ? getDemoGroupedUnsorteds(dueDatesUnsortedsList) : dueDatesUnsortedsList
  );

  const habitsListSignal = useSignal(loadDemoData("demo_dueDatesHabits", dueDatesHabitsList, isDemo));
  useSignalEffect(() => {
    const currentHabits = habitsListSignal.value;
    if (isDemo) {
      localStorage.setItem("demo_dueDatesHabits", JSON.stringify(currentHabits));
    }
  });

  // Filter of what we would show to the user, either just unfinished task and
  // unfinished unsorted, or all of them
  const showMode = useSignal(all);
  const dueDatesTasks = useComputed(() => {
    if (showMode.value === all) return tasksListSignal.value;

    const dueDates = Object.keys(tasksListSignal.value);
    const dueDatesLen = dueDates.length;
    const filteredDueDates = {} as { [key: string]: TasksWithProject[] };
    for (let i = 0; i < dueDatesLen; i++) {
      const filteredTasks = [];
      const tasks = tasksListSignal.value[dueDates[i]];
      const tasksLen = tasks.length;
      for (let j = 0; j < tasksLen; j++) {
        if (!tasks[j].task_is_done) filteredTasks.push(tasks[j]);
      }

      if (filteredTasks.length > 0) {
        filteredDueDates[dueDates[i]] = filteredTasks;
      }
    }
    return filteredDueDates;
  });

  const dueDatesUnsorteds = useComputed(() => {
    if (showMode.value === all) return unsortedsListSignal.value;

    const dueDates = Object.keys(unsortedsListSignal.value);
    const dueDatesLen = dueDates.length;
    const filteredDueDates = {} as { [key: string]: UnsortedTask[] };
    for (let i = 0; i < dueDatesLen; i++) {
      const filteredUnsorteds = [];
      const unsorteds = unsortedsListSignal.value[dueDates[i]];
      const unsortedsLen = unsorteds.length;
      for (let j = 0; j < unsortedsLen; j++) {
        if (!unsorteds[j].is_done) filteredUnsorteds.push(unsorteds[j]);
      }

      if (filteredUnsorteds.length > 0) {
        filteredDueDates[dueDates[i]] = filteredUnsorteds;
      }
    }
    return filteredDueDates;
  });

  // How many months that would be shown to the user
  // possible value: 1, 4, 6, 12
  const monthMode = useSignal(1);
  const startDate = useSignal(new Date(today));
  const selectedDate = useSignal(today);

  // Navigation Logic
  const handlePrev = () => {
    const newDate = new Date(startDate.value);
    newDate.setMonth(startDate.value.getMonth() - monthMode.value);
    startDate.value = newDate;
  };

  const handleNext = () => {
    const newDate = new Date(startDate.value);
    newDate.setMonth(startDate.value.getMonth() + monthMode.value);
    startDate.value = newDate;
  };

  // Generate the list of months to display based on viewMode.value
  const monthsToRender = useMemo(() => {
    return Array.from({ length: monthMode.value }, (_, i) => {
      const d = new Date(startDate.value);
      d.setMonth(startDate.value.getMonth() + i);
      return { month: d.getMonth(), year: d.getFullYear() };
    });
  }, [startDate.value, monthMode.value]);

  // Dynamic Grid Layout Class
  const getGridLayoutClass = () => {
    switch (monthMode.value) {
      case 1:
        return "grid-cols-1";
      case 4:
        return "grid-cols-1 sm:grid-cols-2";
      case 6:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      default: // assume viewMode.value === 8 or fallback
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  };
  const gridLayoutClass = getGridLayoutClass();

  const selectedEvents = useComputed(() => {
    const tasks = dueDatesTasks.value[selectedDate.value];
    const unsorteds = dueDatesUnsorteds.value[selectedDate.value];
    const tasksLength = tasks ? tasks.length : 0;
    const unsortedsLength = unsorteds ? unsorteds.length : 0;

    return { tasks, unsorteds, tasksLength, unsortedsLength };
  });

  const shownTask: Signal<TasksWithProject | null> = useSignal(null);
  const shownUnsorted: Signal<UnsortedTask | null> = useSignal(null);

  const errorMessage = useSignal("");
  const setErrorMessage = (message: string) => (errorMessage.value = message);

  return (
    <div className="p-6 md:p-8 md:pt-0 font-sans text-slate-800 flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col xl:flex-row gap-4">
        {/* --- LEFT: CALENDAR AREA --- */}
        <div className="flex-1">
          {/* HEADER CONTROL BAR */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-5 gap-4">
            {/* View Range Selector (Pills) */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
              {[1, 4, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    monthMode.value = m;
                  }}
                  className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${monthMode.value === m
                    ? "bg-background text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                >
                  {m === 12 ? "Year" : `${m} Mo`}
                </button>
              ))}
            </div>

            {/* Month Navigation */}
            <div className="flex items-center gap-4 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200">
              <button
                onClick={handlePrev}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>

              <div className="text-center min-w-35">
                <span className="text-base font-bold text-slate-800 block">
                  {monthNames[monthsToRender[0].month]} {monthsToRender[0].year}
                </span>
                {monthMode.value > 1 && (
                  <span className="text-sm text-slate-400 font-bold uppercase">
                    -{" "}
                    {
                      monthNames[
                      monthsToRender[monthsToRender.length - 1].month
                      ]
                    }{" "}
                    {monthsToRender[monthsToRender.length - 1].year}
                  </span>
                )}
              </div>

              <button
                onClick={handleNext}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          {/* GRID RENDERER */}
          <div
            className={`grid ${gridLayoutClass} gap-2 ${monthMode.value === 1 ? "bg-white p-6 rounded-md rounded-t-none shadow-sm border border-slate-100 border-t-4 border-t-background" : ""}`}
          >
            {monthsToRender.map((data) => (
              <MonthBlock
                key={`${data.year}-${data.month}`}
                year={data.year}
                month={data.month}
                selectedDate={selectedDate}
                isCompact={monthMode.value > 1} // Use compact cells for multi-month views
                dueDatesTasksList={dueDatesTasks.value}
                dueDatesUnsortedsList={dueDatesUnsorteds.value}
              />
            ))}
          </div>
        </div>

        {/* --- RIGHT: AGENDA SIDEBAR --- */}
        <div>
          {" "}
          {/* To make the sticky work */}
          <div className="xl:w-80 flex flex-col sticky top-10">
            <div className="flex flex-row justify-between bg-white mt-1.5 mb-5.5 text-md">
              <h4 className="flex flex-1 items-center justify-center font-bold w-full bg-background text-white py-2 px-6">
                Filters
              </h4>
              <div className="flex flex-3 items-center justify-evenly">
                <span
                  class={`mr-1 text-md
                ${showMode.value === all ? "text-background font-semibold" : "text-gray-500"}`}
                >
                  All
                </span>
                <button
                  onClick={() =>
                  (showMode.value =
                    showMode.value === unfinished ? all : unfinished)
                  }
                  type="button"
                  id="priorityToggle"
                  class={`relative inline-flex h-5 w-9 items-center rounded-full transition
                    ${showMode.value === all ? "bg-background" : "bg-[#2eaadb]"}`}
                >
                  <span
                    class={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ease-in-out
                    ${showMode.value === all ? "translate-x-1" : "translate-x-5"}`}
                  ></span>
                </button>
                <span
                  class={`ml-1 text-md
                ${showMode.value === unfinished ? "text-background font-semibold" : "text-gray-500"}`}
                >
                  Unfinished
                </span>
              </div>
            </div>

            <div className="flex flex-col bg-white h-fit max-h-[701.5px] overflow-y-hidden rounded-md p-6 shadow-xl shadow-indigo-100/50 border border-slate-100 border-l-4 border-l-background rounded-l-none">
              <div className="pb-6 border-b border-slate-100">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                  {new Date(selectedDate.value).getDate()}
                </h2>
                <div className="text-base font-bold text-background uppercase tracking-widest mt-1">
                  {new Date(selectedDate.value).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <div className="text-sm font-semibold text-slate-400 mt-1">
                  {new Date(selectedDate.value).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </div>
              </div>

              <div className="flex-1 space-y-3 min-h-75 max-h-full overflow-y-auto">
                {/* ?TODO: Finish the habits one */}
                {selectedEvents.value.tasksLength > 0 &&
                  selectedEvents.value.tasks.map((task: TasksWithProject) => (
                    <div
                      key={task.task_id}
                      onClick={() => shownTask.value = task}
                      title={`A Task${task.task_priority ? " - Priority" : ""}${task.task_is_done ? " - DONE" : ""}`}
                      className="group cursor-pointer flex items-start p-3 bg-slate-100 border border-transparent rounded-xl transition-all shadow-sm hover:bg-slate-50 hover:border-slate-100 hover:shadow-md"
                    >
                      <div
                        className={`w-1 shrink-0 h-full min-h-10 rounded-full mr-3 ${task.task_priority ? "bg-background" : "bg-[#2eaadb]"}`}
                      ></div>
                      <div>
                        <h4 className="text-md font-bold text-slate-800">
                          {task.task_title}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                          {task.project_title}
                        </p>
                      </div>
                    </div>
                  ))}

                {selectedEvents.value.unsortedsLength > 0 &&
                  selectedEvents.value.unsorteds.map(
                    (unsorted: UnsortedTask) => (
                      <div
                        key={unsorted.unsorted_id}
                        onClick={() => shownUnsorted.value = unsorted}
                        title={`${unsorted.priority ? "An Unsorted Task - Priority" : "An Unsorted Task"}`}
                        className="group cursor-pointer flex items-start justify-between p-3 border border-transparent rounded-xl transition-all shadow-sm hover:bg-slate-50 hover:border-slate-100 hover:shadow-md"
                      >
                        <div>
                          <h4 className="text-md font-bold text-slate-800">
                            {unsorted.unsorted_title}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1">
                            {unsorted.unsorted_desc}
                          </p>
                        </div>
                        <div
                          className={`w-1 shrink-0 h-full min-h-10 rounded-full mr-3 ${unsorted.priority ? "bg-background" : "bg-[#2eaadb]"}`}
                        ></div>
                      </div>
                    )
                  )}

                {selectedEvents.value.tasksLength == 0 &&
                  selectedEvents.value.unsortedsLength == 0 && (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                        ✨
                      </div>
                      <p className="text-xs font-bold">No events scheduled</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {shownTask.value &&
        <TaskDetails
          taskSignal={shownTask}
          setErrorMessage={setErrorMessage}
          isDemo={isDemo}
        />
      }
      {shownUnsorted.value && <UnsortedDetails unsortedSignal={shownUnsorted} />}

      {errorMessage.value && (
        <ErrorMessage
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
}

interface DataWindow extends Window, BackEndData { }
const dataWindow = window as unknown as DataWindow;

render(
  <App
    dueDatesTasksList={dataWindow.dueDatesTasksList}
    dueDatesUnsortedsList={dataWindow.dueDatesUnsortedsList}
    dueDatesHabitsList={dataWindow.dueDatesHabitsList}
    isDemo={dataWindow.isDemo || false}
  />,
  document.getElementById("calendar")!
);
