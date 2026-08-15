import { ReadonlySignal, Signal, useComputed, useSignal } from "@preact/signals";

import TimeToggle from "./reports.timeToggle";
import { useDateRange, TimeRangeType } from "./hooks";
import { padList, isTimestampWithinRange, isDateWithinRange } from "./utils";
import {
  formattingDateProject,
  formattingDateTask,
  ReportsTimeRange,
  TaskStatsKeyMap,
} from "../components/constants";

import { Project, Task, TaskStats } from "./types";

interface VelocityChartProps {
  data: number[];
  labels: string[];
}

const countVelocityChartData = (
  tasks: Task[],
  range: TimeRangeType,
  rangeDate: { start: Date, end: Date },
): VelocityChartProps => {
  const now = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Handle SQLite UNIXEPOCH() (converts seconds to milliseconds)
  const getDoneDate = (timestamp: number) => new Date(timestamp * 1000);

  // Apply strict rangeDate boundary filtering (same logic as upcoming projects)
  const completedTasks = tasks.filter((t) => {
    if (!t.is_done || !t.done_date) return false;

    const doneDate = getDoneDate(t.done_date);
    const startDate = rangeDate.start;
    const endDate = rangeDate.end;

    // If ALL, skip boundaries. Otherwise, enforce the rangeDate boundaries.
    if (range === ReportsTimeRange.ALL) return true;
    if (startDate && endDate) {
      return doneDate >= startDate && doneDate <= endDate;
    }
    return true;
  });

  // Initialize output arrays
  let data: number[] = [];
  let labels: string[] = [];

  // ThisWeek and Last 7 Days
  if (range === ReportsTimeRange.ThisWeek) {
    // Starts strictly from Sunday of the current week
    data = new Array(7).fill(0);
    labels = [...dayNames];

    const currentDayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    completedTasks.forEach((t) => {
      const tDate = getDoneDate(t.done_date);
      const diffDays = Math.floor((tDate.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24));
      // If it falls within the current Sun-Sat week
      if (diffDays >= 0 && diffDays < 7) data[diffDays]++;
    });
  }
  else if (range === ReportsTimeRange.SevenDays) {
    // Rolling 7 days backwards from today
    data = new Array(7).fill(0);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      labels.push(dayNames[d.getDay()]);
    }

    const startOf7Days = new Date(now);
    startOf7Days.setDate(now.getDate() - 6);
    startOf7Days.setHours(0, 0, 0, 0);

    completedTasks.forEach((t) => {
      const tDate = getDoneDate(t.done_date);
      const diffDays = Math.floor((tDate.getTime() - startOf7Days.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) data[diffDays]++;
    });
  }
  // ThisMonth and Last 30 Days
  else if (range === ReportsTimeRange.ThisMonth) {
    // Current Calendar month divided into 4 rough weeks (Days 1-7, 8-14, 15-21, 22-end)
    data = new Array(4).fill(0);
    labels = ["W1", "W2", "W3", "W4"];

    completedTasks.forEach((t) => {
      const tDate = getDoneDate(t.done_date);
      if (tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear()) {
        const dateNum = tDate.getDate();
        const weekIdx = Math.min(Math.floor((dateNum - 1) / 7), 3); // Caps at index 3 (W4)
        data[weekIdx]++;
      }
    });
  }
  else if (range === ReportsTimeRange.ThirtyDays) {
    // Rolling 4 weeks backwards from today
    data = new Array(4).fill(0);
    labels = ["W1", "W2", "W3", "W4"];
    const msInWeek = 7 * 24 * 60 * 60 * 1000;

    completedTasks.forEach((t) => {
      const diffMs = now.getTime() - getDoneDate(t.done_date).getTime();
      const weekIdx = Math.floor(diffMs / msInWeek);
      // weekIdx 0 = most recent 7 days (W4)
      if (weekIdx >= 0 && weekIdx < 4) data[3 - weekIdx]++;
    });
  }
  // ThreeMonths/Quarter and Last 90 Days
  else if (range === ReportsTimeRange.ThreeMonths) {
    // Current Quarter (Strictly starts Jan, Apr, Jul, Oct)
    data = new Array(3).fill(0);
    const currentQuarterStart = Math.floor(now.getMonth() / 3) * 3;
    for (let i = 0; i < 3; i++) labels.push(monthNames[currentQuarterStart + i]);

    completedTasks.forEach((t) => {
      const tDate = getDoneDate(t.done_date);
      if (tDate.getFullYear() === now.getFullYear()) {
        const m = tDate.getMonth();
        if (m >= currentQuarterStart && m < currentQuarterStart + 3) {
          data[m - currentQuarterStart]++;
        }
      }
    });
  }
  else if (range === ReportsTimeRange.NinetyDays) {
    // Rolling 3 Calendar Months ending on the current month
    data = new Array(3).fill(0);
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(monthNames[d.getMonth()]);
    }

    completedTasks.forEach((t) => {
      const tDate = getDoneDate(t.done_date);
      const monthDiff = (now.getFullYear() - tDate.getFullYear()) * 12 + (now.getMonth() - tDate.getMonth());
      if (monthDiff >= 0 && monthDiff < 3) data[2 - monthDiff]++;
    });
  }
  // SixMonths/Semester and Last 180 Days
  else if (range === ReportsTimeRange.SixMonths) {
    // Current Semester (Strictly starts Jan or Jul)
    data = new Array(6).fill(0);
    const currentSemesterStart = now.getMonth() < 6 ? 0 : 6;
    for (let i = 0; i < 6; i++) labels.push(monthNames[currentSemesterStart + i]);

    completedTasks.forEach((t) => {
      const tDate = getDoneDate(t.done_date);
      if (tDate.getFullYear() === now.getFullYear()) {
        const m = tDate.getMonth();
        if (m >= currentSemesterStart && m < currentSemesterStart + 6) {
          data[m - currentSemesterStart]++;
        }
      }
    });
  }
  else if (range === ReportsTimeRange.HundredEightyDays) {
    // Rolling 6 Calendar Months ending on the current month
    data = new Array(6).fill(0);
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(monthNames[d.getMonth()]);
    }

    completedTasks.forEach((t) => {
      const tDate = getDoneDate(t.done_date);
      const monthDiff = (now.getFullYear() - tDate.getFullYear()) * 12 + (now.getMonth() - tDate.getMonth());
      if (monthDiff >= 0 && monthDiff < 6) data[5 - monthDiff]++;
    });
  }
  // ThisYear
  else if (range === ReportsTimeRange.ThisYear) {
    // Calendar Year (Jan-Dec)
    data = new Array(12).fill(0);
    labels = [...monthNames];
    completedTasks.forEach((t) => {
      const tDate = getDoneDate(t.done_date);
      if (tDate.getFullYear() === now.getFullYear()) data[tDate.getMonth()]++;
    });
  }
  // ALL
  else if (range === ReportsTimeRange.ALL) {
    // Groups "ALL" dynamically by Year
    const yearMap = new Map<number, number>();
    completedTasks.forEach((t) => {
      const y = getDoneDate(t.done_date).getFullYear();
      yearMap.set(y, (yearMap.get(y) || 0) + 1);
    });

    const sortedYears = Array.from(yearMap.keys()).sort();
    if (sortedYears.length === 0) {
      labels = [now.getFullYear().toString()];
      data = [0];
    } else {
      labels = sortedYears.map(String);
      data = sortedYears.map(y => yearMap.get(y)!);
    }
  }
  return { data, labels };
};

