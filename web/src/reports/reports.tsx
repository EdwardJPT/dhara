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

function calculateTaskStats(tasks: Task[]): TaskStats {
  const stats: TaskStats = {
    total_all_time: 0, done_all_time: 0, completed_all_time: 0,
    total_this_week: 0, done_this_week: 0, completed_this_week: 0,
    total_this_month: 0, done_this_month: 0, completed_this_month: 0,
    total_this_quarter: 0, done_this_quarter: 0, completed_this_quarter: 0,
    total_this_semester: 0, done_this_semester: 0, completed_this_semester: 0,
    total_this_year: 0, done_this_year: 0, completed_this_year: 0,
    total_last_7_days: 0, done_last_7_days: 0, completed_last_7_days: 0,
    total_last_30_days: 0, done_last_30_days: 0, completed_last_30_days: 0,
    total_last_90_days: 0, done_last_90_days: 0, completed_last_90_days: 0,
    total_last_180_days: 0, done_last_180_days: 0, completed_last_180_days: 0,
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

  const periods = [
    ["this_week", startOfWeek, endOfWeek],
    ["this_month", startOfMonth, endOfMonth],
    ["this_quarter", startOfQuarter, endOfQuarter],
    ["this_semester", startOfSemester, endOfSemester],
    ["this_year", startOfYear, endOfYear],
    ["last_7_days", startLast7, endRolling],
    ["last_30_days", startLast30, endRolling],
    ["last_90_days", startLast90, endRolling],
    ["last_180_days", startLast180, endRolling],
  ] as const;

  // Both due dates and completion dates use the same local-time boundaries.
  const inRange = (d: Date, start: Date, end: Date) =>
    (d.getTime() >= start.getTime()) && (d.getTime() < end.getTime());

  for (const t of tasks) {
    // Completion counts are independent of whether the task has a due date.
    if (t.is_done) {
      stats.completed_all_time++;
      const doneDate = new Date(t.done_date * 1000);
      for (const [period, start, end] of periods) {
        if (inRange(doneDate, start, end)) {
          stats[`completed_${period}`]++;
        }
      }
    }

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
    stats.total_all_time++;
    if (t.is_done) stats.done_all_time++;

    for (const [period, start, end] of periods) {
      if (inRange(dueDate, start, end)) {
        stats[`total_${period}`]++;
        if (t.is_done) stats[`done_${period}`]++;
      }
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
  const tasks = useSignal(loadDemoData("demo_tasks", taskList, isDemo));
  const reportProjects = useComputed(() =>
    isDemo ? projects.value.filter(project => !project.hide) : projects.value
  );
  const reportTasks = useComputed(() => {
    if (!isDemo) return tasks.value;
    const projectIDs = new Set(reportProjects.value.map(project => project.project_id));
    return tasks.value.filter(task => projectIDs.has(task.project_id));
  });

  const computedTaskStats = useComputed(() => {
    if (!isDemo) return taskStats;
    return calculateTaskStats(reportTasks.value);
  });

  // Keep reports in sync with demo edits made in other tabs.
  useSignalEffect(() => {
    if (!isDemo) return;

    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (e.key === "demo_projects" || e.key === null) {
          projects.value = e.newValue ? JSON.parse(e.newValue) : projectList;
        }
        if (e.key === "demo_tasks" || e.key === null) {
          tasks.value = e.newValue ? JSON.parse(e.newValue) : taskList;
        }
      } catch (err) {
        console.error("Error parsing updated demo data from storage event", err);
      }
    };

    window.addEventListener("storage", handleStorageChange);
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
        projects={reportProjects}
        tasks={reportTasks}
        taskStats={computedTaskStats}
        isDemo={isDemo}
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
