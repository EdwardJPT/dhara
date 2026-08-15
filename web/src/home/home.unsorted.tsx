import { Signal, useComputed, useSignal } from "@preact/signals";

import { todayUserTimeZone } from "../components/constants"
import { Project, Task, UnsortedTask } from "./types";
import { convertToTask } from "./utils";

interface UnsortedProps {
  unsorteds: Signal<UnsortedTask[]>;
  showUnsorted: Signal<boolean>;
  projects: Signal<Project[]>;
  tasks: Signal<Task[]>;
  setErrorMessage: (message: string) => string;
  isDemo: boolean;
}

const today = todayUserTimeZone();

interface UnsortedTaskCardProps {
  unsorted: UnsortedTask;
  index: number;
  idsToDelete: Signal<number[]>;
  showDeleteButton: { [key: number]: boolean };
  projects: Signal<Project[]>;
  toggleUnsortedDoneStatus: (checked: boolean, unsorted_id: number) => Promise<void>;
  handleDelete: (unsorted_id: number) => Promise<void>;
  handleAssignProject: (e: Event) => Promise<void>;
}

const UnsortedTaskCard = ({
  unsorted,
  index,
  idsToDelete,
  showDeleteButton,
  projects,
  toggleUnsortedDoneStatus,
  handleDelete,
  handleAssignProject,
}: UnsortedTaskCardProps) => {
  return (
    <div
      class={`${index % 2 === 0 ? 'bg-[#cbfdfa]' : 'bg-white'} flex flex-col items-start p-4 rounded-lg shadow-sm mb-4 border border-teal-100`}
    >
      <div class="flex flex-row w-full">
        <div class="flex flex-col h-full justify-center mr-2 mt-1">
          <input
            type="checkbox"
            checked={unsorted.is_done}
            onClick={(e: Event) => {
              const target = e.target as HTMLInputElement;
              toggleUnsortedDoneStatus(target.checked, unsorted.unsorted_id);
            }}
            class="w-5 h-5 text-teal-600 mb-2 rounded focus:ring-teal-500 border-teal-300"
          />
          {unsorted.priority &&
            <p class="group relative font-bold text-xl flex justify-center">
              ! <span class="hidden font-normal bg-background text-white absolute text-base py-1 px-2 left-5 group-hover:block">Priority</span>
            </p>
          }
        </div>
        <div class="flex flex-col sm:flex-row justify-between w-full">
          <div class="flex-1 min-w-0">
            <h4 class="text-lg font-bold text-slate-800 mb-1">
              {unsorted.unsorted_title}
            </h4>
            <p class="text-slate-900 text-base mb-2 md:mb-0">
              {unsorted.unsorted_desc}
            </p>
          </div>
          <div class="flex flex-col justify-center text-right text-gray-500 font-semibold text-sm min-w-30">
            <span class="mt-1">
              {unsorted.due_date ? (
                <span>
                  Due date: {unsorted.due_date}
                </span>
              ) : (
                <span class="text-slate-800 italic">No due date</span>
              )}
            </span>
            <span>Created at: {unsorted.created_at.slice(0, 10)}</span>
          </div>
        </div>
      </div>
      <form
        id={`assignUnsortedToProject-${unsorted.unsorted_id}`}
        onSubmit={handleAssignProject}
        class="flex flex-row w-full mt-2 sm:mt-0"
      >
        <div class="w-5 mr-2 relative flex justify-center items-center">
          <img
            onClick={() => {
              const id = unsorted.unsorted_id;
              const isSelected = idsToDelete.value.includes(id);
              idsToDelete.value = isSelected
                ? idsToDelete.value.filter(existingId => existingId !== id)
                : [...idsToDelete.value, id];
            }}
            src="/static/images/bin.svg"
            alt="delete button"
            class="h-4 w-4 cursor-pointer"
          />
          {showDeleteButton[unsorted.unsorted_id] && (
            <span class="absolute cursor-text top-8 left-0.5 w-fit whitespace-nowrap bg-background text-white p-2 flex items-center">
              Delete this unsorted tasks?
              <span
                class="ml-2 text-xl cursor-pointer hover:bg-hover px-1"
                onClick={() => handleDelete(unsorted.unsorted_id)}
              >
                &#x2713;
              </span>
            </span>
          )}
        </div>
        <select
          name="selected_project_for_unsorted"
          class="w-full cursor-pointer hover:bg-gray-50"
          required
        >
          <option value="">Select Project</option>
          <ProjectOptions projects={projects} />
        </select>
        <button class="text-2xl cursor-pointer hover:bg-background hover:text-white">
          &#x2713;
        </button>
      </form>
    </div>
  );
};

