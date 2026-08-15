import { Signal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";

import { TasksWithProject } from "./types";
import { formattingDateObj } from "../components/constants";

interface TaskDetailsProps {
  taskSignal: Signal<TasksWithProject | null>;
  setErrorMessage: (message: string) => void;
  isDemo: boolean;
}

export function TaskDetails({ taskSignal, setErrorMessage, isDemo }: TaskDetailsProps) {
  // If this component is called, the value of taskSignal won't ever be null
  // we do it to please typescript
  const task = taskSignal.value ?? ({} as TasksWithProject);

  const [formData, setFormData] = useState({
    task_id: task.task_id,
    task_title: task.task_title,
    task_desc: task.task_desc,
    task_priority: task.task_priority,
    task_due_date: task.task_due_date,
    task_is_done: task.task_is_done,
    task_done_date: task.task_done_date,
  });

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    setFormData((prev) => {
      // First, update the field that triggered the change
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? (target as HTMLInputElement).checked
          : type === "number" ? parseInt(value) || 0 : value,
      };
      // Then handle specific logic for dates based on the name
      if (name === "task_is_done") {
        // If checked is true, set to current unix time. If false, reset to 0
        newData.task_done_date = (target as HTMLInputElement).checked
          ? Math.floor(Date.now() / 1000) : 0;
      }

      if (name === "task_done_date") {
        newData.task_done_date = Math.floor(new Date(value).getTime() / 1000);
      }

      return newData;
    });
  };

  const submitEditTask = async (e: Event) => {
    e.preventDefault();

    // Handle demo mode early and exit
    if (isDemo) {
      // Update database (localStorage demo_tasks)
      const storedTasksStr = localStorage.getItem("demo_tasks");
      if (storedTasksStr) {
        try {
          const storedTasks = JSON.parse(storedTasksStr);
          const updatedTasks = storedTasks.map((t: any) =>
            t.task_id === formData.task_id
              ? {
                ...t,
                task_title: formData.task_title,
                task_desc: formData.task_desc,
                priority: formData.task_priority,
                due_date: formData.task_due_date,
                is_done: formData.task_is_done,
                done_date: formData.task_done_date,
              }
              : t
          );
          localStorage.setItem("demo_tasks", JSON.stringify(updatedTasks));
        } catch (err) {
          console.error("Error updating demo_tasks in localStorage", err);
        }
      }

      // Update database (localStorage demo_projects) if completion status changed
      if (task.task_is_done !== formData.task_is_done) {
        const storedProjectsStr = localStorage.getItem("demo_projects");
        if (storedProjectsStr) {
          try {
            const storedProjects = JSON.parse(storedProjectsStr);
            const updatedProjects = storedProjects.map((p: any) =>
              p.project_title === task.project_title
                ? {
                  ...p,
                  to_dos_done: formData.task_is_done
                    ? p.to_dos_done + 1
                    : p.to_dos_done - 1,
                }
                : p
            );
            localStorage.setItem("demo_projects", JSON.stringify(updatedProjects));
          } catch (err) {
            console.error("Error updating demo_projects in localStorage", err);
          }
        }
      }
      // Reload page to reflect changes from localStorage
      window.location.reload();
      return;
    }

    try {
      const response = await fetch(`/task/${formData.task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_title: formData.task_title,
          task_desc: formData.task_desc,
          task_priority: formData.task_priority,
          task_due_date: formData.task_due_date,
          task_is_done: formData.task_is_done,
          task_done_date: formData.task_done_date,
        }),
      });
      // if cookie failed
      if (response.redirected) {
        window.location.replace(response.url);
      }
      const data = await response.json();
      // ?TODO: Too lazy to make it responsive for now, make it to reload instead
      if (data.success) window.location.reload();
      if (!data.success) setErrorMessage(data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      taskSignal.value = null;
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <form
      onSubmit={submitEditTask}
      class="fixed top-1/2 left-1/2 z-13 h-9/10 w-9/10 -translate-1/2 rounded-xl border border-background bg-white shadow-lg md:h-fit md:max-w-2xl"
    >
      <div class="flex h-1/10 items-center justify-start rounded-t-xl bg-linear-to-r from-hover to-background p-5">
        <h2 class="text-2xl font-bold text-white">Task Details</h2>
      </div>
      <span
        class="absolute top-5 right-5 cursor-pointer text-2xl font-extrabold text-white"
        onClick={() => (taskSignal.value = null)}
      >
        &#x2715;
      </span>
      <div class="p-6">
        {/* Project Info (Read-only) */}
        <div class="mb-6 rounded-lg bg-gray-100 p-4">
          <h3 class="mb-1 text-lg font-semibold text-gray-800">Project</h3>
          <div className="flex flex-row items-center">
            <h2 class=" text-xl font-bold text-background">
              {task.project_title}
            </h2>
            {task.project_priority && (
              <span class="ml-1 inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-background">
                Priority Project
              </span>
            )}
          </div>
        </div>

        <div class="grid grid-cols-1 gap-2">
          {/* Task Title */}
          <div class="mb-4">
            <label
              class="mb-2 block text-sm font-bold text-gray-700"
              for="task_title"
            >
              Task Title
            </label>
            <input
              type="text"
              id="task_title"
              name="task_title"
              value={formData.task_title}
              onChange={handleChange}
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Task Description */}
          <div class="mb-4">
            <label
              class="mb-2 block text-sm font-bold text-gray-700"
              for="task_desc"
            >
              Task Description
            </label>
            <textarea
              name="task_desc"
              value={formData.task_desc}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-transparent focus:ring-1 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Priority Toggle */}
          <div class="mb-4 flex items-center justify-between rounded-md bg-gray-100 p-3">
            <label for="priority-toggle" class="text-base font-medium text-gray-700 cursor-pointer">
              Priority
            </label>
            <div class="flex items-center">
              <span class="mr-2 text-sm text-gray-500">No</span>
              <button
                id="priority-toggle"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    task_priority: !prev.task_priority,
                  }))
                }
                type="button"
                class={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer
                  ${formData.task_priority ? "bg-background" : "bg-gray-400"}
                `}
              >
                <span
                  class={`inline-block h-4 w-4 transform rounded-full bg-white transition ease-in-out
                    ${formData.task_priority ? "translate-x-6" : "translate-x-1"}`}
                ></span>
              </button>
              <span class="ml-2 text-sm text-gray-500">Yes</span>
            </div>
          </div>

          {/* Due Date */}
          <div class="mb-4">
            <label
              class="mb-2 block text-sm font-bold text-gray-700"
              for="task_due_date"
            >
              Due Date
            </label>
            <input
              type="date"
              id="task_due_date"
              name="task_due_date"
              value={formData.task_due_date}
              onChange={handleChange}
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Completion */}
          <div class="mb-4">
            <label class="flex items-center">
              <input
                id="task-complete-button"
                type="checkbox"
                name="task_is_done"
                checked={formData.task_is_done}
                onChange={handleChange}
                class="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              {formData.task_is_done
                ? <label for="task-complete-button" class="ml-2 text-gray-800 cursor-pointer">The task is complete.</label>
                : <span class="ml-2 text-gray-700">Mark this task as complete?</span>
              }
            </label>
            {formData.task_is_done && (
              <div class="mt-2">
                <label
                  class="mb-2 block text-sm font-bold text-gray-700"
                  for="task_done_date"
                >
                  Completion Date
                </label>
                <input
                  type="date"
                  id="task_done_date"
                  name="task_done_date"
                  value={formattingDateObj(new Date(formData.task_done_date * 1000))}
                  onChange={handleChange}
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="submit"
            class="rounded-md bg-blue-600 px-4 py-2 text-white cursor-pointer hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}