const VelocityChart = ({ data, labels }: VelocityChartProps) => {
  const max = Math.max(...data, 1); // Avoid divide by zero

  return (
    <div className="flex flex-col bg-[#e0fffd]/50 px-2 w-full">
      <div className="w-full h-32 flex items-end justify-between gap-1 sm:gap-2 mt-2">
        {data.map((val, i) => {
          const heightPercent = (val / max) * 100;
          return (
            <div
              key={i}
              className="flex flex-col items-center flex-1 h-full justify-end group"
            >
              {/* Tooltip */}
              <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-sm py-1 px-2 rounded absolute -mt-8 z-10">
                {val} task{val != 1 ? "s" : ""}
              </div>

              {/* Bar */}
              <div
                className="w-full max-w-6 bg-indigo-100 hover:bg-indigo-500 rounded-t-md relative transition-all duration-500 ease-out"
                style={{ height: `${heightPercent}%` }}
              ></div>

              {/* Label */}
              <span className="mt-2 text-[10px] sm:text-xs text-slate-500 font-bold uppercase truncate">
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>
      <p class="text-[13px] text-slate-500 font-medium tracking-wider mx-auto mt-1.5 text-center">
        What's done during this period
      </p>
    </div>
  );
};

interface DonutChartProps {
  percentage?: number;
  color?: string;
  label: string;
}

const DonutChart = ({ percentage = 50, color = "text-indigo-600", label }: DonutChartProps) => {
  const bgThickness = 4;
  const progressThickness = 8;

  const maxStroke = Math.max(bgThickness, progressThickness);
  const normalizedRadius = 50 - maxStroke / 2 - 2;

  const safePercentage = Number(percentage) || 0;

  // pathLength="100" trick
  const offset = 100 - safePercentage;

  return (
    <div className="relative flex items-center justify-center w-40 h-40" >
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        class="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          stroke="#94a3b8"
          fill="transparent"
          r={normalizedRadius}
          cx="50"
          cy="50"
          stroke-width={bgThickness}
          stroke-dasharray="2 2"
        />

        {/* Progress Circle */}
        <circle
          class={`${color} transition-all duration-1000 ease-out`}
          stroke="currentColor"
          fill="transparent"
          r={normalizedRadius}
          cx="50"
          cy="50"
          pathLength="100"
          stroke-width={progressThickness}
          stroke-dasharray="100"
          stroke-dashoffset={offset}
          stroke-linecap="round"
        />
      </svg>
      <div class="absolute flex flex-col items-center">
        <span class="text-2xl font-black text-slate-800">
          {safePercentage}%
        </span>
        <span class="text-[10px] uppercase text-slate-400 font-bold tracking-wider text-center">
          {label}
        </span>
      </div>
    </div>
  );
};

interface ProjectProgressCardProps {
  project: Project | null;
  isEven: boolean;
  dateLabel: string;
  dueLabel?: string;
}

const ProjectProgressCard = ({
  project,
  isEven,
  dateLabel,
  dueLabel,
}: ProjectProgressCardProps) => {
  if (!project) {
    return <div className={`group min-h-18 ${isEven ? "" : "bg-[#e0fffd]"}`}></div>;
  }

  const progressPercentage = Math.round((project.to_dos_done / project.to_dos_all) * 100) || 0;

  return (
    <div className={`group min-h-18 px-3 sm:px-2 py-3 sm:py-2 ${isEven ? "" : "bg-[#e0fffd]"}`}>
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-600 text-base wrap-break-words">
            {project.project_title}
          </span>
          {project.priority && (
            <span class="inline-flex items-center rounded-xl bg-red-100 p-1 text-xs font-medium text-red-500">
              Priority
            </span>
          )}
        </div>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded shrink-0">
          {progressPercentage}%
        </span>
      </div>
      {/* Progress Bar Track */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        {/* Progress Bar Fill */}
        <div
          className="bg-indigo-300 h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-indigo-400 relative"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-2 sm:mt-1.5 gap-1.5 sm:gap-0">
        <span className="text-sm text-slate-400 font-semibold">
          {project.to_dos_done}/{project.to_dos_all} Tasks
        </span>
        <div className="flex flex-col">
          <span className="text-sm text-slate-400 font-semibold text-left sm:text-right">
            {dueLabel}
          </span>
          <span className="text-sm text-slate-400 font-semibold text-left sm:text-right">
            {dateLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: Task | null;
  projectName: string;
  isEven: boolean;
  dateLabel: string;
}

const TaskCard = ({ task, projectName, isEven, dateLabel }: TaskCardProps) => {
  if (!task) {
    return <div className={`${isEven ? "bg-[#e0fffd]" : ""} min-h-18`}></div>;
  }

  return (
    <div
      id={`container-task-${task.task_id}`}
      class={`${isEven ? "bg-[#e0fffd]" : ""} flex flex-col sm:flex-row items-start min-h-18 pt-3 sm:pt-2 pb-4 sm:pb-2 px-3 sm:px-1`}
    >
      <div class="ml-0 sm:ml-3 w-full sm:w-7/10 text-gray-900">
        <p class="font-medium text-slate-700 text-base wrap-break-words">
          {task.task_title}&nbsp;
          {task.priority && (
            <span class="inline-flex items-center rounded-full bg-red-100 p-1 text-xs font-medium text-red-400 mt-1 sm:mt-0">
              Priority
            </span>
          )}
        </p>
        <p class="max-h-48 overflow-y-auto text-[15px] text-gray-700">
          {task.task_desc}
        </p>
      </div>

      <div class="mt-3 sm:mt-0 ml-0 sm:ml-4 flex flex-col w-full sm:w-3/10 items-start sm:items-end justify-center text-left sm:text-right text-lg font-semibold text-gray-600">
        <span class="text-base text-slate-500 font-medium">
          {projectName}
        </span>
        <span class="text-sm text-slate-400">
          {dateLabel}
        </span>
      </div>
    </div>
  );
};

interface ProjectsReportsProps {
  projects: Signal<Project[]>;
  tasks: Signal<Task[]>;
  taskStats: ReadonlySignal<TaskStats>;
}

export function ProjectsReports({
  projects,
  tasks,
  taskStats,
}: ProjectsReportsProps) {
  const timeRange: Signal<TimeRangeType> = useSignal(ReportsTimeRange.ThisWeek);
  const setTimeRage = (range: TimeRangeType) => (timeRange.value = range);

  const rangeDate = useDateRange(timeRange);

  const projectsStats = useComputed(() => {
    let allProjects = 0;
    let completeProjects = 0;
    const isAll = timeRange.value === ReportsTimeRange.ALL;

    projects.value.forEach((project) => {
      if (
        isDateWithinRange(
          project.due_date, rangeDate.value.start, rangeDate.value.end, isAll,
        )
      ) {
        allProjects += 1;
        if (project.is_done) completeProjects += 1;
      }
    });

    const taskStatsKeyAll = TaskStatsKeyMap[timeRange.value].total as keyof TaskStats;
    const taskStatsKeyDone = TaskStatsKeyMap[timeRange.value].done as keyof TaskStats;
    const allTasks: number = taskStats.value[taskStatsKeyAll];
    const completeTasks: number = taskStats.value[taskStatsKeyDone];

    return { allProjects, completeProjects, allTasks, completeTasks };
  });

  const percetageCompletedProjects = useComputed(() => {
    const { allProjects } = projectsStats.value;
    const { completeProjects } = projectsStats.value;
    return Math.round((completeProjects / allProjects) * 100);
  });

  const percetageCompletedTasks = useComputed(() => {
    const { allTasks } = projectsStats.value;
    const { completeTasks } = projectsStats.value;
    return Math.round((completeTasks / allTasks) * 100);
  });

  const finishedProjects = useComputed(() => {
    const isAll = timeRange.value === ReportsTimeRange.ALL;
    const projectList = projects.value.filter((project) => {
      if (!project.is_done) return false;
      return isTimestampWithinRange(
        project.done_date, rangeDate.value.start, rangeDate.value.end, isAll,
      );
    });

    const sortedProject = projectList.sort((a, b) => b.done_date - a.done_date);
    return padList(sortedProject, 3);
  });

  const upcomingProjects = useComputed(() => {
    const isAll = timeRange.value === ReportsTimeRange.ALL;
    const projectList = projects.value.filter((project) => {
      // if (project.is_done) return false;
      return isDateWithinRange(project.due_date, rangeDate.value.start, rangeDate.value.end, isAll);
    });

    const sortedProject = projectList.sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    );
    return padList(sortedProject, 3);
  });

  const upcomingTasks = useComputed(() => {
    const isAll = timeRange.value === ReportsTimeRange.ALL;
    const taskList = tasks.value.filter((task) => {
      if (task.is_done) return false;
      return isDateWithinRange(task.due_date, rangeDate.value.start, rangeDate.value.end, isAll);
    });

    const sortedTask = taskList.sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    );
    return padList(sortedTask, 3);
  });

  const finishedTasks = useComputed(() => {
    const isAll = timeRange.value === ReportsTimeRange.ALL;
    const taskList = tasks.value.filter((task) => {
      if (!task.is_done) return false;
      return isTimestampWithinRange(task.done_date, rangeDate.value.start, rangeDate.value.end, isAll);
    });

    const sortedTask = taskList.sort((a, b) => b.done_date - a.done_date);
    return padList(sortedTask, 3);
  });

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
      projectObj[projects.value[i].project_id] = projects.value[i].project_title;
    }
    return projectObj;
  });

  const productivityPeaks = useComputed(() => {
    const allTasks = tasks.value;

    if (!allTasks || allTasks.length === 0) {
      return { peakHours: "N/A", peakDays: "N/A" };
    }

    const hourCounts = new Array(24).fill(0);
    const dayCounts = new Array(7).fill(0);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const isAll = timeRange.value === ReportsTimeRange.ALL;

    // Tally up the hours and days for completed tasks within the date range
    allTasks.forEach((task) => {
      if (task.is_done && task.done_date && isTimestampWithinRange(task.done_date, rangeDate.value.start, rangeDate.value.end, isAll)) {
        const date = new Date(task.done_date * 1000);
        hourCounts[date.getHours()]++;
        dayCounts[date.getDay()]++;
      }
    });

    // Find the Peak 2-Hour Window
    let maxHourCount = -1;
    let peakHourStart = 0;

    for (let i = 0; i < 24; i++) {
      const nextHour = (i + 1) % 24;
      const currentWindowCount = hourCounts[i] + hourCounts[nextHour];

      if (currentWindowCount > maxHourCount) {
        maxHourCount = currentWindowCount;
        peakHourStart = i;
      }
    }

    const formatHour = (h: number) => {
      const ampm = h >= 12 ? "PM" : "AM";
      const formatted = h % 12 === 0 ? 12 : h % 12;
      return `${formatted}${ampm}`;
    };

    const peakHoursStr = maxHourCount === 0
      ? "N/A"
      : `${formatHour(peakHourStart)}-${formatHour((peakHourStart + 2) % 24)}`;

    // Find the Peak Day
    let maxDayCount = -1;
    let peakDayIndex = 0;

    for (let i = 0; i < 7; i++) {
      if (dayCounts[i] > maxDayCount) {
        maxDayCount = dayCounts[i];
        peakDayIndex = i;
      }
    }

    const peakDaysStr = maxDayCount === 0 ? "N/A" : daysOfWeek[peakDayIndex];

    return {
      peakHours: peakHoursStr,
      peakDays: peakDaysStr
    };
  });

  const velocityData = useComputed(() => {
    return countVelocityChartData(tasks.value, timeRange.value, rangeDate.value);
  });

  return (
    <div className="bg-white py-6 sm:py-6 px-4 sm:px-8 w-full max-w-7xl mx-auto text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-5 gap-4 sm:gap-6">
        <div className="flex flex-col">
          <h1 className="text-[25px] text-background font-semibold">
            Project Progress
          </h1>
          <div className="flex items-center space-x-2 text-sm text-hover flex-wrap">
            <span className="font-semibold">
              {formattingDateTask(rangeDate.value.start.toLocaleDateString("en-CA"))}
            </span>
            <span className="text-background">&rarr;</span>
            <span className="font-semibold">
              {formattingDateTask(rangeDate.value.end.toLocaleDateString("en-CA"))}
            </span>
          </div>
        </div>

        <TimeToggle timeRange={timeRange.value} setTimeRange={setTimeRage} />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-4 sm:gap-3 items-center">
        <div className="col-span-1 md:col-span-2 lg:col-span-1 grid gap-y-3 sm:gap-y-2">
          <div className="grid col-span-1 grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              title={`All projects that due this ${timeRange.value.toLowerCase()}`}
              className="bg-[#e0fffd] flex items-center p-4 md:col-span-1 border-l-6 border-l-background"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-200 text-indigo-600 rounded-xl shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-background text-xs font-bold uppercase tracking-wider">
                    All Projects
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-600">
                    {projectsStats.value.allProjects}
                  </p>
                </div>
              </div>
            </div>

            <div
              title={`Completed projects that due this ${timeRange.value.toLowerCase()}`}
              className="bg-[#e0fffd] flex items-center p-4 md:col-span-1 border-l-6 border-l-background"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-300 text-background rounded-xl shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-background text-xs font-bold uppercase tracking-wider">
                    Completed Projects
                  </p>
                  <div className="flex flex-row items-end gap-2">
                    <p className="text-2xl sm:text-3xl font-black text-slate-600">
                      {projectsStats.value.completeProjects}
                    </p>
                    <p class="text-sm text-slate-500 font-semibold mb-1">
                      ({percetageCompletedProjects}% of total)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TASKS SECTION */}
          <div className="grid col-span-1 grid-cols-1 sm:grid-cols-2 gap-3 mt-1 sm:mt-0">
            <div
              title={`All tasks that due this ${timeRange.value.toLowerCase()}`}
              className="bg-[#effcf9] flex items-center p-4 md:col-span-1 border-l-6 border-l-hover min-h-16"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-background text-xs font-bold uppercase tracking-wider">
                    All Task
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-slate-500">
                    {projectsStats.value.allTasks}
                  </p>
                </div>
              </div>
            </div>

            <div
              title={`Completed tasks that due this ${timeRange.value.toLowerCase()}`}
              className="bg-[#effcf9] flex items-center p-4 md:col-span-1 border-l-6 border-l-hover min-h-16"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-200 text-background rounded-xl shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-background text-xs font-bold uppercase tracking-wider">
                    Completed Tasks
                  </p>
                  <div className="flex flex-row items-end gap-2">
                    <p className="text-xl sm:text-2xl font-black text-slate-500">
                      {projectsStats.value.completeTasks}
                    </p>
                    <p class="text-sm text-slate-500 font-semibold mb-1">
                      ({percetageCompletedTasks}% of total)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-4 md:col-span-1 h-full sm:h-4/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 bg-linear-to-br from-background to-hover text-white border-none shadow-lg shadow-indigo-200 rounded-xl sm:rounded-none">
          <div>
            <h3 className="text-xl font-bold">Focus Score</h3>
            <p className="text-indigo-100 text-base mt-2 sm:mt-1 max-w-xs">
              You do{" "}
              <span className="font-bold text-white">
                {percetageCompletedProjects}%
              </span>{" "}
              more this {timeRange.value.toLowerCase()} compared to previous
              period.
            </p>
          </div>
          <button className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors backdrop-blur-sm border border-white/10 w-full sm:w-auto mt-2 sm:mt-0">
            See Comparison
          </button>
        </div>
      </section>

      <section className="grid items-center gap-6 sm:gap-3 mt-10 sm:mt-7.5 lg:grid-cols-2 grid-cols-1">
        <div className="md:col-span-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-500 mb-4">
            Upcoming Projects
          </h3>
          <div className="flex flex-col gap-4 sm:gap-6">
            {upcomingProjects.value.map((proj, i) =>
              <ProjectProgressCard
                key={proj ? proj.project_id : `empty-proj-${i}`}
                project={proj}
                isEven={i % 2 === 0}
                dateLabel={proj ? `Due: ${formattingDateTask(proj.due_date)}` : ""}
              />
            )}
          </div>
        </div>

        <div className="md:col-span-1 mt-2 sm:mt-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-500 mb-4">
            Upcoming Tasks
          </h3>
          <div className="flex flex-col gap-4 sm:gap-6">
            {upcomingTasks.value && upcomingTasks.value.map((task, i) =>
              <TaskCard
                key={task ? task.task_id : `empty-upcoming-task-${i}`}
                task={task}
                projectName={task ? projectObj.value[task.project_id] : ""}
                isEven={i % 2 === 0}
                dateLabel={task ? `Due: ${formattingDateTask(task.due_date)}` : ""}
              />
            )}
          </div>
        </div>
      </section>

      <section className="grid items-center gap-6 sm:gap-3 mt-10 sm:mt-7.5 lg:grid-cols-2 grid-cols-1">
        <div className="md:col-span-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-500 mb-4">
            Recently Finished Projects
          </h3>
          <div className="flex flex-col gap-4 sm:gap-6">
            {finishedProjects.value.map((proj, i) =>
              <ProjectProgressCard
                key={proj ? proj.project_id : `empty-proj-${i}`}
                project={proj}
                isEven={i % 2 === 0}
                dueLabel={proj?.is_done ? `Due  : ${formattingDateProject(proj.due_date)}` : ""}
                dateLabel={proj ? `DONE : ${formattingDateProject(new Date(proj.done_date * 1000).toLocaleDateString("en-CA"))}` : ""}
              />
            )}
          </div>
        </div>

        <div className="md:col-span-1 mt-2 sm:mt-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-500 mb-4">
            Recently Finished Tasks
          </h3>
          <div className="flex flex-col gap-4 sm:gap-6">
            {finishedTasks.value && finishedTasks.value.map((task, i) =>
              <TaskCard
                key={task ? task.task_id : `empty-task-${i}`}
                task={task}
                projectName={task ? projectObj.value[task.project_id] : ""}
                isEven={i % 2 === 0}
                dateLabel={task ? `DONE : ${formattingDateProject(new Date(task.done_date * 1000).toLocaleDateString("en-CA"))}` : ""}
              />
            )}
          </div>
        </div>
      </section>

      <section className="grid items-center gap-6 sm:gap-3 mt-10 sm:mt-7.5 lg:grid-cols-2 grid-cols-1">
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 w-full border sm:border-none border-gray-100">
          <h3 className="text-xl font-semibold text-gray-500 mb-4">
            Productivity Peaks
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Peak Hours</span>
              <span className="text-green-600 font-semibold">{productivityPeaks.value.peakHours}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium">Peak Days</span>
              <span className="text-blue-600 font-semibold">{productivityPeaks.value.peakDays}</span>
            </div>
          </div>
        </div>

        <div className="grid items-center gap-6 sm:gap-3 mt-2 sm:mt-0 grid-cols-1 sm:grid-cols-2">
          <div title="Throughput" className="md:col-span-1 flex items-center justify-center w-full">
            <VelocityChart
              data={velocityData.value.data}
              labels={velocityData.value.labels}
            />
          </div>

          {/* Goal Donut Chart */}
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center mt-4 sm:mt-0">
            <div className="mb-4">
              <DonutChart
                percentage={percetageCompletedTasks.value}
                label="Goal Met"
                color="text-emerald-500"
              />
            </div>
            <p className="text-sm text-slate-500 px-2">
              <strong className="text-slate-800">{timeRange}</strong> goals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
