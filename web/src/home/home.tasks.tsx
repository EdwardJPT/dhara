import { useSignal, useComputed, Signal, useSignalEffect } from "@preact/signals";
import { useMemo, useRef } from "preact/hooks";

import { Calendar } from "./home.calendar.jsx";
import { TaskDetails } from "./home.task";
import type { TasksWithProject } from "./types";

import {
  ALL,
  TaskFiltersPriority,
  TaskFiltersStatus,
  TaskFiltersTime,
  TaskSorter,
  formattingDateTask,
  todayUserTimeZone,
} from "../components/constants";

import type { Task } from "./types.ts";
import {
  TaskFilters,
  TaskPriorityValue,
  TaskStatusValue,
  TaskTimeValue,
} from "./home";
import { filterTasks } from "./utils";

const today = todayUserTimeZone();
const dateToday = new Date(today);

interface TasksProps {
  tasks: Signal<Task[]>;
  taskFilters: Signal<TaskFilters>;
  projectObj: Signal<{ [key: number]: string }>;
  setProjects: (projectId: number, checked: boolean) => void;
  setErrorMessage: (message: string) => void;
  isDemo: boolean;
}

type SortValue = (typeof TaskSorter)[keyof typeof TaskSorter];

interface TaskListItemProps {
  task: Task;
  index: number;
  projectTitle: string;
  isOverdue: boolean;
  dateToday: Date;
  today: string;
  shownTaskSignal: Signal<TasksWithProject | null>;
  toggleTaskDoneStatus: (checked: boolean, taskId: number, projectId: number) => void;
  handleChangeDueDate: (e: Event) => Promise<void>;
}

