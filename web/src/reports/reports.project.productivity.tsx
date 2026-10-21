import { ReadonlySignal, Signal, useComputed } from "@preact/signals";
import { ReportsTimeRange } from "../constants";
import type { TimeRangeType } from "./hooks";
import type { Task } from "./types";
import { isTimestampWithinRange } from "./utils";

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

interface VelocityChartProps {
  data: number[];
  labels: string[];
}

export const countVelocityChartData = (
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
              <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-sm py-1 px-2 absolute -mt-8 z-10">
                {val} task{val != 1 ? "s" : ""}
              </div>

              {/* Bar */}
              <div
                className="w-full max-w-6 bg-indigo-100 hover:bg-indigo-500 relative transition-all duration-500 ease-out"
                style={{ height: `${heightPercent}%` }}
              ></div>

              {/* Label */}
              <span className="mt-2 text-xs text-slate-500 font-semibold truncate">
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>
      <p class="text-sm text-slate-500 font-semibold mx-auto mt-2 text-center">
        What"s done during this period
      </p>
    </div>
  );
};

interface ProjectProductivityProps {
  tasks: Signal<Task[]>;
  timeRange: Signal<TimeRangeType>;
  rangeDate: ReadonlySignal<{ start: Date; end: Date }>;
  percetageCompletedTasks: ReadonlySignal<number>;
}

export default function ProjectProductivity({
  tasks,
  timeRange,
  rangeDate,
  percetageCompletedTasks,
}: ProjectProductivityProps) {
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
    <section className="grid items-center gap-6 sm:gap-3 mt-10 sm:mt-7.5 lg:grid-cols-2 grid-cols-1">
      <div className="bg-white shadow-sm p-5 sm:p-6 w-full border sm:border-none border-gray-100">
        <h3 className="text-xl font-semibold text-gray-500 mb-4">
          Productivity Peaks
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50">
            <span className="font-medium">Peak Hours</span>
            <span className="text-green-600 font-semibold">
              {productivityPeaks.value.peakHours}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50">
            <span className="font-medium">Peak Days</span>
            <span className="text-blue-600 font-semibold">
              {productivityPeaks.value.peakDays}
            </span>
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
          <p className="text-sm text-slate-500 px-2 font-medium">
            <strong className="text-slate-800 font-semibold">{timeRange}</strong> goals.
          </p>
        </div>
      </div>
    </section>
  );
}
