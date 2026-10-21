import { Signal, useSignal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";

export interface HabitsGroupData {
  habitsGroupId: number;
  habitsGroupTitle: string;
  habitsCount: number;
}

interface HabitsGroupDetailsProps {
  groupSignal: Signal<HabitsGroupData | null>;
  errorMessage: Signal<string>;
  showGroupDetails: Signal<number>; // Controls visibility (0 = closed, otherwise group ID)
  isDemo?: boolean;
}

export function HabitsGroupDetails({
  groupSignal,
  errorMessage,
  showGroupDetails,
  isDemo = false,
}: HabitsGroupDetailsProps) {
  // Fallback to please typescript
  const group = groupSignal.value ?? ({} as HabitsGroupData);

  const [formData, setFormData] = useState({
    habitsGroupId: group.habitsGroupId || 0,
    habitsGroupTitle: group.habitsGroupTitle || "",
  });

  // Sync state when signal changes
  useEffect(() => {
    if (groupSignal.value) {
      setFormData({
        habitsGroupId: groupSignal.value.habitsGroupId,
        habitsGroupTitle: groupSignal.value.habitsGroupTitle,
      });
    }
  }, [groupSignal.value]);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showDeleteConfirm = useSignal(false);

  const submitDeleteGroup = async () => {
    if (isDemo) {
      // Mock demo deletion logic
      const storedGroupsStr = localStorage.getItem("demo_habits_groups");
      if (storedGroupsStr) {
        try {
          const storedGroups = JSON.parse(storedGroupsStr);
          const updatedGroups = storedGroups.filter(
            (g: any) => g.habits_group_id !== formData.habitsGroupId
          );
          localStorage.setItem("demo_habits_groups", JSON.stringify(updatedGroups));
        } catch (err) {
          console.error("Error deleting demo habit group in localStorage", err);
        }
      }
      window.location.reload();
      return;
    }

    try {
      // Using habitsGroupId for the backend request reference
      const response = await fetch(`/habits/group/${formData.habitsGroupId}`, {
        method: "DELETE"
      });

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

  const submitEditGroup = async (e: Event) => {
    e.preventDefault();

    if (isDemo) {
      // Mock demo update logic
      const storedGroupsStr = localStorage.getItem("demo_habits_groups");
      if (storedGroupsStr) {
        try {
          const storedGroups = JSON.parse(storedGroupsStr);
          const updatedGroups = storedGroups.map((g: any) =>
            g.habits_group_id === formData.habitsGroupId
              ? { ...g, habits_group_title: formData.habitsGroupTitle }
              : g
          );
          localStorage.setItem("demo_habits_groups", JSON.stringify(updatedGroups));
        } catch (err) {
          console.error("Error updating demo habit group in localStorage", err);
        }
      }
      window.location.reload();
      return;
    }

    try {
      const response = await fetch(`/habits/group/${formData.habitsGroupId}/title`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitsGroupTitle: formData.habitsGroupTitle }),
      });

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

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      showGroupDetails.value = 0;
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Determine if delete should be disabled
  const cannotDelete = group.habitsCount > 0;

  return (
    <form
      onSubmit={submitEditGroup}
      class="fixed top-1/2 left-1/2 z-13 h-9/10 w-9/10 -translate-1/2 rounded-xl border border-background bg-white shadow-lg md:h-fit md:max-w-2xl"
    >
      <div class="flex h-1/10 items-center justify-start rounded-t-xl bg-linear-to-r from-hover to-background p-5">
        <h2 class="text-2xl font-bold text-white">Habit Group Details</h2>
      </div>
      <span
        class="absolute top-5 right-5 cursor-pointer text-2xl font-extrabold text-white"
        onClick={() => (showGroupDetails.value = 0)}
      >
        &#x2715;
      </span>
      <div class="p-6 overflow-y-auto max-h-[75vh]">

        {/* Habit Count Info (Read-only) */}
        <div class="mb-6 rounded-lg bg-gray-100 p-4">
          <h3 class="mb-1 text-lg font-semibold text-gray-800">Total Habits in Group</h3>
          <div className="flex flex-row items-center">
            <h2 class="text-xl font-bold text-background">
              {group.habitsCount} {group.habitsCount === 1 ? 'Habit' : 'Habits'}
            </h2>
          </div>
          {cannotDelete && (
            <p class="mt-1 text-sm text-gray-500">
              * You must delete all habits in this group before deleting it.
            </p>
          )}
        </div>

        <div class="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
          {/* Habit Group Title */}
          <div class="mb-4 md:col-span-2">
            <label
              class="mb-2 block text-sm font-bold text-gray-700"
              for="habitsGroupTitle"
            >
              Group Title
            </label>
            <input
              type="text"
              id="habitsGroupTitle"
              name="habitsGroupTitle"
              value={formData.habitsGroupTitle}
              onChange={handleChange}
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => { if (!cannotDelete) showDeleteConfirm.value = true }}
            class={`rounded-md px-4 py-2 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 ${cannotDelete
              ? "cursor-not-allowed bg-red-300 opacity-50"
              : showDeleteConfirm.value
                ? "cursor-default bg-red-300"
                : "cursor-pointer bg-red-500 hover:bg-red-600"
              }`}
            disabled={showDeleteConfirm.value || cannotDelete}
            title={cannotDelete ? "Cannot delete group containing habits" : "Delete this group"}
          >
            Delete Group
          </button>

          {/* Conditional Yes/No buttons */}
          {showDeleteConfirm.value && !cannotDelete && (
            <div class="flex items-center space-x-2 border-l border-gray-300 pl-3">
              <span class="mr-1 text-sm font-medium text-gray-700">Sure?</span>
              <button
                type="button"
                onClick={submitDeleteGroup}
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