export function UnsortedDisplay({
  unsorteds,
  showUnsorted,
  projects,
  tasks,
  setErrorMessage,
  isDemo,
}: UnsortedProps) {
  // Controller to show the delete button of unsorted tasks
  const idsToDelete: Signal<number[]> = useSignal([]);
  const showDeleteButton = useComputed(() => {
    const showState: { [key: number]: boolean } = {};
    if (!unsorteds.value) return showState;
    const allIds = unsorteds.value.map(item => item.unsorted_id);
    // If the id is exist on idsToDelete, then change its value to true
    allIds.forEach(id => {
      if (idsToDelete.value.includes(id)) showState[id] = true;
      else showState[id] = false;
    });
    return showState;
  });

  const handleSubmit = async (e: Event) => {
    try {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const user_id = unsorteds.value?.[0]?.user_id;

      // Handle demo mode early and exit
      if (isDemo) {
        unsorteds.value = [{
          unsorted_id: Date.now(), // Generate a mock ID
          user_id,
          unsorted_title: data.unsorted_title as string,
          unsorted_desc: data.unsorted_desc as string,
          priority: data.priority === "on",
          is_done: false,
          done_date: 0,
          due_date: data.unsorted_due_date as string,
          created_at: new Date().toISOString(),
        }, ...(unsorteds.value || [])];

        // reset the form
        const form = document.getElementById("newUnsorted")! as HTMLFormElement;
        form.reset();
        // Exit
        return;
      }

      const response = await fetch("/unsorted-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.redirected) {
        window.location.replace(response.url);
      }
      const resp = await response.json();

      if (resp.success) {
        // update the list of unsorted task
        unsorteds.value = [{
          unsorted_id: resp.data.unsorted_id,
          user_id,
          unsorted_title: data.unsorted_title as string,
          unsorted_desc: data.unsorted_desc as string,
          priority: data.priority === "on",
          is_done: false,
          done_date: 0,
          due_date: data.unsorted_due_date as string,
          created_at: new Date().toISOString(),
        }, ...unsorteds.value];
        // reset the form
        const form = document.getElementById("newUnsorted")! as HTMLFormElement;
        form.reset();
      }
      if (!resp.success) setErrorMessage("There's an error in the server");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (unsorted_id: number) => {
    try {
      // Handle demo mode early and exit
      if (isDemo) {
        unsorteds.value = unsorteds.value.filter(unsorted =>
          unsorted.unsorted_id !== unsorted_id
        );
        // Exit
        return;
      }

      const response = await fetch(`/unsorted-task/${unsorted_id}`, { method: "DELETE" });
      if (response.redirected) {
        window.location.replace(response.url);
      }
      const resp = await response.json();
      if (resp.success && resp.data.unsorted_id == unsorted_id) {
        unsorteds.value = unsorteds.value.filter(unsorted =>
          unsorted.unsorted_id !== unsorted_id
        );
      }
      if (!resp.success) setErrorMessage(resp.message);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleUnsortedDoneStatus = async (checked: boolean, unsorted_id: number) => {
    try {
      // Handle demo mode early and exit
      if (isDemo) {
        unsorteds.value = unsorteds.value?.map(unsorted => {
          if (unsorted.unsorted_id == unsorted_id) {
            return { ...unsorted, is_done: checked };
          }
          return unsorted;
        });
        return;
      }

      const response = await fetch(`/unsorted-task/${unsorted_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checked, unsorted_id }),
      });
      // if cookie failed
      if (response.redirected) {
        window.location.replace(response.url);
      }
      const resp = await response.json();
      // if success, update the the shown tasks and projects
      if (resp.success) {
        unsorteds.value = unsorteds.value?.map(unsorted => {
          if (unsorted.unsorted_id == unsorted_id) {
            return { ...unsorted, is_done: checked };
          }
          return unsorted;
        });
      }
      if (!resp.success) setErrorMessage(resp.message);
    } catch (error) {
      console.log(error);
    }
  }

  const handleAssignProject = async (e: Event) => {
    try {
      e.preventDefault();
      const target = e.target as HTMLFormElement;
      const formId = target.id;
      const unsorted_id = formId.split("-")[1];
      const selectElement = target.elements[0] as HTMLSelectElement;
      const project_id = selectElement.tagName === "SELECT" ? selectElement.value : "";

      // Handle demo mode early and exit
      if (isDemo) {
        const len = unsorteds.value.length;
        let unsorted = {} as UnsortedTask;
        for (let i = 0; i < len; i++) {
          if (unsorteds.value[i].unsorted_id == Number(unsorted_id)) {
            unsorted = unsorteds.value[i];
            console.log({ unsorted });
          }
        }
        const newTask = convertToTask(unsorted, Number(project_id), Number(unsorted_id));
        // Move it to the shown taks
        tasks.value = [newTask, ...tasks.value];
        // Move it to the project's tasks
        projects.value = projects.value?.map(project => {
          if (project.project_id === newTask.project_id) {
            return {
              ...project,
              to_dos_all: project.to_dos_all + 1,
              to_dos_done: project.to_dos_done + Number(newTask.is_done),
            };
          }
          return project;
        });
        // parse unsorted_id to number for comparison
        const unsortedIdNum = Number(unsorted_id);
        unsorteds.value = unsorteds.value?.filter(unsorted => unsorted.unsorted_id !== unsortedIdNum);
        // Exit
        return;
      }

      const response = await fetch(`/unsorted-task/${unsorted_id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unsorted_id, project_id }),
      });
      const resp = await response.json();
      if (resp.success) {
        const { task } = resp.data;
        // Move it to the shown taks
        tasks.value = [task, ...tasks.value];
        // Move it to the project's tasks
        projects.value = projects.value?.map(project => {
          if (project.project_id === task.project_id) {
            return {
              ...project,
              to_dos_all: project.to_dos_all + 1,
              to_dos_done: project.to_dos_done + task.is_done
            };
          }
          return project;
        });
        // parse unsorted_id to number for comparison
        const unsortedIdNum = Number(unsorted_id);
        // Remove it from unsorted tasks
        unsorteds.value = unsorteds.value?.filter(unsorted => unsorted.unsorted_id !== unsortedIdNum);
      }
      // If failed
      if (!resp.success) setErrorMessage(resp.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div class="fixed top-1/2 left-1/2 z-11 pb-5 md:pb-0 max-h-9/10 w-9/10 -translate-1/2 rounded-xl border border-background bg-white shadow-lg h-fit md:max-w-2xl">
      <div class="flex h-1/10 items-center justify-start rounded-t-xl bg-linear-to-r from-hover to-background p-5">
        <h2 class="text-2xl font-bold text-white">Unsorted Tasks</h2>
      </div>
      <span
        onClick={() => showUnsorted.value = false}
        class="absolute top-5 right-5 cursor-pointer text-2xl font-extrabold text-white"
      >
        &#x2715;
      </span>

      <form
        id="newUnsorted"
        onSubmit={handleSubmit}
        class="p-7.5 flex flex-col gap-3"
      >
        <div class="flex gap-3">
          <input
            type="text"
            id="taskTitle"
            placeholder="Task Title"
            required
            name="unsorted_title"
            style="flex: 2; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
          />
        </div>

        <textarea
          id="taskDesc"
          placeholder="Description"
          name="unsorted_desc"
          style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; resize: vertical; min-height: 60px;"
          required
        ></textarea>

        <div class="flex gap-4 items-center">
          <label class="flex items-center gap-1.5">
            <input
              type="checkbox"
              id="priority"
              name="priority"
              class="w-4 h-4"
            />
            <span>Priority?</span>
          </label>
          <input
            type="date"
            id="dueDate"
            name="unsorted_due_date"
            style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex: 1;"
            min={today}
            required
          />
          <button type="submit"
            style="background: #007bff; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">
            Add Task
          </button>
        </div>
      </form>

      <div class="w-9/10 mx-auto border-t border-gray-900"></div>

      <div class="max-h-100 p-7.5 overflow-y-auto">
        {unsorteds.value && unsorteds.value.map((unsorted, i) => (
          <UnsortedTaskCard
            key={unsorted.unsorted_id}
            unsorted={unsorted}
            index={i}
            idsToDelete={idsToDelete}
            showDeleteButton={showDeleteButton.value}
            projects={projects}
            toggleUnsortedDoneStatus={toggleUnsortedDoneStatus}
            handleDelete={handleDelete}
            handleAssignProject={handleAssignProject}
          />
        ))}
      </div>

    </div>
  );
}

const ProjectOptions = ({ projects }: { projects: Signal<Project[]> }) => {
  return projects.value
    ?.filter((project: Project) => !project.is_done)
    .map((project: Project) => (
      <option key={project.project_id} value={project.project_id}>
        {project.project_title}
      </option>
    ));
}
