import { render } from "preact";
import { Signal, useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { useMemo } from "preact/hooks";

import { MonthBlock } from "./calendar.monthBlock";
import { TaskDetails } from "./calendar.task";
import { UnsortedDetails } from "./calendar.unsorted";
import { getCalendarAgenda, groupCalendarEvents, ShowMode } from "./calendar.events";
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
const completed = "completed";

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

  const showMode = useSignal<ShowMode>(all);
  const taskEvents = useComputed(() => groupCalendarEvents(
    tasksListSignal.value,
    showMode.value,
    (task) => task.task_is_done,
    (task) => task.task_done_date,
  ));
  const unsortedEvents = useComputed(() => groupCalendarEvents(
    unsortedsListSignal.value,
    showMode.value,
    (unsorted) => unsorted.is_done,
    (unsorted) => unsorted.done_date,
  ));

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
    const tasks = getCalendarAgenda(taskEvents.value, selectedDate.value, (task) => task.task_id);
    const unsorteds = getCalendarAgenda(unsortedEvents.value, selectedDate.value, (unsorted) => unsorted.unsorted_id);

    return [
      {
        kind: "due",
        title: "Due on this day",
        description: "Tasks and unsorted tasks due on the selected date.",
        tasks: tasks.due,
        unsorteds: unsorteds.due,
      },
      {
        kind: "completed",
        title: "Completed on this day",
        description: "Tasks and unsorted tasks completed on the selected date.",
        tasks: tasks.completed,
        unsorteds: unsorteds.completed,
      },
    ].filter((section) => section.tasks.length > 0 || section.unsorteds.length > 0);
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
                dueDatesTasksList={taskEvents.value.dueDates}
                dueDatesUnsortedsList={unsortedEvents.value.dueDates}
                completedTasksList={taskEvents.value.completedDates}
                completedUnsortedsList={unsortedEvents.value.completedDates}
              />
            ))}
          </div>
        </div>

        {/* --- RIGHT: AGENDA SIDEBAR --- */}
        <div>
          {" "}
          {/* To make the sticky work */}
          <div className="xl:w-80 flex flex-col sticky top-10">
            {/* Filters */}
            <div className="mt-1.5 mb-5.5 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800">
                  Filter
                </h4>
                <span className="text-xs text-slate-400">
                  Task status
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 rounded-md bg-slate-100 p-1">
                {([
                  { value: all, label: "All" },
                  { value: unfinished, label: "Unfinished" },
                  { value: completed, label: "Completed" },
                ] as const).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => (showMode.value = value)}
                    aria-pressed={showMode.value === value}
                    className={`cursor-pointer rounded-md px-1 py-2 text-xs font-bold transition-all ${showMode.value === value
                      ? "bg-background text-white shadow-sm"
                      : "text-slate-500 hover:bg-white hover:text-slate-700"
                      }`}
                  >
                    {label}
                  </button>
                ))}
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
                {selectedEvents.value.map((section) => (
                  <section key={section.kind} className="space-y-3 pt-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        {section.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {section.description}
                      </p>
                    </div>
                    {section.tasks.map((task: TasksWithProject) => (
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
                          {section.kind === "completed" && task.task_due_date === selectedDate.value && (
                            <p className="mt-1 text-xs font-semibold text-background">
                              Also due on this day
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {section.unsorteds.map(
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
                            {section.kind === "completed" && unsorted.due_date === selectedDate.value && (
                              <p className="mt-1 text-xs font-semibold text-background">
                                Also due on this day
                              </p>
                            )}
                          </div>
                          <div
                            className={`w-1 shrink-0 h-full min-h-10 rounded-full mr-3 ${unsorted.priority ? "bg-background" : "bg-[#2eaadb]"}`}
                          ></div>
                        </div>
                      )
                    )}
                  </section>
                ))}

                {selectedEvents.value.length === 0 && (
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
