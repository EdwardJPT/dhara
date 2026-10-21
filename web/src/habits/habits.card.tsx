import {
  Signal,
  ReadonlySignal,
  useSignal,
  useComputed,
} from "@preact/signals";

import { HabitWithDoneDates } from "./types";

import { daysName, daysInitial } from "../constants";
import { formattingDateObj, todayUserTimeZone } from "../utils";

interface HabitCardProps {
  habitObj: HabitWithDoneDates;
  dateRange: ReadonlySignal<Date[]>;
  errorMessage: Signal<string>;
  habitsDoneDates: Signal<HabitWithDoneDates[]>;
  showHabitDetails: Signal<number>
  isDemo: boolean;
}

// Function to check if date1 and date2 are consecutive or not
// date2 should be always later than date1, the form of the date is YYYY-MM-DD
function countDayApart(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  // Check for invalid dates
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return 0;
  }
  // Calculate the difference in milliseconds
  const diffMs = Math.abs(d1.getTime() - d2.getTime());
  // One day in milliseconds
  const oneDayMs = 24 * 60 * 60 * 1000;
  return Number(diffMs === oneDayMs);
}

export const HabitCard = ({
  habitObj,
  dateRange,
  errorMessage,
  habitsDoneDates,
  showHabitDetails,
  isDemo = false,
}: HabitCardProps) => {
  const habit = useSignal(habitObj);
  const today = todayUserTimeZone();

  const freq = habit.value.habit.frequency;

  const longestStreak = useComputed(() => {
    // Get all the date string in the form of YYYY-MM-DD
    const doneDates = Object.keys(habit.value.done_dates);
    // Filter only the date string that's inside the range
    const dateRangeLength = dateRange.value.length;
    const doneDatesFiltered = doneDates.filter((dateStr: string) => {
      const doneDate = new Date(dateStr);
      if (
        doneDate >= dateRange.value[0] &&
        doneDate <= dateRange.value[dateRangeLength - 1]
      ) {
        return dateStr;
      }
    });
    // Count the longest streak
    const firstStreak = doneDatesFiltered.length > 0 ? 1 : 0; // init the first value since we increase this value if only there's consecutive
    const len = doneDatesFiltered.length;
    let tempMax = firstStreak;
    let max = firstStreak;
    for (let i = 0; i < len - 1; i++) {
      const nDaysApart = countDayApart(
        doneDatesFiltered[i],
        doneDatesFiltered[i + 1]
      );
      tempMax = nDaysApart ? tempMax + nDaysApart : firstStreak;
      if (tempMax > max) max = tempMax;
    }
    return Math.ceil(max / freq);
  });

  const habitCheckIn = async () => {
    try {
      // If already check in for today
      if (habit.value.done_dates[today]) {
        let title = habit.value.habit.habit_title;
        errorMessage.value = `You already did ${title}!`;
        setTimeout(() => (errorMessage.value = ""), 5000);
        return;
      }

      const habit_id = habit.value.habit.habit_id;
      const habits_group_id = habit.value.habit.habits_group_id;

      // Handle demo mode early and exit
      if (isDemo) {
        // Find the last check-in date
        const doneDateKeys = Object.keys(habit.value.done_dates).sort();
        const lastCheckIn = doneDateKeys.length > 0 ? doneDateKeys[doneDateKeys.length - 1] : "";

        // Calculate daysAgo to mimic backend daysBetween logic
        let daysAgo = 0;
        if (lastCheckIn !== "") {
          const dNow = new Date(today);
          const dLast = new Date(lastCheckIn);
          const diffTime = dLast.getTime() - dNow.getTime();
          daysAgo = Math.round(diffTime / (1000 * 3600 * 24)); // Will be negative if past
        }

        // Adjust daysAgo based on frequency or lack of previous check-ins
        if (-daysAgo > freq || lastCheckIn === "") {
          daysAgo = -freq;
        }

        // Generate multiple dates based on frequency limit
        const mockDoneDates: Record<string, any> = {};
        for (let i = 0; i < freq; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() + daysAgo + i + 1);

          const dateStr = formattingDateObj(d);

          mockDoneDates[dateStr] = {
            habit_date_id: Date.now() + i, // Generate unique mock IDs for each checked day
            done_date: dateStr,
            check_in_created_at: new Date().toISOString(),
          };
        }

        // Update the value for the UI of the calendar in this component
        habit.value = {
          ...habit.value!,
          done_dates: {
            ...habit.value!.done_dates,
            ...mockDoneDates,
          },
        };

        // Update the value for stats and another derived data at the parent
        habitsDoneDates.value = habitsDoneDates.value.map((entry) => {
          if (entry.habit.habit_id === habit_id) {
            return {
              ...entry,
              done_dates: {
                ...entry.done_dates,
                ...mockDoneDates,
              },
            };
          }
          return entry;
        });
        return;
      }

      const response = await fetch(`/habits/check-in/${habits_group_id}/${habit_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habit_id, habits_group_id }),
      });
      // if cookie failed
      if (response.redirected) window.location.replace(response.url);
      const data = await response.json();
      // if success, update the view of calendar
      if (data.success) {
        // Update the value for the UI of the calendar in this component
        habit.value = {
          ...habit.value!,
          done_dates: {
            ...habit.value!.done_dates,
            ...data.done_dates,
          },
        };
        // Update the value for stats and another derived data at the parent
        habitsDoneDates.value = habitsDoneDates.value.map((entry) => {
          if (entry.habit.habit_id === habit_id) {
            return {
              ...entry,
              done_dates: {
                ...entry.done_dates,
                ...data.done_dates,
              },
            };
          }
          return entry;
        });
      }
      if (!data.success) errorMessage.value = "There's error in the backend.";
    } catch (error) {
      console.log(error);
      errorMessage.value = "There's error in the backend.";
    }
  };

  return (
    <div className="group bg-white rounded-sm shadow-sm border border-slate-200 py-5 px-2.5 flex flex-col h-full w-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 group">
          <div
            className={`h-10 w-10 rounded-sm bg-cyan-100 flex items-center justify-center text-cyan-600 cursor-pointer`}
            title={`${habit.value.done_dates[today]
              ? "You already checked in!"
              : "Click for today's check in!"
              }`}
            onClick={() => habitCheckIn()}
          >
            <i className="text-xl not-italic">{habit.value.habit.habit_icon}</i>
          </div>
          <div>
            <h3
              className="text-lg font-bold text-slate-800 leading-tight cursor-pointer"
              onClick={() => showHabitDetails.value = habit.value.habit.habit_id}
              title="View Habit's details"
            >
              <span className="hover:underline">
                {habit.value.habit.habit_title}
              </span>
              <span className="hidden group-hover:flex text-base text-slate-500 font-medium">
                <span className="min-w-23">Frequency</span>: per {freq} day{freq > 1 ? "s" : ""}
              </span>
            </h3>
            <p className="text-base text-slate-500 font-medium flex flex-row">
              <span className="min-w-23">Best streak</span>: {longestStreak} time
              {longestStreak.value > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {/* Days Label */}
        <div className="flex flex-col justify-between text-base font-bold text-slate-600 h-fit select-none">
          {daysInitial.map((day, i) => (
            <div
              key={i}
              className="h-8 w-8 flex items-center justify-center border border-slate-300"
              title={daysName[i]}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Vertical Calendar Grid */}
        <div className="grid grid-rows-7 grid-flow-col gap-x-px h-56 flex-1 w-fit pb-1">
          {dateRange.value.map((date, index) => {
            const dateKey = formattingDateObj(date);
            // would return undefined if the task wasn't logged on this date
            const doneDate = habit.value.done_dates[dateKey];
            const isDone = !(doneDate === undefined);
            const isToday = dateKey === today;
            let tooltipStatus = isDone ? "Completed" : "Missed";

            // habit.created_at is stored in UTC, so we need to convert it to
            // local time first
            const localCreatedAt = habit.value.habit.created_at.replace(" ", "T") + "Z" // converting to local time from UTC
            const localDateCreatedAt = new Date(localCreatedAt);
            const createdAt = formattingDateObj(localDateCreatedAt).slice(0, 10);
            const createdDate = new Date(createdAt);
            createdDate.setHours(0);
            if (isDone) {
              // -1 because we don't count today
              createdDate.setDate(createdDate.getDate() - (freq - 1));
            }
            const isStarted = date >= createdDate || isDone;

            const todayDate = new Date(today);
            todayDate.setHours(0);
            const isTomorrow = date > todayDate;

            let bgClass;
            let textClass;
            let borderClass = "border-transparent";

            if (!isStarted) {
              bgClass =
                date.getMonth() % 2 == 1 ? "bg-slate-200" : "bg-gray-100";
              tooltipStatus = "Not Started";
            }
            if (isDone && isStarted) {
              bgClass =
                date.getMonth() % 2 == 0 ? "bg-cyan-200" : "bg-blue-200";
              textClass = "text-slate-700 font-semibold";
            }
            if (!isDone && isStarted) {
              bgClass = date.getMonth() % 2 == 0 ? "bg-rose-200" : "bg-red-100";
              textClass = "text-rose-700";
            }
            if (isToday) {
              bgClass = isDone ? "bg-cyan-200" : "bg-slate-100";
              borderClass = "border-background";
              textClass = "text-slate-800 font-bold";
            }
            if (isTomorrow) {
              bgClass =
                date.getMonth() % 2 == 1 ? "bg-slate-200" : "bg-gray-100";
              textClass = "";
              tooltipStatus = "Soon";
            }

            return (
              <button
                key={dateKey}
                // onClick={() => toggleStatus(habit.id, dateKey)}
                // Offset the first date to match the correct day of the week
                style={{ gridRowStart: index === 0 ? date.getDay() + 1 : 'auto' }}
                className={`
                  h-8 w-8 flex items-center justify-center text-base transition-all duration-200 border
                  ${bgClass} ${textClass} ${borderClass}
                  hover:scale-110 active:scale-95
                `}
                title={
                  date.toDateString() +
                  (isToday ? " - Today" : "") +
                  " - " +
                  tooltipStatus
                }
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="justify-center w-full flex overflow-hidden max-h-0 opacity-0 pt-0 border-transparent group-hover:max-h-20 group-hover:opacity-100 group-hover:pt-3 group-hover:border-t group-hover:border-slate-100 transition-all duration-300 ease-in-out">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-hover hover:bg-background rounded-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            onClick={() => habitCheckIn()}
            disabled={Boolean(habit.value.done_dates[today])}
            title={habit.value.done_dates[today] ? "You already checked in!" : "Check in for today"}
          >
            <img src="/static/images/checkmark.svg" alt="Check In" className="h-4 w-4" />
            <span>{habit.value.done_dates[today] ? "Done" : "Check In"}</span>
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-hover hover:bg-background rounded-sm transition-colors cursor-pointer"
            onClick={() => showHabitDetails.value = habit.value.habit.habit_id}
            title="View Details"
          >
            <img src="/static/images/list.svg" alt="Details" className="h-4 w-4 opacity-70" />
            <span>Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
