import { ReadonlySignal, Signal, useSignal, useSignalEffect } from "@preact/signals";
import { useRef } from "preact/hooks";

import { todayUserTimeZone, formattingDateTask } from "../utils";

import { Project, Task, TasksWithProject } from "./types";
import { TaskDetails } from "./project.task";
import { SortValue } from "./project";

interface TaskDisplayProps {
  tasks: Signal<Task[]>;
  shownTasks: ReadonlySignal<Task[]>;
  project: Signal<Project>;
  sortCategory: Signal<SortValue>;
  setErrorMessage: (message: string) => string;
  isDemo: boolean;
}

const today = todayUserTimeZone();
const dateToday = new Date(today);

export function TasksDisplay({
  tasks,
  shownTasks,
  project,
  sortCategory,
  setErrorMessage,
  isDemo,
}: TaskDisplayProps) {
  const setTasks = (taskId: number, checked: boolean) => {
    const done_date = checked ? Math.floor(new Date().getTime() / 1000) : 0;
    tasks.value = tasks.value.map((task) =>
      task.task_id === taskId ? { ...task, is_done: checked, done_date } : task
    );
  };

  const toggleTaskDoneStatus = async (
    checked: boolean,
    taskId: number,
    projectId: number
  ) => {
    try {
      // Handle demo mode early and exit
      if (isDemo) {
        // Update UI (Signals)
        setTasks(taskId, checked);
        let newProject = project.value;
        let newToDosDone = checked
          ? newProject.to_dos_done + 1
          : newProject.to_dos_done - 1;
        newProject = { ...newProject, to_dos_done: newToDosDone };
        project.value = newProject;

        // Update database (localStorage demo_tasks)
        const storedTasksStr = localStorage.getItem("demo_tasks");
        if (storedTasksStr) {
          try {
            const storedTasks = JSON.parse(storedTasksStr);
            const done_date = checked ? Math.floor(Date.now() / 1000) : 0;
            const updatedTasks = storedTasks.map((t: Task) =>
              t.task_id === taskId ? { ...t, is_done: checked, done_date } : t
            );
            localStorage.setItem("demo_tasks", JSON.stringify(updatedTasks));
          } catch (e) {
            console.error("Error updating demo_tasks in localStorage", e);
          }
        }

        // Update database (localStorage demo_projects)
        const storedProjectsStr = localStorage.getItem("demo_projects");
        if (storedProjectsStr) {
          try {
            const storedProjects = JSON.parse(storedProjectsStr);
            const updatedProjects = storedProjects.map((p: Project) =>
              p.project_id === projectId ? { ...p, to_dos_done: newToDosDone } : p
            );
            localStorage.setItem("demo_projects", JSON.stringify(updatedProjects));
          } catch (e) {
            console.error("Error updating demo_projects in localStorage", e);
          }
        }
        return;
      }

      const response = await fetch(`/task/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doneStatus: checked, taskId, projectId }),
      });
      // if cookie failed
      if (response.redirected) {
        window.location.replace(response.url);
      }
      const data = await response.json();
      // if success, update the the shown tasks and projects
      if (data.success) {
        setTasks(taskId, checked);
        let newProject = project.value;
        let newToDosDone = checked
          ? newProject.to_dos_done + 1
          : newProject.to_dos_done - 1;
        newProject = { ...newProject, to_dos_done: newToDosDone };
        project.value = newProject;
      }
      if (!data.success) setErrorMessage("There's an error.");
    } catch (error) {
      console.log(error);
      // revert the checkbox of task id
      setTasks(taskId, !checked);
      setErrorMessage("There's an error in the server");
    }
  };

  const updateTasksDueDate = (taskId: number, due_date: string) => {
    tasks.value = tasks.value.map((task) =>
      task.task_id === taskId ? { ...task, due_date } : task
    );
  };

  const handleChangeDueDate = async (e: any) => {
    e.preventDefault();
    try {
      const taskId = parseInt(e.target[0].name.split("-")[1]);
      const due_date = e.target[0].value;

      // Handle demo mode early and exit
      if (isDemo) {
        // Update UI (Signals)
        updateTasksDueDate(taskId, due_date);

        // Update database (localStorage demo_tasks)
        const storedTasksStr = localStorage.getItem("demo_tasks");
        if (storedTasksStr) {
          try {
            const storedTasks = JSON.parse(storedTasksStr);
            const updatedTasks = storedTasks.map((t: Task) =>
              t.task_id === taskId ? { ...t, due_date } : t
            );
            localStorage.setItem("demo_tasks", JSON.stringify(updatedTasks));
          } catch (err) {
            console.error("Error updating demo_tasks in localStorage", err);
          }
        }
        return;
      }

      const response = await fetch(`/task/${taskId}/due-date`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due_date, taskId }),
      });
      // if cookie failed
      if (response.redirected) {
        window.location.replace(response.url);
      }
      const data = await response.json();
      // if success, update the the shown tasks and projects
      if (data.success) updateTasksDueDate(taskId, due_date);
      if (!data.success) setErrorMessage("There's an error.");
    } catch (error) {
      console.log(error);
      setErrorMessage("There's an error in the server");
    }
  };

  const idToDelete = useSignal(0);

  const handleDelete = async (taskId: number) => {
    try {
      // Handle demo mode early and exit
      if (isDemo) {
        let isDone = false;

        // Update the UI (Signals) list of tasks
        tasks.value = tasks.value.filter((task) => {
          if (task.task_id === taskId) isDone = task.is_done;
          return task.task_id !== taskId;
        });

        // Update the UI (Signals) project counters
        project.value = {
          ...project.value,
          to_dos_all: project.value.to_dos_all - 1,
          to_dos_done: project.value.to_dos_done - (isDone ? 1 : 0),
        };

        // Update database (localStorage demo_tasks)
        const storedTasksStr = localStorage.getItem("demo_tasks");
        if (storedTasksStr) {
          try {
            const storedTasks = JSON.parse(storedTasksStr);
            const updatedTasks = storedTasks.filter((t: Task) => t.task_id !== taskId);
            localStorage.setItem("demo_tasks", JSON.stringify(updatedTasks));
          } catch (e) {
            console.error("Error deleting from demo_tasks in localStorage", e);
          }
        }

        // Update database (localStorage demo_projects)
        const storedProjectsStr = localStorage.getItem("demo_projects");
        if (storedProjectsStr) {
          try {
            const storedProjects = JSON.parse(storedProjectsStr);
            const updatedProjects = storedProjects.map((p: Project) =>
              p.project_id === project.value.project_id
                ? {
                  ...p,
                  to_dos_all: p.to_dos_all - 1,
                  to_dos_done: p.to_dos_done - (isDone ? 1 : 0),
                }
                : p
            );
            localStorage.setItem("demo_projects", JSON.stringify(updatedProjects));
          } catch (e) {
            console.error("Error updating demo_projects in localStorage", e);
          }
        }
        return;
      }

      const response = await fetch(`/task/${taskId}`, { method: "DELETE" });
      // if cookie failed
      if (response.redirected) {
        window.location.replace(response.url);
      }
      const data = await response.json();
      if (data.success) {
        let isDone;
        // update the list of task
        tasks.value = tasks.value.filter((task) => {
          if (task.task_id === taskId) isDone = task.is_done;
          return task.task_id !== taskId;
        });
        // update the amount of to_dos_all and to_dos_done
        project.value = {
          ...project.value,
          to_dos_all: project.value.to_dos_all - 1,
          to_dos_done: project.value.to_dos_done - (isDone ? 1 : 0),
        };
      }
      if (!data.success) setErrorMessage("There's an error.");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Effect so that when we have a lot of tasks, when change the value of shownTasks
  // it would automatically scroll to the first unfinished/finished task
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useSignalEffect(() => {
    let taskTarget;

    // if the user sort the task based on done_date of the task,
    // scroll to the first finished task
    if (sortCategory.value === "doneDateAsc" || sortCategory.value === "doneDateDesc") {
      taskTarget = shownTasks.value.find(task => task.is_done);
    }
    // if the user sort the task based on due_date of the task or priorit,
    // scroll to the first unfinished task
    else {
      taskTarget = shownTasks.value.find(task => !task.is_done);
    }

    if (taskTarget) {
      const targetId = `task-item-${taskTarget.task_id}`;

      // setTimeout ensures the DOM has painted before we try to scroll
      setTimeout(() => {
        const container = scrollContainerRef.current;
        const targetElement = document.getElementById(targetId);

        if (container && targetElement) {
          // Calculate the exact top position of the target relative to the container
          const containerRect = container.getBoundingClientRect();
          const targetRect = targetElement.getBoundingClientRect();

          // Current scroll position + distance from the top of the container to the target
          const scrollPos = container.scrollTop + (targetRect.top - containerRect.top);

          // Scroll to the specific div
          container.scrollTo({ top: scrollPos, behavior: 'smooth' });
        }
      }, 10);
    }
  });

  const shownTask: Signal<TasksWithProject | null> = useSignal(null);

  return (
    <div class="mx-auto max-w-3xl w-full overflow-hidden rounded-lg bg-white shadow">
      <div
        ref={scrollContainerRef}
        class="max-h-[calc(100vh-100px)] w-full snap-y snap-mandatory divide-y divide-gray-200 overflow-y-auto bg-white"
      >
        {shownTasks.value &&
          shownTasks.value.map((task, i) => (
            <div
              id={`task-item-${task.task_id}`}
              key={`task-${task.task_id}`}
              class={`
              ${i % 2 == 0 ? "bg-[#e0fffd]" : ""}
              ${task.is_done && idToDelete.value != task.task_id ? "bg-pink-200 opacity-60" : ""}
              hover:${i % 2 == 0 ? "bg-[#e0fffd]" : "bg-white"} hover:opacity-100
              flex flex-col w-full group snap-start
            `}
            >
              {/* Main Task Row - Styled exactly like the Reference */}
              <div
                class="group flex flex-wrap sm:flex-nowrap items-start cursor-pointer px-3 py-3 sm:px-4 md:px-6 sm:py-4 w-full min-h-25 md:min-w-2xl hover:bg-white hover:opacity-100"
                onClick={() => {
                  shownTask.value = {
                    task_id: task.task_id,
                    task_title: task.task_title,
                    task_desc: task.task_desc,
                    task_priority: task.priority,
                    task_due_date: task.due_date,
                    task_is_done: task.is_done,
                    task_done_date: task.done_date,
                    project_title: project.value.project_title,
                    project_priority: false,
                    project_due_date: "",
                    project_is_done: false,
                    project_done_date: 0
                  };
                }}
              >
                <input
                  type="checkbox"
                  class="mt-1 sm:mt-1.5 h-4 w-4 sm:h-5 sm:w-5 shrink-0 rounded"
                  id={`task-${task.task_id}`}
                  checked={task.is_done}
                  aria-label={`Mark task "${task.task_title}" as ${task.is_done ? 'incomplete' : 'complete'}`}
                  onClick={(e: Event) => {
                    e.stopPropagation();
                    const inputElement = e.target as HTMLInputElement;
                    const checked: boolean = inputElement?.checked;
                    // change the status
                    toggleTaskDoneStatus(checked, task.task_id, task.project_id);
                  }}
                />

                {/* Middle Column: Title, Desc, Due Date (Moved from right column) */}
                <div class="ml-2 sm:ml-3 flex-1 min-w-0 sm:w-7/10 text-gray-900 group">
                  <p class="text-base sm:text-lg font-medium text-[#27354a] wrap-break-words">
                    {task.task_title}&nbsp;
                    {task.priority && (
                      <span class="inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 sm:p-1 text-[10px] sm:text-xs font-medium text-red-500 whitespace-nowrap">
                        Priority
                      </span>
                    )}
                  </p>

                  <p class="my-1 max-h-48 overflow-y-auto text-sm sm:text-base text-gray-500 wrap-break-words">
                    {task.task_desc}
                  </p>

                  {/* Due Date & Reschedule Form (Now formatted in a row exactly like Reference) */}
                  <div class="text-xs sm:text-base font-semibold text-[#828a99] flex flex-wrap sm:flex-row items-center gap-x-2 gap-y-1 group-hover:text-gray-500">
                    Due: {formattingDateTask(task.due_date)}

                    {!task.is_done && new Date(task.due_date) < dateToday && (
                      <form
                        id="overdue-reschedule"
                        class="w-full sm:w-auto"
                        onSubmit={handleChangeDueDate}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div class="group relative flex flex-row items-center">
                          <input
                            type="date"
                            id={`unsorted_due_date-${task.task_id}`}
                            name={`unsorted_due_date-${task.task_id}`}
                            class="p-1 sm:p-2 border border-solid border-gray-300 rounded flex-1 w-28 sm:w-auto text-xs sm:text-base"
                            required
                            min={today}
                            aria-label="Reschedule due date"
                          />
                          <button
                            type="submit"
                            class="cursor-pointer ml-1 sm:ml-2 text-lg sm:text-2xl font-extrabold text-background hover:text-white hover:bg-hover shrink-0"
                            aria-label="Submit new due date"
                          >
                            &#x2713;
                          </button>
                          <span class="hidden p-1 sm:p-2 z-10 bg-hover text-white w-max sm:w-fit group-hover:flex text-[10px] sm:text-sm rounded absolute bottom-full mb-1 sm:relative sm:bottom-auto sm:mb-0">
                            Reschedule due date?
                          </span>
                        </div>
                      </form>
                    )}
                  </div>

                  {task.done_date > 0 && (
                    <p class="mt-1 sm:mt-0 text-sm sm:text-base font-bold text-gray-500 wrap-break-words">
                      DONE :{" "}
                      {formattingDateTask(
                        new Date(task.done_date * 1000).toLocaleDateString(
                          "en-CA"
                        )
                      )}
                    </p>
                  )}
                </div>

                {/* Right Column: Project Title (Added back to match Reference structure) */}
                <div class="mt-2 sm:mt-0 pl-6 sm:pl-0 sm:ml-4 flex w-full sm:w-3/10 items-center justify-start sm:justify-end text-left sm:text-right text-sm sm:text-lg font-semibold text-gray-600 shrink-0 wrap-break-words">
                  {project.value?.project_title}
                </div>
              </div>

              {/* Delete button (Left untouched from your Target) */}
              <div
                class={`
                group-hover:flex flex-row items-center px-3 sm:px-6 py-2 sm:py-1 text-xs sm:text-base
                ${i % 2 == 0 ? "bg-ffg" : "bg-[#e0ffgd]"}
                ${idToDelete.value == task.task_id ? "flex" : "hidden "}
              `}
              >
                <button
                  onClick={() => (idToDelete.value = task.task_id)}
                  id={`delete-button-${task.task_id}`}
                  class="flex shrink-0 items-center justify-center h-5 w-5 sm:h-5 sm:w-5"
                >
                  <img
                    src="/static/images/bin.svg"
                    alt="delete button"
                    class="h-3 w-3 sm:h-4 sm:w-4 cursor-pointer"
                  />
                </button>
                <label
                  class={`
                  cursor-pointer ml-2 sm:ml-3 flex-1 sm:w-full text-xs sm:text-base
                  ${idToDelete.value == task.task_id ? "w-fit" : "w-full"}
                `}
                  for={`delete-button-${task.task_id}`}
                >
                  Delete this task?
                </label>

                <div
                  class={`${idToDelete.value == task.task_id ? "flex" : "hidden "} flex-row gap-2`}
                >
                  <button
                    type="submit"
                    onClick={() => handleDelete(task.task_id)}
                    class="cursor-pointer px-2 sm:px-4 py-1 text-xs sm:text-base font-extrabold rounded text-background hover:text-white hover:bg-hover"
                  >
                    &#x2713;Yes
                  </button>
                  <button
                    onClick={() => (idToDelete.value = 0)}
                    type="submit"
                    class="cursor-pointer px-2 sm:px-4 py-1 text-xs sm:text-base font-extrabold rounded text-background hover:text-white hover:bg-hover"
                  >
                    &#x2715;No
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {shownTask.value && (
        <TaskDetails
          taskSignal={shownTask}
          setErrorMessage={setErrorMessage}
          isDemo={isDemo}
        />
      )}
    </div>
  );
}
