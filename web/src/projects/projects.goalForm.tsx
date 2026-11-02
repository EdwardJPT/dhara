import { Signal, useComputed, useSignal, useSignalEffect } from "@preact/signals";
import type { JSX } from "preact";
import type { Project } from "../models";
import type { Goal } from "../home/types";

interface GoalFormProps {
  projects: Signal<Project[]>;
  goals: Signal<Goal[]>;
  selectedGoalId: Signal<string>;
  onClose: () => void;
  isDemo: boolean;
}

export function NewGoalForm({ projects, goals, selectedGoalId, onClose, isDemo }: GoalFormProps) {
  const goal = useSignal("");
  const projectIds = useSignal<number[]>([]);
  const isSubmitting = useSignal(false);
  const errorMessage = useSignal("");
  const showDeleteConfirm = useSignal(false);
  const selectedGoal = useComputed(() => goals.value.find(goal => String(goal.goal_id) === selectedGoalId.value));
  const availableProjects = useComputed(() => selectedGoal.value
    ? projects.value
    : projects.value.filter(project => !project.is_done));
  const selectedProjectIds = useComputed(() => availableProjects.value
    .filter(project => projectIds.value.includes(project.project_id))
    .map(project => project.project_id));

  useSignalEffect(() => {
    const selected = selectedGoal.value;
    goal.value = selected?.goal_title || "";
    errorMessage.value = "";
    showDeleteConfirm.value = false;
    try {
      const ids = selected ? JSON.parse(selected.project_ids) : [];
      projectIds.value = Array.isArray(ids) ? ids : [];
    } catch (error) {
      projectIds.value = [];
      errorMessage.value = "Could not read the projects attached to this goal.";
      console.error("Error parsing goal project IDs:", error);
    }
  });

  const sendRequest = async (url: string, options: RequestInit): Promise<boolean> => {
    const response = await fetch(url, options);
    if (response.redirected) {
      window.location.replace(response.url);
      return false;
    }
    const data = await response.json();
    if (!response.ok || !data.success) {
      errorMessage.value = data.message || "Failed to save changes to the goal. Please try again.";
      return false;
    }
    return true;
  };

  const handleSubmit: JSX.SubmitEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    if (isSubmitting.value) return;

    const goalName = goal.value.trim();
    if (!goalName) {
      errorMessage.value = "Please enter a goal.";
      return;
    }
    if (selectedProjectIds.value.length === 0) {
      errorMessage.value = "Please attach at least one project.";
      return;
    }

    errorMessage.value = "";
    isSubmitting.value = true;
    try {
      const requestData = {
        goal: goalName,
        project_ids: selectedProjectIds.value,
      };
      const editingGoal = selectedGoal.value;

      // Follow the other demo forms: save locally and reload.
      if (isDemo) {
        const updatedGoal: Goal = {
          ...editingGoal,
          goal_id: editingGoal?.goal_id ?? Date.now(),
          user_id: 1,
          goal_title: requestData.goal,
          project_ids: JSON.stringify(requestData.project_ids),
          created_at: editingGoal?.created_at ?? new Date().toISOString(),
        };
        const currentGoals = editingGoal
          ? goals.value.map(item => item.goal_id === editingGoal.goal_id ? updatedGoal : item)
          : [...goals.value, updatedGoal];
        localStorage.setItem("demo_goals", JSON.stringify(currentGoals));
        window.location.reload();
        return;
      }

      const saved = await sendRequest(editingGoal ? `/goals/${editingGoal.goal_id}` : "/goals", {
        method: editingGoal ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (saved) window.location.reload();
    } catch (error) {
      errorMessage.value = "Failed to save the goal. Please try again.";
      console.error("Failed to save goal:", error);
    } finally {
      isSubmitting.value = false;
    }
  };

  const handleDelete = async () => {
    const deletingGoal = selectedGoal.value;
    if (!deletingGoal || isSubmitting.value) return;
    isSubmitting.value = true;
    errorMessage.value = "";
    try {
      if (isDemo) {
        localStorage.setItem("demo_goals", JSON.stringify(goals.value.filter(item => item.goal_id !== deletingGoal.goal_id)));
        window.location.reload();
        return;
      }
      if (await sendRequest(`/goals/${deletingGoal.goal_id}`, { method: "DELETE" })) {
        window.location.reload();
      }
    } catch (error) {
      errorMessage.value = "Failed to delete the goal. Please try again.";
      console.error("Failed to delete goal:", error);
    } finally {
      isSubmitting.value = false;
    }
  };

  return (
    <form
      id="new-goal-form"
      onSubmit={handleSubmit}
      aria-labelledby="new-goal-title"
      aria-busy={isSubmitting.value}
      class="mb-6 rounded-sm border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <h2 id="new-goal-title" class="mb-4 text-xl font-semibold text-background">
        {selectedGoal.value ? "Manage Goals" : "Add Goal"}
      </h2>
      <fieldset disabled={isSubmitting.value} class="min-w-0 space-y-4">
        {goals.value.length > 0 && (
          <div>
            <label for="existing-goal" class="mb-2 block text-base font-semibold">Select a goal</label>
            <select
              id="existing-goal"
              value={selectedGoalId.value}
              onChange={e => selectedGoalId.value = e.currentTarget.value}
              class="min-h-11 w-full min-w-0 border border-slate-300 bg-white px-3 py-2 text-base focus:border-background"
            >
              <option value="new">+ Create a new goal</option>
              {goals.value.map(item => <option key={item.goal_id} value={item.goal_id}>{item.goal_title}</option>)}
            </select>
          </div>
        )}
        <div>
          <label for="goal-name" class="mb-2 block text-base font-semibold">Goal name</label>
          <input
            id="goal-name"
            name="goal"
            type="text"
            required
            autoFocus={!selectedGoal.value}
            placeholder="What would you like to achieve?"
            value={goal.value}
            onInput={e => goal.value = e.currentTarget.value}
            class="min-h-11 w-full min-w-0 border border-slate-300 px-3 py-2 text-base outline-none focus:border-background focus:ring-1 focus:ring-background"
          />
        </div>

        <fieldset class="min-w-0 rounded-sm border border-slate-300 p-3">
          <legend class="px-1 text-base font-semibold">Attach projects (at least one)</legend>
          {availableProjects.value.length > 0 ? (
            <div class="max-h-64 space-y-1 overflow-y-auto">
              {availableProjects.value.map(project => (
                <label
                  key={project.project_id}
                  class="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    name="project_ids"
                    value={project.project_id}
                    checked={projectIds.value.includes(project.project_id)}
                    onChange={e => {
                      projectIds.value = e.currentTarget.checked
                        ? [...projectIds.value, project.project_id]
                        : projectIds.value.filter(id => id !== project.project_id);
                    }}
                    class="h-4 w-4 shrink-0 accent-background"
                  />
                  <span class="min-w-0 text-base wrap-anywhere">{project.project_title}</span>
                  {project.is_done && <span class="shrink-0 rounded bg-pink-100 px-2 py-1 text-xs font-semibold text-slate-600">Finished</span>}
                </label>
              ))}
            </div>
          ) : (
            <p class="py-2 text-sm text-slate-500">{selectedGoal.value ? "No projects available to attach." : "No unfinished projects available to attach."}</p>
          )}
        </fieldset>

        {errorMessage.value && <p role="alert" class="text-sm text-red-700">{errorMessage.value}</p>}

        {selectedGoal.value && (
          showDeleteConfirm.value ? (
            <div class="flex flex-wrap items-center gap-3 rounded-md border border-red-200 bg-red-50 p-3">
              <p class="w-full text-sm text-red-700">Delete this goal? Your projects will be kept.</p>
              <button type="button" onClick={handleDelete} class="min-h-11 cursor-pointer rounded-md bg-red-700 px-4 font-semibold text-white hover:bg-red-800">Delete Goal</button>
              <button type="button" onClick={() => showDeleteConfirm.value = false} class="min-h-11 cursor-pointer px-3 font-semibold text-slate-600 hover:underline">Keep Goal</button>
            </div>
          ) : (
            <button type="button" onClick={() => showDeleteConfirm.value = true} class="min-h-11 cursor-pointer text-sm font-semibold text-red-700 hover:underline">Delete Goal</button>
          )
        )}

        <div class="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            class="min-h-11 cursor-pointer rounded-md border border-slate-300 px-4 text-base font-semibold hover:bg-slate-50 disabled:cursor-wait disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting.value || selectedProjectIds.value.length === 0}
            class="min-h-11 cursor-pointer rounded-md bg-background px-4 text-base font-semibold text-white hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting.value ? "Saving…" : selectedGoal.value ? "Save Changes" : "Create Goal"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