const TaskListItem = ({
  task,
  index,
  projectTitle,
  isOverdue,
  dateToday,
  today,
  shownTaskSignal,
  toggleTaskDoneStatus,
  handleChangeDueDate,
}: TaskListItemProps) => {
  return (
    <div
      id={`task-item-${task.task_id}`}
      class={`
        ${index % 2 == 0 ? "bg-[#e0fffd]" : ""}
        ${task.is_done ? "bg-pink-200 opacity-60" : ""}
        flex flex-wrap sm:flex-nowrap items-start px-3 sm:px-4 md:px-6 py-3 sm:py-4 min-h-25
        hover:${index % 2 == 0 ? "bg-[#e0fffd]" : "bg-white"} hover:opacity-100
        cursor-pointer
      `}
      onClick={() => {
        shownTaskSignal.value = {
          task_id: task.task_id,
          task_title: task.task_title,
          task_desc: task.task_desc,
          task_priority: task.priority,
          task_due_date: task.due_date,
          task_is_done: task.is_done,
          task_done_date: task.done_date,
          project_title: projectTitle,
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
        <div class="text-xs sm:text-base font-semibold text-[#828a99] flex flex-wrap sm:flex-row items-center gap-x-2 gap-y-1 group-hover:text-gray-500">
          Due: {formattingDateTask(task.due_date)}
          {isOverdue && (
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

      <div class="mt-2 sm:mt-0 pl-6 sm:pl-0 sm:ml-4 flex w-full sm:w-3/10 items-center justify-start sm:justify-end text-left sm:text-right text-sm sm:text-lg font-semibold text-gray-600 shrink-0 wrap-break-words">
        {projectTitle}
      </div>
    </div>
  );
};

function loadPrevData(key: string): string {
  const stored = localStorage.getItem(key);
  if (stored !== null) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(`Error parsing ${key}`, e);
    }
  }

  const randomNum = Math.random() >= 0.5;

  if (key === "filterDropdown") return randomNum ? String(randomNum) : "";
  if (key === "homeTaskList") return "dueToday";

  return "";
}

export function TaskDisplay({
  tasks,
  taskFilters,
  projectObj,
  setProjects,
  setErrorMessage,
  isDemo,
}: TasksProps) {
  const defaultTaskList = useSignal(loadPrevData("homeTaskList"));
  useSignalEffect(() => {
    // Explicitly reading .value outside the condition forces Preact to track it
    const currentTaskList = defaultTaskList.value;
    localStorage.setItem("homeTaskList", JSON.stringify(currentTaskList));
  });

  const showFilterDropdown = useSignal(Boolean(loadPrevData("filterDropdown")));
  useSignalEffect(() => {
    // Explicitly reading .value outside the condition forces Preact to track it
    const currentDropdown = showFilterDropdown.value;
    localStorage.setItem("filterDropdown", JSON.stringify(currentDropdown));
  });

  // Helper function to load initial sorter
  const getInitialSortCategory = () => {
    const storedSorter = localStorage.getItem("taskSorter");
    if (storedSorter) {
      try {
        return JSON.parse(storedSorter);
      } catch (e) {
        console.error("Failed to parse stored task sorter from LocalStorage", e);
      }
    }
    return TaskSorter.Skip;
  };

  const sortCategory: Signal<SortValue> = useSignal(getInitialSortCategory());

  // Sync back to Local Storage whenever sortCategory changes
  useSignalEffect(() => {
    localStorage.setItem("taskSorter", JSON.stringify(sortCategory.value));
  });

  const sortFunctions = useMemo(
    () => ({
      [TaskSorter.DueDateAsc]: (a: Task, b: Task) => {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      },
      [TaskSorter.DueDateDesc]: (a: Task, b: Task) => {
        return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
      },
      [TaskSorter.DoneDateAsc]: (a: Task, b: Task) => {
        return (
          new Date(a.done_date).getTime() - new Date(b.done_date).getTime()
        );
      },
      [TaskSorter.DoneDateDesc]: (a: Task, b: Task) => {
        return (
          new Date(b.done_date).getTime() - new Date(a.done_date).getTime()
        );
      },
      [TaskSorter.Priority]: (a: Task, b: Task) => {
        return Number(b.priority) - Number(a.priority);
      },
    }),
    []
  );

  // Derived state - automatically updates when tasks or filters change
  const shownTasks = useComputed(() => {
    if (!tasks.value) return [];

    let result = filterTasks(tasks.value, taskFilters.value, todayUserTimeZone());

    if (!sortCategory.value) return result;
    return [...result].sort(sortFunctions[sortCategory.value]);
  });

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
        setProjects(projectId, checked);
        setTasks(taskId, checked);
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
        setProjects(projectId, checked);
        setTasks(taskId, checked);
      }
      if (!data.success) setErrorMessage("There's an error in the server");
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

  const handleChangeDueDate = async (e: Event) => {
    e.preventDefault();
    try {
      const target = e.target as HTMLFormElement;
      const inputElement = target.elements[0] as HTMLInputElement;

      const taskId = parseInt(inputElement.name.split("-")[1]);
      const due_date = inputElement.value;

      // Handle demo mode early and exit
      if (isDemo) {
        updateTasksDueDate(taskId, due_date);
        // Exit
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
      if (!data.success) setErrorMessage("There's an error in the server");
    } catch (error) {
      console.log(error);
      setErrorMessage("There's an error in the server");
    }
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useSignalEffect(() => {
    // TODO:: sortCategory.value is doneDateAsc | doneDateDesc no need to scroll
    // to the first not done task. Add this TODO: to dhara so we can track what
    // we do

    const firstIncomplete = shownTasks.value.find(task => !task.is_done);

    if (firstIncomplete) {
      const targetId = `task-item-${firstIncomplete.task_id}`;

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

  const showCalendar = useSignal(false);
  const shownTask: Signal<TasksWithProject | null> = useSignal(null);

  return (
    <div class="mx-auto flex flex-col items-center px-1 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="w-full md:px-4 lg:px-0 xl:w-6xl">
        <div
          class={`${showFilterDropdown.value ? "mb-0" : "mb-2"} mt-5 flex flex-col items-center md:flex-row md:justify-between`}
        >
          <div class="flex flex-col">
            <h2 class="mb-2 w-screen justify-center sm:w-fit flex flex-row items-center text-center text-base md:text-xl font-medium text-gray-700 md:mb-0">
              <span
                onClick={() => (showCalendar.value = !showCalendar.value)}
                class="cursor-pointer text-xl group relative"
              >
                <img src="/static/images/calendar.svg" alt="" class="h-4 w-4 mr-2 fill-background" />
                <span class="hidden font-normal bg-background text-nowrap text-white absolute text-base py-1 px-2 left-5 group-hover:block">
                  Click to show calendar
                </span>
              </span>
              Task List&nbsp;
              {taskFilters.value.selectedProject == ALL ? (
                <div class="flex items-center font-normal text-hover text-base md:text-xl">
                  (
                  <span
                    onClick={() => {
                      defaultTaskList.value = "dueToday";
                      taskFilters.value = {
                        selectedProject: ALL,
                        priority: ALL,
                        status: ALL,
                        time: TaskFiltersTime.Today,
                      };
                    }}
                    class={`${defaultTaskList.value === "dueToday"
                      && taskFilters.value.time === TaskFiltersTime.Today
                      ? "font-extrabold text-base md:text-xl"
                      : "font-normal text-base md:text-lg"
                      } cursor-pointer text-background hover:underline`}
                  >
                    Due Today
                  </span>
                  /
                  <span
                    onClick={() => {
                      defaultTaskList.value = "allTasks";
                      taskFilters.value = {
                        selectedProject: ALL,
                        priority: ALL,
                        status: ALL,
                        time: ALL,
                      };
                    }}
                    class={`${defaultTaskList.value === "allTasks"
                      ? "font-extrabold text-base md:text-xl"
                      : "font-normal text-base md:text-lg"
                      } cursor-pointer text-background hover:underline`}
                  >
                    All Tasks
                  </span>
                  )
                </div>
              ) : (
                <span
                  onClick={() => {
                    defaultTaskList.value == "allTasks"
                      ? (taskFilters.value = {
                        selectedProject: ALL,
                        priority: ALL,
                        status: ALL,
                        time: ALL,
                      })
                      : (taskFilters.value = {
                        selectedProject: ALL,
                        priority: ALL,
                        status: ALL,
                        time: TaskFiltersTime.Today,
                      });
                  }}
                  class="cursor-pointer text-base md:text-xl text-background"
                >
                  (&#x2715;
                  {projectObj.value[Number(taskFilters.value.selectedProject)]
                    ? projectObj.value[Number(taskFilters.value.selectedProject)]
                    : taskFilters.value.selectedProject}
                  )
                </span>
              )}
            </h2>
          </div>

          <div class="mb-2 flex flex-row flex-wrap items-center justify-center gap-2 md:mb-0 md:gap-0">
            <button
              onClick={() =>
                (showFilterDropdown.value = !showFilterDropdown.value)
              }
              class="flex w-32 cursor-pointer flex-row items-center justify-center text-center text-[15px] hover:underline sm:w-35 sm:text-base md:mr-5 md:w-30"
            >
              <img src="/static/images/filter2.png" alt="" class="h-4 w-4" />
              <span class="w-full px-2 py-2 text-center text-ellipsis text-nowrap sm:py-3">
                &nbsp;Filters
              </span>
            </button>
            <div class="flex w-32 cursor-pointer flex-row items-center justify-center text-center text-[15px] hover:underline sm:w-35 sm:text-base md:mr-5 md:w-30">
              <img src="/static/images/sort.png" alt="" class="h-4 w-2.5 sm:h-5 sm:w-3" />
              <select
                onChange={(e) =>
                  (sortCategory.value = e.currentTarget.value as SortValue)
                }
                value={sortCategory.value}
                id="tasksSorterPriority"
                name="tasksSorterPriority"
                class="w-full px-2 py-2 text-center text-ellipsis text-nowrap text-sm sm:py-3 sm:text-base md:w-35"
                aria-label="Sort tasks by"
              >
                <option value={TaskSorter.Skip} disabled selected>
                  Sort by
                </option>
                <option value={TaskSorter.DueDateAsc}>
                  Due Date &#8599;
                </option>
                <option value={TaskSorter.DueDateDesc}>
                  Due Date &#8600;
                </option>
                <option value={TaskSorter.DoneDateAsc}>
                  Done Date &#8599;
                </option>
                <option value={TaskSorter.DoneDateDesc}>
                  Done Date &#8600;
                </option>
                <option value={TaskSorter.Priority}>Priority</option>
              </select>
            </div>
          </div>
        </div>

        {showFilterDropdown.value && (
          <div class="mb-4 sm:mb-0 flex w-full flex-row justify-center items-center md:justify-end">
            <div class="flex w-1/3 cursor-pointer flex-col items-center justify-center text-[15px] sm:text-base sm:w-30">
              <label class="text-nowrap text-ellipsis">Priority</label>
              <select
                onChange={(e) =>
                (taskFilters.value = {
                  ...taskFilters.value,
                  priority: e.currentTarget.value as TaskPriorityValue,
                })
                }
                value={taskFilters.value.priority}
                id="tasksFilterPriority"
                name="tasksFilterPriority"
                class="border-border w-full rounded-sm border px-2 py-3 text-center text-nowrap text-ellipsis"
              >
                <option value={TaskFiltersPriority.Priority}>
                  Priority only
                </option>
                <option value={TaskFiltersPriority.ALL} selected>
                  All
                </option>
              </select>
            </div>
            <div class="flex w-1/3 cursor-pointer flex-col items-center justify-center text-[15px] sm:text-base sm:w-30">
              <label class="text-nowrap text-ellipsis">Status</label>
              <select
                onChange={(e) =>
                (taskFilters.value = {
                  ...taskFilters.value,
                  status: e.currentTarget.value as TaskStatusValue,
                })
                }
                value={taskFilters.value.status}
                id="tasksFilterStatus"
                name="tasksFilterStatus"
                class="border-border w-full rounded-sm border px-2 py-3 text-center text-nowrap text-ellipsis"
              >
                <option value={TaskFiltersStatus.ALL} selected>
                  All
                </option>
                <option value={TaskFiltersStatus.Unfinished}>Unfinished</option>
                <option value={TaskFiltersStatus.Finished}>Finished</option>
                <option value={TaskFiltersStatus.Overdue}>Overdue</option>
              </select>
            </div>
            <div class="flex w-1/3 cursor-pointer flex-col items-center justify-center text-[15px] sm:text-base sm:w-30">
              <label class="text-nowrap text-ellipsis">Time Range</label>
              <select
                onChange={(e) =>
                (taskFilters.value = {
                  ...taskFilters.value,
                  time: e.currentTarget.value as TaskTimeValue,
                })
                }
                value={taskFilters.value.time}
                id="tasksFilterTime"
                name="tasksFilterTime"
                class="border-border w-full rounded-sm border px-2 py-3 text-center text-nowrap text-ellipsis"
              >
                <option value={TaskFiltersTime.Today} selected>
                  Today
                </option>
                <option value={TaskFiltersTime.ThisWeek}>This Week</option>
                <option value={TaskFiltersTime.SevenDays}>Next 7 Days</option>
                <option value={TaskFiltersTime.ThisMonth}>This Month</option>
                <option value={TaskFiltersTime.ThirtyDays}>Next 30 Days</option>
                <option value={TaskFiltersTime.ThisQuarter}>
                  This Quarter
                </option>
                <option value={TaskFiltersTime.ALL}>All</option>
              </select>
            </div>
          </div>
        )}

        <div
          class={`${showCalendar.value ? "mb-0" : "mb-5"} m-auto md:mx-0 text-background w-fit`}
        >
          Showing {shownTasks.value.length} tasks
        </div>

        {showCalendar.value && (
          <Calendar
            tasks={tasks}
            shownTasks={shownTasks}
            taskFilters={taskFilters}
          />
        )}

        <div class="overflow-hidden rounded-lg bg-white shadow">
          <div
            ref={scrollContainerRef}
            class="max-h-[calc(100vh-100px)] divide-y divide-gray-200 overflow-y-auto bg-white"
          >
            {shownTasks.value.length > 0 && shownTasks.value.map((task, i) => (
              <TaskListItem
                key={`task-${task.task_id}`}
                task={task}
                index={i}
                projectTitle={projectObj.value[task.project_id]}
                isOverdue={!task.is_done && new Date(task.due_date) < dateToday}
                dateToday={dateToday}
                today={today}
                shownTaskSignal={shownTask}
                toggleTaskDoneStatus={toggleTaskDoneStatus}
                handleChangeDueDate={handleChangeDueDate}
              />
            ))}
          </div>
        </div>
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
