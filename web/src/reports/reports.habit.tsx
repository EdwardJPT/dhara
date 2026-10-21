import { Signal, useComputed, useSignal } from "@preact/signals";

import TimeToggle from "./reports.timeToggle";
import { formattingDateTask } from "../utils";
import { ReportsTimeRange } from "../constants";
import { useDateRange, TimeRangeType } from "./hooks";

import { AllPeaksMap, GroupWithHabitsStats, HabitBestWorstStats, HabitDoneToday, HabitPerformance, MonthlyConsistency, WeeklyConsistency } from "./types";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
}

const ProgressBar = ({ value, max = 100 }: ProgressBarProps) => (
  <div className="group w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mt-2 sm:mt-3">
    <div
      className="bg-indigo-300 h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-indigo-400 relative"
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);

interface HeatmapDataItem {
  rate: number;
  day?: string;
  month?: string;
}

interface HeatmapGridProps {
  data: HeatmapDataItem[];
  maxValue?: number;
}

const HeatmapGrid = ({ data, maxValue = 100 }: HeatmapGridProps) => {
  // Dynamically switch the grid layout based on how many items are passed in.
  // Defaults to 7 if the data length is something else.
  const gridColsClass = data.length === 6 ? "grid-cols-6" : "grid-cols-7";

  return (
    <div className={`grid ${gridColsClass} gap-1 sm:gap-2 mt-4`}>
      {data.map((item, index) => (
        <div key={index} className="text-center">
          <div
            className="bg-blue-500 rounded-md sm:rounded-lg h-10 sm:h-16 flex items-center justify-center text-white font-bold text-xs sm:text-base"
            style={{ opacity: 0.3 + (item.rate / maxValue) * 0.7 }}
          >
            {item.rate}%
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">{item.day || item.month}</p>
        </div>
      ))}
    </div>
  );
};

interface HabitStreakProps {
  title: string;
  icon: string;
  currentStreak: number;
  frequency: number;
  totalCompletion: number;
  habitCreatedDate: string;
}

