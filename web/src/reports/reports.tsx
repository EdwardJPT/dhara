import { render } from "preact";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals";

import { ProjectsReports } from "./reports.project";
import { HabitsReports } from "./reports.habit";

import {
  Project,
  Task,
  TaskStats,
  HabitDoneToday,
  HabitBestWorstStats,
  GroupWithHabitsStats,
  AllPeaksMap,
  MonthlyConsistency,
  WeeklyConsistency,
} from "./types";

interface BackEndData {
  username: string;
  projectList: Project[];
  taskList: Task[];
  taskStats: TaskStats;
  habitsDoneToday: HabitDoneToday[];
  habitsBestWorstStats: HabitBestWorstStats;
  habitsGroupStats: GroupWithHabitsStats[];
  habitsProductivityPeaks: AllPeaksMap;
  habitsMonthlyConsistency: MonthlyConsistency[];
  habitsWeeklyConsistency: WeeklyConsistency;
  isDemo: boolean;
}

interface AppProps extends BackEndData { }

function calculateTaskStats(tasks: Task[]) {
  const stats = {
    allTimeTotal: 0, allTimeDone: 0,
    thisWeekTotal: 0, thisWeekDone: 0,
    thisMonthTotal: 0, thisMonthDone: 0,
    currentQuarterTotal: 0, currentQuarterDone: 0,
    currentSemesterTotal: 0, currentSemesterDone: 0,
    thisYearTotal: 0, thisYearDone: 0,
    last7DaysTotal: 0, last7DaysDone: 0,
    last30DaysTotal: 0, last30DaysDone: 0,
    last90DaysTotal: 0, last90DaysDone: 0,
    last180DaysTotal: 0, last180DaysDone: 0,
  };

  const now = new Date();

  // Truncate "now" to midnight today in the local timezone
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Define Calendar Boundaries
  // This Week: JS getDay() treats Sunday as 0, matching Go's time.Weekday()
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 7);

  // This Month
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  // Current Quarter
  const qMonth = Math.floor(today.getMonth() / 3) * 3;
  const startOfQuarter = new Date(today.getFullYear(), qMonth, 1);
  const endOfQuarter = new Date(today.getFullYear(), qMonth + 3, 1);

  // Current Semester
  const sMonth = Math.floor(today.getMonth() / 6) * 6;
  const startOfSemester = new Date(today.getFullYear(), sMonth, 1);
  const endOfSemester = new Date(today.getFullYear(), sMonth + 6, 1);

  // This Year
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const endOfYear = new Date(today.getFullYear() + 1, 0, 1);

  // Define Rolling Timeframe Boundaries
  const endRolling = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const startLast7 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  const startLast30 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
  const startLast90 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);
  const startLast180 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 180);

  // Helper to check if the due date falls inside the bounds
  const inRange = (d: Date, start: Date, end: Date) =>
    d.getTime() >= start.getTime()
    && d.getTime() < end.getTime();

  for (const t of tasks) {
    if (!t.due_date) continue;

    // Parse 'YYYY-MM-DD' safely as local midnight to prevent UTC timezone shifting
    const dateParts = t.due_date.split('-');
    if (dateParts.length !== 3) continue;

    // JS Months are 0-indexed (January = 0)
    const dueDate = new Date(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2])
    );

    // Check if valid date
    if (isNaN(dueDate.getTime())) continue;

    // All Time
    stats.allTimeTotal++;
    if (t.is_done) stats.allTimeDone++;

    // This Week
    if (inRange(dueDate, startOfWeek, endOfWeek)) {
      stats.thisWeekTotal++;
      if (t.is_done) stats.thisWeekDone++;
    }

    // This Month
    if (inRange(dueDate, startOfMonth, endOfMonth)) {
      stats.thisMonthTotal++;
      if (t.is_done) stats.thisMonthDone++;
    }

    // Current Quarter
    if (inRange(dueDate, startOfQuarter, endOfQuarter)) {
      stats.currentQuarterTotal++;
      if (t.is_done) stats.currentQuarterDone++;
    }

    // Current Semester
    if (inRange(dueDate, startOfSemester, endOfSemester)) {
      stats.currentSemesterTotal++;
      if (t.is_done) stats.currentSemesterDone++;
    }

    // This Year
    if (inRange(dueDate, startOfYear, endOfYear)) {
      stats.thisYearTotal++;
      if (t.is_done) stats.thisYearDone++;
    }

    // Last 7 Days
    if (inRange(dueDate, startLast7, endRolling)) {
      stats.last7DaysTotal++;
      if (t.is_done) stats.last7DaysDone++;
    }

    // Last 30 Days
    if (inRange(dueDate, startLast30, endRolling)) {
      stats.last30DaysTotal++;
      if (t.is_done) stats.last30DaysDone++;
    }

    // Last 90 Days
    if (inRange(dueDate, startLast90, endRolling)) {
      stats.last90DaysTotal++;
      if (t.is_done) stats.last90DaysDone++;
    }

    // Last 180 Days
    if (inRange(dueDate, startLast180, endRolling)) {
      stats.last180DaysTotal++;
      if (t.is_done) stats.last180DaysDone++;
    }
  }

  return stats;
}

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
  username,
  projectList,
  taskList,
  taskStats,
  habitsDoneToday,
  habitsBestWorstStats,
  habitsGroupStats,
  habitsProductivityPeaks,
  habitsMonthlyConsistency,
  habitsWeeklyConsistency,
  isDemo = false,
}: AppProps) {
  const projects = useSignal(loadDemoData("demo_projects", projectList, isDemo));
  useSignalEffect(() => {
    // Explicitly reading .value outside the condition forces Preact to track it
    const currentProjects = projects.value;
    if (isDemo) {
      localStorage.setItem("demo_projects", JSON.stringify(currentProjects));
    }
  });

  const tasks = useSignal(loadDemoData("demo_tasks", taskList, isDemo));
  useSignalEffect(() => {
    const currentTasks = tasks.value;
    if (isDemo) {
      localStorage.setItem("demo_tasks", JSON.stringify(currentTasks));
    }
  });

  const computedTaskStats = useComputed(() => {
    if (isDemo) {
      return calculateTaskStats(tasks.value);
    }
    return taskStats;
  });

  // Handle cross-tab/window localStorage sync in Demo Mode using useSignalEffect
  useSignalEffect(() => {
    if (!isDemo) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "demo_tasks" && e.newValue) {
        try {
          // Writing to tasks.value automatically triggers taskStats to recompute
          tasks.value = JSON.parse(e.newValue);
        } catch (err) {
          console.error("Error parsing updated demo_tasks from storage event", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    // Return the cleanup function just like you would in useEffect
    return () => window.removeEventListener("storage", handleStorageChange);
  });

  return (
    <div className="min-h-screen font-sans flex flex-col items-center mx-auto px-4 sm:px-6 lg:px-2 pb-12 mt-10 md:mt-0 w-full overflow-x-hidden">
      <div className="pb-6 flex flex-col w-full max-w-6xl lg:w-6xl items-start">
        <h1 className="text-3xl md:text-4xl mb-0.5 text-background font-bold">
          Reports Dashboard
        </h1>
        <p className="text-background text-lg font-bold wrap-break-words w-full">
          Insights for {username}
        </p>
      </div>

      <ProjectsReports
        projects={projects}
        tasks={tasks}
        taskStats={computedTaskStats}
      />

      <div className="my-7.5"></div>

      <HabitsReports
        habitsDoneToday={habitsDoneToday ?? []}
        habitsBestWorstStats={habitsBestWorstStats ?? {}}
        habitsGroupStats={habitsGroupStats ?? []}
        habitsProductivityPeaks={habitsProductivityPeaks ?? {}}
        habitsMonthlyConsistency={habitsMonthlyConsistency ?? []}
        habitsWeeklyConsistency={habitsWeeklyConsistency ?? {}}
      />
    </div>
  );
};

interface DataWindow extends Window, BackEndData { }
const dataWindow = window as unknown as DataWindow;

render(
  <App
    username={dataWindow.username}
    projectList={dataWindow.projectList}
    taskList={dataWindow.taskList}
    taskStats={dataWindow.taskStats}
    habitsDoneToday={dataWindow.habitsDoneToday}
    habitsBestWorstStats={dataWindow.habitsBestWorstStats}
    habitsGroupStats={dataWindow.habitsGroupStats}
    habitsProductivityPeaks={dataWindow.habitsProductivityPeaks}
    habitsMonthlyConsistency={dataWindow.habitsMonthlyConsistency}
    habitsWeeklyConsistency={dataWindow.habitsWeeklyConsistency}
    isDemo={dataWindow.isDemo || false}
  />,
  document.getElementById("reports")!
);
