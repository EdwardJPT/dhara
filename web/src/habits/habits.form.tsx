import { Signal, useSignal } from "@preact/signals";
import { useRef, useEffect, useState } from "preact/hooks";

import "emoji-picker-element";

import type { HabitsGroupWithHabits, HabitWithDoneDates } from "./types.ts";

interface HabitFormProps {
  showHabitForm: Signal<boolean>;
  groupList: Signal<HabitsGroupWithHabits[]>;
  errorMessage: Signal<string>;
  isDemo: boolean;
}

const GroupOptions = ({ groups }: { groups: Signal<HabitsGroupWithHabits[]> }) => {
  return groups.value.map(group => (
    <option key={group.habits_group_id} value={group.habits_group_id}>
      {group.habits_group_title}
    </option>
  ));
};

export function NewHabitForm({
  showHabitForm,
  groupList,
  errorMessage,
  isDemo = false,
}: HabitFormProps) {
  const exist = "exist";
  const newGroup = "new";
  const groupHabits = useSignal("exist");

  // Icon picker
  const pickerRef = useRef<HTMLElement | null>(null);

  const [emoji, setEmoji] = useState("");
  useEffect(() => {
    const picker = pickerRef.current;
    if (!picker) return;

    const onEmojiClick = (event: Event) => {
      // emoji-picker-element emits CustomEvent
      const customEvent = event as CustomEvent<{ unicode: string }>;
      setEmoji(customEvent.detail.unicode);
    };

    picker.addEventListener("emoji-click", onEmojiClick);
    return () => picker.removeEventListener("emoji-click", onEmojiClick);
  }, []);

  function getRandomEmoji() {
    const arr = ["🔄", "😀", "🎯", "🚀", "💪",];
    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];
    return item;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formData: any = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);
      const { habit_title, habits_group_title, frequency } = data;
      const habits_group_id = Number(data.habits_group_id);
      const finalEmoji = emoji === "" ? getRandomEmoji() : emoji;

      // Handle demo mode early and exit
      if (isDemo) {
        const newHabitId = Date.now();
        const finalGroupId = groupHabits.value === newGroup ? Date.now() + 1 : habits_group_id;

        const newHabit = {
          habit_id: newHabitId,
          habits_group_id: finalGroupId,
          user_id: Date.now() + 2, // Mock User ID
          habit_title: habit_title as string,
          habit_icon: finalEmoji,
          frequency: Number(frequency),
          is_show: true,
          created_at: new Date().toISOString(),
        };

        // Read & Update Groups in localStorage
        const storedGroups = localStorage.getItem("demo_habits_groups");
        let currentGroups: HabitsGroupWithHabits[] = storedGroups ? JSON.parse(storedGroups) : [];

        if (groupHabits.value === newGroup) {
          currentGroups.push({
            habits_group_id: finalGroupId,
            habits_group_title: habits_group_title as string,
            is_show: true,
            created_at: new Date().toISOString(),
            habits: [newHabit],
          });
        } else {
          currentGroups = currentGroups.map((group) => {
            if (group.habits_group_id === habits_group_id) {
              return {
                ...group,
                habits: [...group.habits, newHabit],
              };
            }
            return group;
          });
        }
        localStorage.setItem("demo_habits_groups", JSON.stringify(currentGroups));

        // Read & Update Done Dates in localStorage
        const storedDoneDates = localStorage.getItem("demo_habits_done_dates");
        const currentDoneDates: HabitWithDoneDates[] = storedDoneDates ? JSON.parse(storedDoneDates) : [];

        currentDoneDates.push({
          habit: newHabit,
          done_dates: {}, // Brand new habit has no done dates yet
        });

        localStorage.setItem("demo_habits_done_dates", JSON.stringify(currentDoneDates));

        // Reload the page to mimic backend refresh flow
        window.location.reload();
        return;
      }

      const response = await fetch("/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habit_title,
          habits_group_id,
          habits_group_title,
          emoji: finalEmoji,
          frequency: Number(frequency),
        }),
      });
      // if cookie failed
      if (response.redirected) {
        window.location.replace(response.url);
      }
      const resp_data = await response.json();
      if (resp_data.success) window.location.reload();
      if (!resp_data.success) {
        errorMessage.value = "There's an error. Failed to create the habit.";
        showHabitForm.value = false;
      }
    } catch (error) {
      errorMessage.value = "There's an error. Failed to create the habit.";
      showHabitForm.value = false;
      console.log(error);
    }
  };

  return (
    <div class="fixed top-1/2 left-1/2 z-11 pb-5 md:pb-0 max-h-9/10 w-9/10 overflow-y-auto -translate-1/2 rounded-xl border border-background bg-white shadow-lg h-fit md:max-w-105">
      <div class="flex h-1/10 items-center justify-start rounded-t-xl bg-linear-to-r from-hover to-background p-5">
        <h2 class="text-2xl font-bold text-white">
          Create New Habit
        </h2>
      </div>
      <span
        onClick={() => showHabitForm.value = false}
        class="absolute top-5 right-5 cursor-pointer text-2xl font-extrabold text-white"
      >
        &#x2715;
      </span>

      <form
        id="newHabit"
        onSubmit={handleSubmit}
        class="p-7.5 flex flex-col gap-3"
      >
        <div class="flex">
          <input
            type="text"
            id="habit_title"
            placeholder="Habit's Name"
            name="habit_title"
            style="flex: 2; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
            required
          />
        </div>

        <div class="flex flex-col gap-3">
          <div class={`${groupHabits.value == newGroup ? "" : "opacity-60"} flex flex-col`}>
            <div
              className="flex flex-row py-1 items-center cursor-pointer"
              onClick={() => groupHabits.value = newGroup}
            >
              <div class="w-4 h-4 rounded-full border-2 border-gray-400 group-has-checked:border-blue-500 flex items-center justify-center">
                <div class={`${groupHabits.value == newGroup ? "block" : "hidden"} w-2 h-2 rounded-full bg-blue-500`}>
                </div>
              </div>
              <span class="ml-2 text-gray-700">
                Create new habits group
              </span>
            </div>

            <input
              type="text"
              id="habits_group"
              placeholder="New Habit's Group Name"
              name="habits_group_title"
              class={`${groupHabits.value == newGroup ? "" : "opacity-35"}`}
              style="flex: 2; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
              required={groupHabits.value == newGroup}
              disabled={groupHabits.value != newGroup}
            />
          </div>

          <div class={`${groupHabits.value == exist ? "" : "opacity-60"} flex flex-col`}>
            <div
              className="flex flex-row py-1 items-center cursor-pointer"
              onClick={() => groupHabits.value = exist}
            >
              <div class="w-4 h-4 rounded-full border-2 border-gray-400 group-has-checked:border-blue-500 flex items-center justify-center">
                <div class={`${groupHabits.value == exist ? "block" : "hidden"} w-2 h-2 rounded-full bg-blue-500`}>
                </div>
              </div>
              <span class="ml-2 text-gray-700">
                Add to the existing habits group
              </span>
            </div>

            <select
              name="habits_group_id"
              class={`${groupHabits.value == exist ? "" : "opacity-35"} w-full cursor-pointer p-2 border border-[#ccc] hover:bg-gray-50`}
              required={groupHabits.value == exist}
              disabled={groupHabits.value != exist}
            >
              <option value="">Select Habits Group</option>
              <GroupOptions groups={groupList} />
            </select>
          </div>
        </div>

        <div class="flex flex-col">
          <p>Repeat the habit every __ days?</p>
          <input
            type="number"
            id="frequency"
            name="frequency"
            defaultValue="1"
            style="flex: 2; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
            required
          />
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="flex flex-row items-center">
            <p>Pick an icon for the habit:</p>
            <div className="text-2xl">{emoji}</div>
          </div>
          {/* @ts-ignore */}
          <emoji-picker ref={pickerRef} className="w-full h-64"></emoji-picker>
        </div>


        <button type="submit"
          style="background: #007bff; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">
          Add Habit
        </button>
      </form>
    </div>
  );
}
