import { Signal } from "@preact/signals";
import { useState } from "preact/hooks";
import { Project } from "./types";
import { todayUserTimeZone } from "../utils";

interface TaskFormProps {
  isAddingTasks: Signal<boolean>;
  project: Signal<Project>;
  setErrorMessage: (message: string) => string;
  isDemo: boolean;
}

const today = todayUserTimeZone();

export function TaskForm({
  isAddingTasks,
  project,
  setErrorMessage,
  isDemo,
}: TaskFormProps) {
  const [tasks, setTasks] = useState([
    {
      task_title: "",
      task_desc: "",
      priority: false,
      due_date: "",
    },
  ]);

  const addTaskField = () => {
    setTasks([
      ...tasks,
      {
        task_title: "",
        task_desc: "",
        priority: false,
        due_date: "",
      },
    ]);
  };

  const removeTaskField = (index: number) => {
    if (tasks.length > 1) {
      const newTasks = [...tasks];
      newTasks.splice(index, 1);
      setTasks(newTasks);
    }
  };

  type TaskInput = (typeof tasks)[number];

  const handleInputChange = <K extends keyof TaskInput>(
    index: number,
    field: K,
    value: TaskInput[K],
  ) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const submitAddingTasks = async (e: any) => {
    e.preventDefault();
    try {
      // Handle demo mode early and exit
      if (isDemo) {
        // Fetch existing demo tasks
        let storedTasks: any[] = [];
        const storedTasksStr = localStorage.getItem("demo_tasks");
        if (storedTasksStr) {
          try {
            storedTasks = JSON.parse(storedTasksStr);
          } catch (err) {
            console.error("Error parsing demo_tasks in localStorage", err);
          }
        }

        // Format the form input into proper Task objects
        const newMockTasks = tasks.map((t, index) => ({
          task_id: Date.now() + index, // Generate a unique mock ID
          project_id: project.value.project_id,
          task_title: t.task_title,
          task_desc: t.task_desc,
          priority: t.priority,
          is_done: false,
          done_date: 0,
          due_date: t.due_date,
          created_at: new Date().toISOString(),
        }));

        // Save the combined tasks back to localStorage
        localStorage.setItem("demo_tasks", JSON.stringify([...newMockTasks, ...storedTasks]));

        // Update the project's total task count (to_dos_all) AND reset completion status
        const storedProjectsStr = localStorage.getItem("demo_projects");
        if (storedProjectsStr) {
          try {
            const storedProjects = JSON.parse(storedProjectsStr);
            const updatedProjects = storedProjects.map((p: Project) =>
              p.project_id === project.value.project_id
                ? {
                  ...p,
                  to_dos_all: p.to_dos_all + tasks.length,
                  is_done: false, // Mark project as not done since it has new tasks
                  done_date: 0    // Reset done date
                }
                : p
            );
            localStorage.setItem("demo_projects", JSON.stringify(updatedProjects));
          } catch (err) {
            console.error("Error updating demo_projects in localStorage", err);
          }
        }

        // Trigger the reload exactly like the backend version does!
        window.location.reload();
        return;
      }

      // Format tasks for submission (add missing fields)
      const requestData = {
        task_data: tasks,
        projectId: project.value.project_id,
      };
      const response = await fetch(`/project/${project.value.public_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (response.redirected) {
        window.location.replace(response.url);
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const resp = await response.json();
      if (resp.success) window.location.reload();
      if (!resp.success) setErrorMessage(resp.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={submitAddingTasks}
      className="mx-auto w-full md:w-3xl rounded-sm bg-white p-4 sm:p-6 font-sans shadow-md"
    >
      <h2 className="mb-4 text-lg md:text-xl font-bold text-gray-800 flex items-center justify-between">
        Add Tasks
        <span
          onClick={() => (isAddingTasks.value = false)}
          class="cursor-pointer p-1 text-2xl leading-none"
        >
          &#x2715;
        </span>
      </h2>
      {tasks.map((task, index) => (
        <div
          key={index}
          className="mb-4 last:mb-0 rounded-sm border border-gray-200 bg-gray-50 p-3 sm:px-4 sm:py-3"
        >
          <div className="flex items-center justify-end">
            {tasks.length > 1 && (
              <button
                type="button"
                onClick={() => removeTaskField(index)}
                className="cursor-pointer p-1 text-lg text-red-500 hover:text-red-700"
              >
                &#x2715;
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <input
                required
                type="text"
                placeholder={`Task ${index + 1} Title *`}
                value={task.task_title}
                onChange={(e) =>
                  handleInputChange(index, "task_title", e.currentTarget.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base outline-none focus:border-transparent focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <textarea
                placeholder="Description"
                value={task.task_desc}
                onChange={(e) =>
                  handleInputChange(index, "task_desc", e.currentTarget.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base outline-none focus:border-transparent focus:ring-1 focus:ring-blue-500"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-0">
                <p className="w-full sm:w-24 shrink-0 text-sm font-medium text-gray-700">
                  Due Date
                </p>
                <input
                  required
                  type="date"
                  value={task.due_date}
                  onChange={(e) =>
                    handleInputChange(index, "due_date", e.currentTarget.value)
                  }
                  min={today}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base transition outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between rounded-md bg-gray-100 p-2 sm:p-3">
                <label className="block text-sm sm:text-base font-medium text-gray-700">
                  A priority task?
                </label>
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-500">No</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange(index, "priority", !task.priority)
                    }
                    className={`${task.priority ? "bg-blue-600" : "bg-gray-200"} relative inline-flex h-6 w-11 items-center rounded-full
                      transition`}
                  >
                    <span
                      className={`${task.priority ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition
                        ease-in-out`}
                    />
                  </button>
                  <span className="ml-2 text-sm text-gray-500">Yes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6 flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0">
        <button
          type="button"
          onClick={addTaskField}
          className="w-full sm:w-auto text-center rounded-md bg-gray-200 px-4 py-2 text-sm sm:text-base text-gray-700 transition-colors hover:bg-gray-300"
        >
          + Add Another Task
        </button>

        <button
          type="submit"
          className="w-full sm:w-auto text-center rounded-md bg-blue-600 px-6 py-2 text-sm sm:text-base text-white transition-colors hover:bg-blue-700 hover:cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          Submit Tasks
        </button>
      </div>
    </form>
  );
}
