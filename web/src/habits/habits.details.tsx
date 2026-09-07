import { Signal, useSignal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";

import {
  Habit,
  HabitWithDoneDates,
  HabitsGroupWithHabits,
  HabitWithGroup,
} from "./types";

interface HabitDetailsProps {
  habitSignal: Signal<HabitWithGroup | null>;
  errorMessage: Signal<string>;
  showHabitDetails: Signal<number>;
  isDemo: boolean;
}

export function HabitDetails({
  habitSignal,
  errorMessage,
  showHabitDetails,
  isDemo = false,
}: HabitDetailsProps) {
  // If this component is called, the value of habitSignal won't ever be null
  // we do it to please typescript
  const habit = habitSignal.value ?? ({} as HabitWithGroup);

  const [formData, setFormData] = useState({
    habit_id: habit.habit_id || 0,
    habit_title: habit.habit_title || "",
    habit_icon: habit.habit_icon || "",
    habit_frequency: habit.habit_frequency || 1,
    habit_is_show: habit.habit_is_show ?? true,
  });

  useEffect(() => {
    if (habitSignal.value) {
      setFormData({
        habit_id: habitSignal.value.habit_id,
        habit_title: habitSignal.value.habit_title,
        habit_icon: habitSignal.value.habit_icon,
        habit_frequency: habitSignal.value.habit_frequency,
        habit_is_show: habitSignal.value.habit_is_show,
      });
    }
  }, [habitSignal.value]);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: type === "checkbox" ? (target as HTMLInputElement).checked
          : type === "number" ? parseInt(value) || 0 : value,
      };
    });
  };

  const showDeleteConfirm = useSignal(false);

  const submitDeleteHabit = async () => {
    if (isDemo) {
      // Delete from demo_habits_groups
      const storedGroupsStr = localStorage.getItem("demo_habits_groups");
      if (storedGroupsStr) {
        try {
          const storedGroups = JSON.parse(storedGroupsStr);
          const updatedGroups = storedGroups.map((group: any) => ({
            ...group,
            habits: group.habits.filter(
              (h: Habit) => h.habit_id !== formData.habit_id
            ),
          }));
          localStorage.setItem("demo_habits_groups", JSON.stringify(updatedGroups));
        } catch (err) {
          console.error("Error deleting demo habit in localStorage", err);
        }
      }

      // Delete from demo_habits_done_dates
      const storedDoneDatesStr = localStorage.getItem("demo_habits_done_dates");
      if (storedDoneDatesStr) {
        try {
          const storedDoneDates = JSON.parse(storedDoneDatesStr);
          const updatedDoneDates = storedDoneDates.filter(
            (item: HabitWithDoneDates) => item.habit.habit_id !== formData.habit_id
          );
          localStorage.setItem("demo_habits_done_dates", JSON.stringify(updatedDoneDates));
        } catch (err) {
          console.error("Error deleting demo habit done dates in localStorage", err);
        }
      }

      window.location.reload();
      return;
    }

    try {
      const response = await fetch(`/habits/${formData.habit_id}`, { method: "DELETE" });

      if (response.redirected) {
        window.location.replace(response.url);
      }

      const data = await response.json();
      if (data.success) window.location.reload();
      if (!data.success) errorMessage.value = data.message;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const submitEditHabit = async (e: Event) => {
    e.preventDefault();

    if (isDemo) {
      // Update in demo_habits_groups
      const storedGroupsStr = localStorage.getItem("demo_habits_groups");
      if (storedGroupsStr) {
        try {
          const storedGroups = JSON.parse(storedGroupsStr);
          const updatedGroups = storedGroups.map((group: HabitsGroupWithHabits) => ({
            ...group,
            habits: group.habits.map((h: Habit) =>
              h.habit_id === formData.habit_id
                ? {
                  ...h,
                  habit_title: formData.habit_title,
                  habit_icon: formData.habit_icon,
                  frequency: formData.habit_frequency,
                  is_show: formData.habit_is_show,
                }
                : h
            ),
          }));
          localStorage.setItem("demo_habits_groups", JSON.stringify(updatedGroups));
        } catch (err) {
          console.error("Error updating demo habit in localStorage", err);
        }
      }

      // Update in demo_habits_done_dates
      const storedDoneDatesStr = localStorage.getItem("demo_habits_done_dates");
      if (storedDoneDatesStr) {
        try {
          const storedDoneDates = JSON.parse(storedDoneDatesStr);
          const updatedDoneDates = storedDoneDates.map((item: HabitWithDoneDates) => {
            if (item.habit.habit_id === formData.habit_id) {
              return {
                ...item,
                habit: {
                  ...item.habit,
                  habit_title: formData.habit_title,
                  habit_icon: formData.habit_icon,
                  frequency: formData.habit_frequency,
                  is_show: formData.habit_is_show,
                }
              };
            }
            return item;
          });
          localStorage.setItem("demo_habits_done_dates", JSON.stringify(updatedDoneDates));
        } catch (err) {
          console.error("Error updating demo habit done dates in localStorage", err);
        }
      }

      // Reload page to reflect changes from localStorage
      window.location.reload();
      return;
    }

    try {
      const response = await fetch(`/habits/${formData.habit_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habit_title: formData.habit_title,
          habit_icon: formData.habit_icon,
          habit_frequency: formData.habit_frequency,
          habit_is_show: formData.habit_is_show,
        }),
      });

      // if cookie failed
      if (response.redirected) {
        window.location.replace(response.url);
      }

      const data = await response.json();
      if (data.success) window.location.reload();
      if (!data.success) errorMessage.value = data.message;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      showHabitDetails.value = 0;
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <form
      onSubmit={submitEditHabit}
      class="fixed top-1/2 left-1/2 z-13 h-9/10 w-9/10 -translate-1/2 rounded-xl border border-background bg-white shadow-lg md:h-fit md:max-w-2xl"
    >
      <div class="flex h-1/10 items-center justify-start rounded-t-xl bg-linear-to-r from-hover to-background p-5">
        <h2 class="text-2xl font-bold text-white">Habit Details</h2>
      </div>
      <span
        class="absolute top-5 right-5 cursor-pointer text-2xl font-extrabold text-white"
        onClick={() => (showHabitDetails.value = 0)}
      >
        &#x2715;
      </span>
      <div class="p-6 overflow-y-auto max-h-[75vh]">
        {/* Habit Group Info (Read-only) */}
        <div class="mb-6 rounded-lg bg-gray-100 p-4">
          <h3 class="mb-1 text-lg font-semibold text-gray-800">Habit Group</h3>
          <div className="flex flex-row items-center">
            <h2 class="text-xl font-bold text-background">
              {habit.habits_group_title}
            </h2>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
          {/* Habit Title */}
          <div class="mb-4 md:col-span-2">
            <label
              class="mb-2 block text-sm font-bold text-gray-700"
              for="habit_title"
            >
              Habit Title
            </label>
            <input
              type="text"
              id="habit_title"
              name="habit_title"
              value={formData.habit_title}
              onChange={handleChange}
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Habit Icon */}
          <div class="mb-4">
            <label
              class="mb-2 block text-sm font-bold text-gray-700"
              for="habit_icon"
            >
              Icon (Emoji)
            </label>
            <input
              type="text"
              id="habit_icon"
              name="habit_icon"
              value={formData.habit_icon}
              onChange={handleChange}
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Frequency */}
          <div class="mb-4">
            <label
              class="mb-2 block text-sm font-bold text-gray-700"
              for="habit_frequency"
            >
              Frequency (Target)
            </label>
            <input
              type="number"
              id="habit_frequency"
              name="habit_frequency"
              value={formData.habit_frequency}
              onChange={handleChange}
              min="1"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => showDeleteConfirm.value = true}
            class={`cursor-pointer rounded-md px-4 py-2 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 ${showDeleteConfirm.value
              ? "cursor-default bg-red-300"
              : "bg-red-500 hover:bg-red-600"
              }`}
            disabled={showDeleteConfirm.value}
          >
            Delete Habit
          </button>

          {/* Conditional Yes/No buttons */}
          {showDeleteConfirm.value && (
            <div class="flex items-center space-x-2 border-l border-gray-300 pl-3">
              <span class="mr-1 text-sm font-medium text-gray-700">Sure?</span>
              <button
                type="button"
                onClick={submitDeleteHabit}
                class="cursor-pointer rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 focus:outline-none"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => showDeleteConfirm.value = false}
                class="cursor-pointer rounded-md bg-gray-200 px-3 py-2 text-sm text-gray-800 hover:bg-gray-300 focus:outline-none"
              >
                No
              </button>
            </div>
          )}

          <button
            type="submit"
            class="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}
