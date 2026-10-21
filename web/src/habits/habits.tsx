import { render } from "preact";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals";

import { SummaryStats } from "./habits.stats.js";
import { HabitCard } from "./habits.card.js";
import { Toggle } from "./habits.toggle.js";
import { NewHabitForm } from "./habits.form.js";

import { monthNames } from "../constants.js";

import type { HabitsGroupWithHabits, HabitWithDoneDates, HabitWithGroup } from "./types.ts";
import { HabitDetails } from "./habits.details.js";

interface BackEndData {
  habitsGroupList: HabitsGroupWithHabits[];
  habitsDoneDateList: HabitWithDoneDates[];
  isDemo: boolean;
}

interface AppProps extends BackEndData { }

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

function App({ habitsGroupList, habitsDoneDateList, isDemo = false }: AppProps) {
  // Habits Group Section
  const habitsGroups = useSignal(
    loadDemoData("demo_habits_groups", habitsGroupList ?? [], isDemo)
  );
  useSignalEffect(() => {
    // Explicitly reading .value outside the condition forces Preact to track it
    const currentGroups = habitsGroups.value;
    if (isDemo) {
      localStorage.setItem("demo_habits_groups", JSON.stringify(currentGroups));
    }
  });

  // Habits Done Dates Section
  const habitsDoneDates = useSignal(
    loadDemoData("demo_habits_done_dates", habitsDoneDateList ?? [], isDemo)
  );
  useSignalEffect(() => {
    // Explicitly reading .value outside the condition forces Preact to track it
    const currentDoneDates = habitsDoneDates.value;
    if (isDemo) {
      localStorage.setItem("demo_habits_done_dates", JSON.stringify(currentDoneDates));
    }
  });

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // To control which groups of habit to show or not
  const handleToggleHide = (habitGroupId: number, checked: boolean) => {
    habitsGroups.value = habitsGroups.value.map((group) =>
      group.habits_group_id === habitGroupId ? { ...group, is_show: checked } : group
    );
  };

  // To control the height of habits group div
  const expandGroupsDiv = useSignal(false);
  // Hidden habits group
  const hiddenHabitsGroup = useComputed(() => {
    const hiddenGroupIdArr: number[] = [];
    for (const group of habitsGroups.value) {
      if (!group.is_show) hiddenGroupIdArr.push(group.habits_group_id);
    }
    return hiddenGroupIdArr;
  });

  const calendarRange = useSignal("");
  const dateRange = useComputed(() => {
    const rangeMonth = calendarRange.value == "" ? 1 : Number(calendarRange.value);

    const firstDate = new Date(currentYear, currentMonth - (rangeMonth - 1), 1);
    const lastDate = new Date(currentYear, currentMonth + 1, 0);
    const len = ((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    for (let i = len; i > 0; i--)
      days.push(new Date(currentYear, currentMonth, daysInMonth - i + 1));
    return days;
  });

  // To control the subtitle below Habits Tracker
  const period = useComputed(() => {
    const rangeMonth = calendarRange.value == "" ? 1 : Number(calendarRange.value);
    const period = monthNames[currentMonth] + " " + currentYear;
    if (rangeMonth === 1) return period;

    const firstDate = new Date(currentYear, currentMonth - (rangeMonth - 1), 1);
    const firstMonth = monthNames[firstDate.getMonth()];
    const firstYear = firstDate.getFullYear();
    const isSameYear = firstYear === currentYear;

    return firstMonth + " " + `${isSameYear ? "" : firstYear}` + " - " + period;
  });

  // To add new habit
  const showHabitForm = useSignal(false);

  // Stored the Id of a habit that we show the details
  const showHabitDetails = useSignal(0);

  // The habit that we show the details
  const selectedHabit = useSignal<HabitWithGroup | null>(null);

  // Automatically search and format the data whenever the showHabitDetails changes
  useSignalEffect(() => {
    const targetId = showHabitDetails.value;

    if (targetId === 0) {
      selectedHabit.value = null;
      return;
    }

    let foundHabit: HabitWithGroup | null = null;

    // Loop through groups to find the matching habit
    for (const group of habitsGroups.value) {
      const match = group.habits.find((h) => h.habit_id === targetId);

      if (match) {
        // Map the backend data to your specific interface
        foundHabit = {
          habit_id: match.habit_id,
          habit_title: match.habit_title,
          habit_icon: match.habit_icon,
          habit_frequency: match.frequency,
          habit_is_show: match.is_show,
          habits_group_title: group.habits_group_title,
        };
        break;
      }
    }

    selectedHabit.value = foundHabit;
  });

  const errorMessage = useSignal("");

  return (
    <div className="min-h-screen font-sans pb-12 mt-10 md:mt-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-2">

        <div className="pb-4 md:pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl text-background font-bold">
              Habits Tracker
            </h1>
            <p className="text-background font-bold">
              {period}
            </p>
          </div>
          <button
            onClick={() => showHabitForm.value = true}
            className="flex min-w-35 cursor-pointer items-center justify-center rounded-xl bg-background p-1.25 text-center text-base font-bold text-white hover:bg-hover md:py-1 md:text-lg"
          >
            + New Habit
          </button>
        </div>

        <SummaryStats
          habitsDoneDates={habitsDoneDates}
          dateRange={dateRange}
          hiddenHabitsGroup={hiddenHabitsGroup}
          calendarRange={calendarRange}
        />

        <div className="flex flex-col md:flex-row items-center justify-center md:gap-3">
          <div class=
            {`${expandGroupsDiv.value ? 'max-h-24' : 'max-h-14'}
            flex rounded-md overflow-y-auto flex-col p-4 mt-4 mb-4 bg-white w-full transition-all duration-300 ease-in-out sm:flex-row sm:flex-wrap gap-4 sm:gap-6`}
          >
            {habitsGroups.value.map(habitsGroup => (
              <Toggle
                key={habitsGroup.habits_group_id}
                habitsGroupId={habitsGroup.habits_group_id}
                habitsGroupTitle={habitsGroup.habits_group_title}
                isShow={habitsGroup.is_show}
                handleToggleHide={handleToggleHide}
                habitsCount={habitsGroup.habits.length}
                errorMessage={errorMessage}
                isDemo={isDemo}
              />
            ))}

            {habitsGroups.value.length == 0 &&
              <p className="text-background font-semibold text-lg">
                You haven’t created any habits yet
              </p>
            }
          </div>

          <select
            onChange={e => calendarRange.value = e.currentTarget.value}
            value={calendarRange.value}
            name="duration"
            className="hidden md:block bg-white text-background font-semibold text-nowrap w-full md:w-fit h-14 px-5 mb-6 sm:mb-0"
          >
            <option value="" disabled selected>Duration</option>
            <option value="1">1 month</option>
            <option value="3">3 months</option>
            <option value="6">6 months</option>
          </select>
        </div>

        <div className={`${habitsGroups.value.length > 4 ? 'block' : 'hidden'}`}>
          {expandGroupsDiv.value ?
            <div
              className="cursor-pointer mx-auto flex justify-center mb-4"
              onClick={() => expandGroupsDiv.value = false}
            >
              Show less
            </div>
            :
            <div
              className="cursor-pointer mx-auto flex justify-center mb-4"
              onClick={() => expandGroupsDiv.value = true}
            >
              Show more
            </div>
          }
        </div>

        {(errorMessage.value.length > 0) &&
          <div className="text-background font-bold mx-auto py-2 px-5 border border-background w-fit flex justify-center mb-4">
            {errorMessage}
          </div>
        }

        <div className={`grid grid-cols-1 place-items-center gap-5
          ${calendarRange.value === "" ? 'md:grid-cols-4' : ''}
          ${calendarRange.value === "1" ? 'md:grid-cols-4' : ''}
          ${calendarRange.value === "3" ? 'md:grid-cols-2' : ''}
          ${calendarRange.value === "6" ? 'md:grid-cols-1' : ''}`}
        >
          {habitsDoneDates.value.map(habit => {
            if (!hiddenHabitsGroup.value.includes(habit.habit.habits_group_id)) {
              return (
                <HabitCard
                  key={habit.habit.habit_id}
                  habitObj={habit}
                  dateRange={dateRange}
                  errorMessage={errorMessage}
                  habitsDoneDates={habitsDoneDates}
                  showHabitDetails={showHabitDetails}
                  isDemo={isDemo}
                />
              );
            }
          })}
        </div>
      </div>

      {showHabitForm.value &&
        <NewHabitForm
          showHabitForm={showHabitForm}
          groupList={habitsGroups}
          errorMessage={errorMessage}
          isDemo={isDemo}
        />
      }

      {(showHabitDetails.value > 0) &&
        <HabitDetails
          habitSignal={selectedHabit}
          errorMessage={errorMessage}
          showHabitDetails={showHabitDetails}
          isDemo={isDemo}
        />
      }
    </div>
  );
};

interface DataWindow extends Window, BackEndData { }
const dataWindow = window as unknown as DataWindow;

render(
  <App
    habitsGroupList={dataWindow.habitsGroupList}
    habitsDoneDateList={dataWindow.habitsDoneDateList}
    isDemo={dataWindow.isDemo || false}
  />,
  document.getElementById("habits")!
);