function HabitStreak({
  title,
  icon,
  currentStreak,
  frequency,
}: HabitStreakProps) {
  return (
    <div class="flex items-center bg-slate-100 justify-between rounded-lg p-3 sm:p-4 border border-gray-100">
      <div class="flex items-center">
        <span class="text-lg sm:text-xl mr-2 sm:mr-3">{icon}</span>
        <div>
          <h3 class="font-medium text-gray-900 text-sm sm:text-base">{title}</h3>
          <p class="text-xs sm:text-sm text-gray-500">
            Best streak: {currentStreak / frequency} time
            {currentStreak / frequency > 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate adherence safely
const calculateAdherence = (count: number, start: Date, end: Date) => {
  // Catch the "All" time range edge case based on your max/min dates
  if (start.getTime() === -8640000000000000 || end.getTime() === 8640000000000000) {
    return null;
  }

  const today = new Date()
  today.setHours(23, 59, 59, 999);

  // if end is later than today, than simply use today as the last day. because
  // it doesn't make sense to calculate the adherence of the days that not happened
  // yet
  const endDate = today.getTime() < end.getTime() ? today : end;

  const msInDay = 1000 * 60 * 60 * 24;
  // Math.ceil converts the ~23h 59m difference into whole days nicely
  const totalDays = Math.ceil((endDate.getTime() - start.getTime()) / msInDay);

  if (totalDays <= 0) return 0;

  // calculate > 100% without breaking.
  // sometimes when a habit frequency is more than 1, it's possible the done_date
  // that being checked in is also including tomorrow or even more, that's why
  // the percentage can be more than 100 when we just count the total days
  // up to today
  return Math.min(Math.round((count / totalDays) * 100), 100);
};

// Map ReportsTimeRange values directly to the backend JSON keys
const timeRangeToKey = (range: TimeRangeType) => {
  switch (range) {
    case ReportsTimeRange.ThisWeek: return "this_week";
    case ReportsTimeRange.ThisMonth: return "this_month";
    case ReportsTimeRange.ThreeMonths: return "current_quarter";
    case ReportsTimeRange.SixMonths: return "current_semester";
    case ReportsTimeRange.SevenDays: return "last_7_days";
    case ReportsTimeRange.ThirtyDays: return "last_30_days";
    case ReportsTimeRange.NinetyDays: return "last_90_days";
    case ReportsTimeRange.HundredEightyDays: return "last_180_days";
    case ReportsTimeRange.ThisYear: return "this_year";
    case ReportsTimeRange.ALL: return "all_time";
    default: return "all_time";
  }
};

interface HabitsReportsProps {
  habitsDoneToday: HabitDoneToday[];
  habitsBestWorstStats: HabitBestWorstStats;
  habitsGroupStats: GroupWithHabitsStats[];
  habitsProductivityPeaks: AllPeaksMap;
  habitsMonthlyConsistency: MonthlyConsistency[];
  habitsWeeklyConsistency: WeeklyConsistency;
}

interface HabitPerformanceListProps {
  habits: HabitPerformance[];
  type: "best" | "worst";
  startDate: Date;
  endDate: Date;
}

const HabitPerformanceList = ({ habits, type, startDate, endDate }: HabitPerformanceListProps) => {
  const isBest = type === "best";
  const colorClass = isBest ? "text-green-600" : "text-red-600";
  const colorClassMuted = isBest ? "text-green-600/70" : "text-red-600/70";
  const alignClass = isBest ? "" : "flex flex-col items-end";
  const justifyClass = isBest ? "" : "justify-end";

  if (habits.length === 0) {
    return <p className="text-sm text-gray-400 italic">No data yet</p>;
  }

  return (
    <>
      {habits.map((habit) => {
        const adherence = calculateAdherence(habit.count, startDate, endDate);

        return (
          <div key={habit.habit_id} className={`mb-3 last:mb-0 ${alignClass}`}>
            <p className={`font-semibold ${colorClass} flex items-center gap-1 sm:gap-1.5 text-xs sm:text-base break-all sm:break-normal`}>
              {isBest ? (
                <><span>{habit.habit_icon}</span> {habit.habit_title}</>
              ) : (
                <>{habit.habit_title} <span>{habit.habit_icon}</span></>
              )}
            </p>
            <div className={`flex items-baseline gap-1 sm:gap-1.5 ${justifyClass} flex-wrap`}>
              {adherence !== null ? (
                <>
                  <p className={`text-lg sm:text-2xl font-bold ${colorClass}`}>{adherence}%</p>
                  <p className={`text-xs sm:text-sm font-normal ${colorClassMuted}`}>({habit.count}x)</p>
                </>
              ) : (
                <p className={`text-lg sm:text-2xl font-bold ${colorClass}`}>
                  {habit.count} <span className={`text-xs sm:text-sm font-normal ${colorClassMuted}`}>times</span>
                </p>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export function HabitsReports({
  habitsDoneToday,
  habitsBestWorstStats,
  habitsGroupStats,
  habitsProductivityPeaks,
  habitsMonthlyConsistency,
  habitsWeeklyConsistency,
}: HabitsReportsProps) {
  const timeRange: Signal<TimeRangeType> = useSignal(ReportsTimeRange.ThisWeek);
  const setTimeRage = (range: TimeRangeType) => (timeRange.value = range);

  const rangeDate = useDateRange(timeRange);

  const currentBestWorstStats = habitsBestWorstStats[timeRange.value] || {
    best_habits: [],
    worst_habits: [],
  };

  const groupPerformance = useComputed(() => {
    const dataKey = timeRangeToKey(timeRange.value);

    let totalDays = 1;
    if (timeRange.value !== ReportsTimeRange.ALL) {
      const today = new Date()
      today.setHours(23, 59, 59, 999);

      // if end is later than today, than simply use today as the last day. because
      // it doesn't make sense to calculate the adherence of the days that not happened
      // yet
      const endDate = today.getTime() < rangeDate.value.end.getTime()
        ? today : rangeDate.value.end;

      const msInDay = 1000 * 60 * 60 * 24;

      totalDays = Math.ceil((endDate.getTime() - rangeDate.value.start.getTime()) / msInDay);
    }

    // Map over each group
    return habitsGroupStats.map((group) => {
      // Sum up the completions for ALL habits in this specific group
      const totalHabitCount = group.habits.reduce((sum, habit) => {
        return sum + (Number(habit[dataKey as keyof typeof habit]) || 0);
      }, 0);

      // Get the actual number of habits in this group (fallback to 1 if empty to prevent division by zero)
      const numberOfHabits = group.habits.length || 1;

      let consistency = 0;

      if (timeRange.value === ReportsTimeRange.ALL) {
        // Just show the raw total count
        consistency = totalHabitCount;
      } else {
        // Max possible completions is now correctly calculated based on the data!
        const maxPossibleCompletions = totalDays * numberOfHabits;

        // TODO: totalDays is not considering when the habit is created
        if (group.habits_group_title == "Report Bug") {
          console.log(group)
          console.log({ totalDays })
          console.log({ numberOfHabits })
          console.log({ totalHabitCount })
          console.log({ maxPossibleCompletions })
        }

        // calculate > 100% without breaking.
        // sometimes when a habit frequency is more than 1, it's possible the done_date
        // that being checked in is also including tomorrow or even more, that's why
        // the percentage can be more than 100 when we just count the total days
        // up to today
        consistency = Math.round((totalHabitCount / maxPossibleCompletions) * 100);
        consistency = Math.min(consistency, 100);
      }

      return {
        name: group.habits_group_title,
        consistency: consistency
      };
    });
  });

  console.log(groupPerformance.value)

  const activePeaks = habitsProductivityPeaks?.[timeRange.value] || {
    peak_hours: "Loading...",
    peak_days: "Loading..."
  };

  const monthlyConsistencyData = habitsMonthlyConsistency.map((item) => {
    // Convert "2026-07" to "Jul" (Appending "-01" prevents timezone parsing bugs)
    const date = new Date(`${item.month}-01`);
    const monthLabel = date.toLocaleString('default', { month: 'short' });

    return {
      month: monthLabel,
      // Map backend key to frontend key, and round it so the UI shows "36%" instead of "35.51%"
      rate: Math.round(item.consistency_percentage)
    };
  });

  // The backend sorts newest-to-oldest (July -> Feb). 
  // Heatmaps usually read left-to-right chronologically, so we reverse it.
  const chronologicalData = monthlyConsistencyData.reverse();

  const habitsWeeklyData = useComputed(() => {
    const rawData = habitsWeeklyConsistency[timeRange.value] || [];
    return rawData.map((item: any) => ({
      rate: Math.round(item.consistency_rate || 0),
      day: item.day_of_week ? item.day_of_week.slice(0, 3) : undefined,
    }));
  });

  return (
    <div className="bg-white py-4 sm:py-6 px-4 sm:px-8 w-full max-w-7xl mx-auto text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4 sm:gap-6">
        <div className="flex flex-col">
          <h1 className="text-[25px] text-background font-semibold">
            Habit Progress
          </h1>
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-hover flex-wrap">
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

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-5">
        {/* Best/Worst Habits */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex flex-col justify-center min-h-40">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-500 mb-4">
            Best & Worst Habits
          </h3>

          <div className="flex justify-between items-start gap-2 sm:gap-4">
            {/* Best Habits Column */}
            <div className="flex-1 overflow-hidden">
              <p className="text-sm sm:text-base text-gray-600 font-medium mb-2">Best</p>
              <div className="max-h-34 overflow-y-auto pr-1 sm:pr-2">
                <HabitPerformanceList
                  habits={currentBestWorstStats.best_habits}
                  type="best"
                  startDate={rangeDate.value.start}
                  endDate={rangeDate.value.end}
                />
              </div>
            </div>

            {/* Worst Habits Column */}
            <div className="flex-1 text-right overflow-hidden">
              <p className="text-sm sm:text-base text-gray-600 font-medium mb-2">Worst</p>
              <div className="max-h-34 overflow-y-auto pl-1 sm:pl-2">
                <HabitPerformanceList
                  habits={currentBestWorstStats.worst_habits}
                  type="worst"
                  startDate={rangeDate.value.start}
                  endDate={rangeDate.value.end}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Group Performance */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-500 mb-4">
            Group Performance
          </h3>
          <div className="space-y-3 max-h-40 overflow-y-auto pr-2
                  [&::-webkit-scrollbar]:w-1.5
                  [&::-webkit-scrollbar-track]:bg-slate-50
                  [&::-webkit-scrollbar-thumb]:bg-slate-300
                  [&::-webkit-scrollbar-thumb]:rounded-full">
            {groupPerformance.value.map((group, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs sm:text-sm mb-1.5 gap-2">
                  <span className="font-medium truncate">{group.name}</span>

                  <span className="text-blue-600 font-bold shrink-0">
                    {timeRange.value === ReportsTimeRange.ALL
                      ? `${group.consistency} Total`
                      : `${group.consistency}%`}
                  </span>
                </div>

                <ProgressBar value={group.consistency} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-5">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-500 mb-4">Weekly Heatmap</h3>
          <HeatmapGrid data={habitsWeeklyData.value} />
        </div>

        {/* Monthly Consistency */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-500 mb-4">Monthly Consistency</h3>
          <HeatmapGrid data={chronologicalData} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 max-h-none sm:max-h-55">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-500 mb-4">Productivity Peaks</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg text-sm sm:text-base">
              <span className="font-medium">Peak Hours</span>
              <span className="text-blue-600 font-semibold">{activePeaks.peak_hours}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg text-sm sm:text-base">
              <span className="font-medium">Peak Days</span>
              <span className="text-green-600 font-semibold">{activePeaks.peak_days}</span>
            </div>
          </div>
        </div>

        <div className="max-h-none sm:max-h-55 flex flex-col">
          <div class="flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center mb-4 gap-1 sm:gap-0">
            <h3 class="text-lg sm:text-xl font-semibold text-gray-500">Habit Tracker</h3>
            <span class="text-xs sm:text-sm text-gray-500">{habitsDoneToday.length} habits done today</span>
          </div>
          <div class="space-y-3 sm:space-y-4 flex-1 overflow-y-auto pr-1">
            {habitsDoneToday.map((habit) => (
              <HabitStreak
                key={habit.habit_id}
                title={habit.habit_title}
                icon={habit.habit_icon}
                currentStreak={habit.current_streak}
                frequency={habit.frequency}
                totalCompletion={habit.total_completions}
                habitCreatedDate={habit.habit_created_date}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
