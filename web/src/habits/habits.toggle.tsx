import { Signal, useSignal } from "@preact/signals";

interface ToggleProps {
  habitsGroupId: number;
  habitsGroupTitle: string;
  isShow: boolean;
  handleToggleHide: (habitGroupId: number, checked: boolean) => void;
  errorMessage: Signal<string>;
  isDemo: boolean;
}

export function Toggle({
  habitsGroupId,
  habitsGroupTitle,
  isShow,
  handleToggleHide,
  errorMessage,
  isDemo = false,
}: ToggleProps) {
  // Update the isShow to the backend too
  const isShowGroup = useSignal(isShow);
  const toggleHabitGroupIsShow = async (checked: boolean, habitsGroupId: number) => {
    try {
      // Handle demo mode early and exit
      if (isDemo) {
        isShowGroup.value = checked;
        handleToggleHide(habitsGroupId, checked);
        return;
      }
      const response = await fetch(`/habits/group/${habitsGroupId}/is-show`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checked, habits_group_id: habitsGroupId }),
      });
      // if cookie failed
      if (response.redirected) window.location.replace(response.url);
      const data = await response.json();
      // if success, update the the toggle of is show of the habits group
      if (data.success) {
        isShowGroup.value = checked;
        handleToggleHide(habitsGroupId, checked);
      }
      if (!data.success) errorMessage.value = "There's error in the backend.";
    } catch (error) {
      console.log(error);
      errorMessage.value = "There's error in the backend.";
    }
  };

  return (
    <label
      htmlFor={habitsGroupTitle + "-" + String(habitsGroupId)}
      class="flex items-center cursor-pointer"
    >
      <div class="relative">
        <input
          type="checkbox"
          id={habitsGroupTitle + "-" + String(habitsGroupId)}
          class="sr-only peer"
          checked={isShowGroup.value}
          onChange={() => toggleHabitGroupIsShow(!isShowGroup.value, habitsGroupId)}
        />
        <div
          class={`block w-11 h-6 rounded-full transition ${isShowGroup.value ? 'bg-background' : 'bg-gray-400'}`}
        >
        </div>
        <div
          class={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${isShowGroup.value ? 'translate-x-5' : ''}`}
        >
        </div>
      </div>
      <h4 class="ml-3 text-base font-medium text-background">
        {habitsGroupTitle}
      </h4>
    </label>
  );
}
