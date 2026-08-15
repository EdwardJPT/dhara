import { useState } from "preact/hooks";
import { Signal } from "@preact/signals";

import { Project } from "./types";

import { todayUserTimeZone } from "../components/constants";

const today = todayUserTimeZone();

interface EditProjectFormProps {
  project: Project;
  isEditingProject: Signal<boolean>;
  countPriorityProjects: number;
  setErrorMessage: (message: string) => string;
  isDemo: boolean;
}

export function EditProjectForm({
  project,
  isEditingProject,
  countPriorityProjects,
  setErrorMessage,
  isDemo,
}: EditProjectFormProps) {
  const [formData, setFormData] = useState({
    project_id: project.project_id,
    project_title: project.project_title,
    project_desc: project.project_desc,
    priority: project.priority,
    start_date: project.start_date,
    due_date: project.due_date,
    is_done: project.is_done,
    done_date: project.done_date,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? parseInt(value) || 0
            : value,
    }));
  };

  const handleEditProject = async (e: any) => {
    e.preventDefault();

    try {
      // Convert string date to unix epoch
      const doneDate = new Date(formData.done_date).getTime();
      const unixDoneDate = Math.floor(doneDate / 1000);
      // Prepare data for saving
      const newData = {
        ...formData,
        // Handle date conversions
        start_date:
          formData.start_date || new Date().toISOString().split("T")[0],
        due_date: formData.due_date || "",
        done_date: formData.is_done && formData.done_date ? unixDoneDate : 0,
        // Ensure boolean fields are properly typed
        priority: !!formData.priority,
        is_done: !!formData.is_done,
      };

      // Handle demo mode early and exit
      if (isDemo) {
        // Update the main demo_projects list (our single source of truth)
        const storedProjectsStr = localStorage.getItem("demo_projects");
        if (storedProjectsStr) {
          try {
            const storedProjects = JSON.parse(storedProjectsStr);
            const updatedProjects = storedProjects.map((p: Project) =>
              p.project_id === project.project_id ? { ...p, ...newData } : p
            );
            localStorage.setItem("demo_projects", JSON.stringify(updatedProjects));
          } catch (err) {
            console.error("Error updating demo_projects in localStorage", err);
          }
        } else {
          // Fallback just in case they land here directly without visiting home
          localStorage.setItem("demo_projects", JSON.stringify([{ ...project, ...newData }]));
        }

        // Trigger the reload exactly like the backend version does
        window.location.reload();
        return;
      }

      // Send the request to the backend
      const response = await fetch(`/project/${project.public_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
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
      onSubmit={handleEditProject}
      class="fixed top-1/2 left-1/2 z-11 flex max-h-[95vh] w-[95%] -translate-1/2 flex-col rounded-xl border border-background bg-white shadow-lg sm:w-11/12 md:h-fit md:max-w-2xl"
    >
      <div class="flex shrink-0 items-center justify-start rounded-t-xl bg-linear-to-r from-hover to-background p-4 sm:p-5">
        <h2 class="text-xl sm:text-2xl font-bold text-white">Edit Project</h2>
      </div>
      <span
        class="absolute right-4 top-4 cursor-pointer text-xl font-extrabold leading-none text-white sm:right-5 sm:top-5 sm:text-2xl"
        onClick={() => (isEditingProject.value = false)}
      >
        &#x2715;
      </span>

      <div class="overflow-y-auto p-4 sm:p-6">
        <div class="grid grid-cols-1 gap-2">
          {/* Left Column */}
          <div class="mb-4">
            <label
              class="mb-2 block text-sm font-bold text-gray-700"
              for="project_title"
            >
              Project Title *
            </label>
            <input
              type="text"
              id="project_title"
              name="project_title"
              value={formData.project_title}
              onChange={handleChange}
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div class="mb-4">
            <label
              class="mb-2 block text-sm font-bold text-gray-700"
              for="project_desc"
            >
              Description
            </label>
            <textarea
              id="project_desc"
              name="project_desc"
              value={formData.project_desc}
              onChange={handleChange}
              rows={3}
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 rounded-md bg-gray-100 p-3 sm:p-4">
            <div>
              <label class="block text-sm sm:text-base font-medium text-gray-700">
                A priority project?
              </label>
              <p class="mt-1 text-xs sm:text-sm text-gray-500">
                Only allowed to have 3 priority projects.
              </p>
              <p class="mb-1 text-xs sm:text-sm text-gray-500">
                You already have {countPriorityProjects} priority projects.
              </p>
            </div>

            <div class="flex items-center">
              <span class="mr-2 text-xs sm:text-sm text-gray-500">No</span>
              <button
                onClick={() =>
                  setFormData((prevData) => ({
                    ...prevData,
                    priority:
                      countPriorityProjects - Number(project.priority) < 3 &&
                      !prevData.priority,
                  }))
                }
                type="button"
                id="priorityToggle"
                class={`relative inline-flex h-6 w-11 items-center rounded-full transition 
                    ${formData.priority ? "bg-background" : "bg-gray-200"}`}
              >
                <span
                  class={`inline-block h-4 w-4 transform rounded-full bg-white transition ease-in-out
                    ${formData.priority ? "translate-x-6" : "translate-x-1"}`}
                ></span>
              </button>
              <span class="ml-2 text-xs sm:text-sm text-gray-500">Yes</span>
            </div>
          </div>

          <div class="mt-2 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            <div class="mb-2 sm:mb-4">
              <label
                class="mb-2 block text-sm font-bold text-gray-700"
                for="start_date"
              >
                Start Date *
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div class="mb-4">
              <label
                class="mb-2 block text-sm font-bold text-gray-700"
                for="due_date"
              >
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                min={today}
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {project.to_dos_done < project.to_dos_all ? (
            <div class="mb-4">
              <label class="flex items-center cursor-pointer w-fit">
                <input
                  type="checkbox"
                  name="is_done"
                  checked={formData.is_done}
                  onChange={handleChange}
                  class="h-4 w-4 sm:h-5 sm:w-5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700">Mark as Completed</span>
              </label>
              {formData.is_done && (
                <div class="mt-3 sm:mt-4">
                  <label
                    class="mb-2 block text-sm font-bold text-gray-700"
                    for="done_date"
                  >
                    Completion Date
                  </label>
                  <input
                    type="date"
                    id="done_date"
                    name="done_date"
                    value={formData.done_date}
                    onChange={handleChange}
                    class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          ) : (
            <p class="font-bold text-background text-sm sm:text-lg">
              All tasks in this project are complete.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div class="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-0 sm:space-x-3">
          <button
            type="submit"
            class="w-full sm:w-auto rounded-md bg-blue-600 px-4 py-3 sm:py-2 text-sm sm:text-base text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}
