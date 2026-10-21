import { Signal, ReadonlySignal, useComputed } from "@preact/signals";

import { formattingDateObj } from "../utils";

import { HabitWithDoneDates } from "./types";

interface SummaryStatsProps {
  habitsDoneDates: Signal<HabitWithDoneDates[]>;
  dateRange: ReadonlySignal<Date[]>;
  hiddenHabitsGroup: ReadonlySignal<number[]>;
  calendarRange: Signal<string>;
}

export const SummaryStats = ({
  habitsDoneDates,
  dateRange,
  hiddenHabitsGroup,
  calendarRange,
}: SummaryStatsProps) => {
  // Initialize the limit of the stats
  const today = new Date();
  today.setHours(0, 0, 0, 0); // set it to the start of the day
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();
  const tomorrow = new Date(currentYear, currentMonth, currentDate + 1);

  // Count the stats
  const stats = useComputed(() => {
    const habitsLength = habitsDoneDates.value.length;
    const hiddenGroupIds = hiddenHabitsGroup.value;

    // Filter to only count the stats of shown habits
    const shownHabits = [];
    for (let i = 0; i < habitsLength; i++) {
      const habit = habitsDoneDates.value[i].habit;
      if (!hiddenGroupIds.includes(habit.habits_group_id)) {
        shownHabits.push(habitsDoneDates.value[i]);
      }
    }

    // Collect the createdAt dates for comparison if the habit already started
    // or not
    const shownHabitsLength = shownHabits.length;
    // Prepare the created date of the habits
    const createdAtArr = [];
    for (let i = 0; i < shownHabitsLength; i++) {
      const habit = shownHabits[i].habit;
      // Sometimes when a habit frequency is more than 1, it's possible the
      // done_date being checked in earlier than the createAt of a habit
      let createdAt: Date;

      // SQLite store the date in UTC
      const habitCreatedAt = habit.created_at.slice(0, 10);
      // done_dates is an object with the shape { "YYYY-MM-DD": habit },
      // so this operation is done with the assumption that the earliest
      // done_date inside done_dates is positioned at the start of the object.
      // That is the case when we insert to it when checking in a habit
      const firstCheckIn = Object.keys(shownHabits[i].done_dates)[0];

      // If habitCreatedAt ealier than the firstCheckIn
      if (habitCreatedAt < firstCheckIn) {
        createdAt = new Date(`${habitCreatedAt}T00:00:00`);
      } else {
        createdAt = new Date(`${firstCheckIn}T00:00:00`);
      }

      createdAtArr.push(createdAt);
    }

    let totalOpportunities = 0;
    let totalCompleted = 0;
    let perfectDays = 0;

    const dates = dateRange.value;
    for (const date of dates) {
      if (date >= tomorrow) break;

      // if dailyDoneCounter == todayMaxHabit, then it's a perfect day
      let todayDoneCounter = 0;
      let todayMaxHabit = 0;
      const dateKey = formattingDateObj(date); // in the form of YYYY-MM-DD

      for (let i = 0; i < shownHabitsLength; i++) {
        const doneDates = shownHabits[i].done_dates;
        const isAfterCreated = date >= createdAtArr[i];
        const isBeforeTomorrow = date < tomorrow;

        if (isAfterCreated && isBeforeTomorrow) {
          // for percentage stats
          totalOpportunities += 1;
          totalCompleted += doneDates[dateKey] ? 1 : 0;

          // for perfect days
          todayMaxHabit += 1;
          todayDoneCounter += doneDates[dateKey] ? 1 : 0;
        }
      }

      if (todayDoneCounter == todayMaxHabit && todayMaxHabit != 0) {
        perfectDays += 1;
      }
    }

    // || 0 for safety in case of NaN
    const percentage =
      Math.round((totalCompleted / totalOpportunities) * 100) || 0;

    return { percentage, perfectDays };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-background p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <p className="text-white text-md font-semibold mb-1">
            {calendarRange.value == "" || calendarRange.value == "1"
              ? ""
              : Number(calendarRange.value) + " "}
            Monthly Completion
          </p>
          <h2 className="text-4xl font-bold">{stats.value.percentage}%</h2>
        </div>
        <div className="h-16 w-16 rounded-full border-4 border-white flex items-center justify-center">
          <span className="text-3xl">📈</span>
        </div>
      </div>

      <div className="bg-white p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">
            Perfect Days
          </p>
          <h2 className="text-4xl font-bold text-slate-800">
            {stats.value.perfectDays}
          </h2>
        </div>
        <div className="h-16 w-16 rounded-full bg-hover flex items-center justify-center text-yellow-600">
          <span className="text-3xl">⭐</span>
        </div>
      </div>
    </div>
  );
};
