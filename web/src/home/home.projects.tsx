import { Fragment } from "preact";
import { useSignal, useComputed, Signal, useSignalEffect } from "@preact/signals";
import { useMemo } from "preact/hooks";

import type { Goal, GoalSettings, Project } from "./types.ts";

import { ProjectFilters, ProjectSorter } from "../constants"
import {
  formattingDateProject,
  todayUserTimeZone,
  nDaysAgo,
  nDaysLeft,
} from "../utils"

interface ProjectsProps {
  projects: Signal<Project[]>;
  displayState: ReturnType<typeof useProjectDisplay>;
  goals: Signal<Goal[]>;
  goalSettings: Signal<GoalSettings>;
  setSelectedProject: (projectId: number) => void;
  showUnsorted: Signal<boolean>;
  unfinishedUnsorted: Signal<number>;
  isDemo: boolean;
}

type FilterValue = typeof ProjectFilters[keyof typeof ProjectFilters];
type SortValue = typeof ProjectSorter[keyof typeof ProjectSorter];

interface ProjectCardProps {
  project: Project;
  setSelectedProject: (projectId: number) => void;
  isDemo: boolean;
}

export const ProjectCard = ({
  project,
  setSelectedProject,
  isDemo,
}: ProjectCardProps) => {
  return (
    <div
      onClick={() => setSelectedProject(project.project_id)}
      class={`${project.is_done ? 'bg-pink-300 opacity-50' : 'bg-white'} group flex h-64 min-w-0 cursor-pointer snap-start flex-col rounded-lg border-l-4 border-background p-4 shadow hover:bg-pink-50 sm:p-6`}
    >
      <div class="flex min-w-0 flex-col justify-start">
        <div class="mb-2 flex justify-between gap-2">
          <a
            // Check if isDemo is true to determine the link
            href={isDemo ? `/demo/project/${project.public_id}` : `/project/${project.public_id}`}
            target="_blank"
            class="block h-fit min-w-0 max-h-10 items-center overflow-y-auto text-lg font-semibold text-slate-600 wrap-anywhere hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {project.project_title}
          </a>
          {(project.priority || project.hide) && (
            <div class="my-auto flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
              {project.priority && (
                <span class="p-2 inline-flex max-h-6 w-fit shrink-0 items-center rounded-full bg-red-100 text-xs font-medium text-red-800">
                  Priority
                </span>
              )}
              {project.hide && (
                <span
                  title="Hidden from Home and Reports"
                  class="p-2 inline-flex max-h-6 w-fit shrink-0 items-center rounded-full bg-slate-100 text-xs font-medium text-slate-600"
                >
                  Hidden
                </span>
              )}
            </div>
          )}
        </div>

        <div class="max-h-25 overflow-y-auto">
          <p class="h-25 min-h-20 text-base text-ellipsis text-gray-700 wrap-anywhere">
            {project.project_desc}
          </p>
        </div>
      </div>

      <div class="hidden flex-row flex-wrap items-center justify-between gap-x-2 pt-1 group-hover:flex">
        <p class="text-sm text-gray-500 font-medium">
          Start: {formattingDateProject(project.start_date)}
        </p>
        <p class="flex flex-row items-center text-sm text-hover">
          <img src="/static/images/clock.svg" alt="clock icon" class="h-3 w-3" />&nbsp;
          {nDaysAgo(project.start_date)}
        </p>
      </div>
      {project.done_date ?
        <div class="flex flex-wrap items-center justify-between gap-x-2 py-2 group-hover:py-0">
          <p class="bg-white text-sm font-extrabold text-gray-800 no-underline opacity-100">
            DONE : {formattingDateProject(new Date(project.done_date * 1000).toLocaleDateString("en-CA"))}
          </p>
        </div>
        :
        <div class="flex flex-wrap items-center justify-between gap-x-2 py-2 group-hover:py-0">
          <p class="text-sm text-gray-500 font-medium">
            Due : {formattingDateProject(project.due_date)}
          </p>
          <p class="flex flex-row items-center text-sm text-hover">
            <img src="/static/images/clock.svg" alt="clock icon" class="h-3 w-3" />&nbsp;
            {nDaysLeft(project.due_date)}
          </p>
        </div>
      }
      <div class="flex items-center">
        <div class="mr-2 h-2 w-full bg-slate-200">
          <div class="h-full bg-linear-to-r from-blue-400 to-blue-700" style={{ width: `calc(100% * ${project.to_dos_done} / ${project.to_dos_all})` }}>
          </div>
        </div>
        <span class="shrink-0 text-sm font-medium text-gray-500">
          {project.to_dos_done}/{project.to_dos_all}
        </span>
      </div>
    </div>
  );
};

export function useProjectDisplay(
  projects: Signal<Project[]>,
  goals: Signal<Goal[]>,
  goalSettings: Signal<GoalSettings>,
) {
  // Arrays of projects ids after we manually sorted it with drag and drop
  const getProjectsOrder = (): number[] => {
    const storedFilter = localStorage.getItem("projectsOrder");
    if (storedFilter) {
      try {
        return JSON.parse(storedFilter);
      } catch (e) {
        console.error("No stored projectsOrder from LocalStorage", e);
      }
    }
    return [];
  };
  const projectsIdsOrder = useSignal<number[]>(getProjectsOrder())
  // Sync back to Local Storage whenever projectsIdsOrder.value changes
  useSignalEffect(() => {
    localStorage.setItem("projectsOrder", JSON.stringify(projectsIdsOrder.value));
  });

  // Helper function to load the initial projects filter
  const getInitialProjectFilter = (): FilterValue => {
    const storedFilter = localStorage.getItem("projectFilter");
    if (storedFilter) {
      try {
        return JSON.parse(storedFilter);
      } catch (e) {
        console.error("No stored projectFilter from LocalStorage", e);
      }
    }
    return ProjectFilters.ALL;
  };
  const projectFilter: Signal<FilterValue> = useSignal(getInitialProjectFilter());
  // Sync back to Local Storage whenever projectFilter.value changes
  useSignalEffect(() => {
    localStorage.setItem("projectFilter", JSON.stringify(projectFilter.value));
  });

  // Helper function to load the initial projects sorter
  const getInitialProjectSorter = (): SortValue => {
    const storedSorter = localStorage.getItem("projectSorter");
    if (storedSorter) {
      try {
        return JSON.parse(storedSorter);
      } catch (e) {
        console.error("No stored projectSorter from LocalStorage", e);
      }
    }
    return ProjectSorter.Skip;
  };
  const projectSorter: Signal<SortValue> = useSignal(getInitialProjectSorter());
  useSignalEffect(() => {
    localStorage.setItem("projectSorter", JSON.stringify(projectSorter.value));
  });
  const sortFunctions = useMemo(() => ({
    [ProjectSorter.DueDateAsc]: (a: Project, b: Project) => {
      return ((new Date(a.due_date)).getTime() || 0) - ((new Date(b.due_date)).getTime() || 0);
    },
    [ProjectSorter.DueDateDesc]: (a: Project, b: Project) => {
      return ((new Date(b.due_date)).getTime() || 0) - ((new Date(a.due_date)).getTime() || 0);
    },
    [ProjectSorter.DoneDateAsc]: (a: Project, b: Project) => {
      return a.done_date - b.done_date;
    },
    [ProjectSorter.DoneDateDesc]: (a: Project, b: Project) => {
      return b.done_date - a.done_date;
    },
    [ProjectSorter.StartDateAsc]: (a: Project, b: Project) => {
      return ((new Date(a.start_date)).getTime() || 0) - ((new Date(b.start_date)).getTime() || 0);
    },
    [ProjectSorter.StartDateDesc]: (a: Project, b: Project) => {
      return ((new Date(b.start_date)).getTime() || 0) - ((new Date(a.start_date)).getTime() || 0);
    },
    [ProjectSorter.CompletionAsc]: (a: Project, b: Project) => {
      return (a.to_dos_done / (a.to_dos_all || 1)) - (b.to_dos_done / (b.to_dos_all || 1));
    },
    [ProjectSorter.CompletionDesc]: (a: Project, b: Project) => {
      return (b.to_dos_done / (b.to_dos_all || 1)) - (a.to_dos_done / (a.to_dos_all || 1));
    },
    [ProjectSorter.Priority]: (a: Project, b: Project) => {
      return Number(b.priority) - Number(a.priority);
    },
  }), []);

  const shownProjects = useComputed(() => {
    let result = projects.value.filter(project => !project.hide);

    // filter by the selected goal while Goals is enabled.
    if (goalSettings.value.showGoals && goalSettings.value.selectedGoal !== "all") {
      const goal = goals.value.find(goal => String(goal.goal_id) === goalSettings.value.selectedGoal);
      if (goal) {
        try {
          const projectIds = JSON.parse(goal.project_ids);
          result = Array.isArray(projectIds)
            ? result.filter(project => projectIds.includes(project.project_id))
            : [];
        } catch (e) {
          console.error("Error parsing goal project IDs", e);
          result = [];
        }
      }
    }

    // filter based on finish status
    if (projectFilter.value !== ProjectFilters.ALL) {
      if (projectFilter.value === ProjectFilters.Unfinished) {
        result = result.filter(p => !p.is_done)
      }
      if (projectFilter.value === ProjectFilters.Finished) {
        result = result.filter(p => p.is_done)
      }
      if (projectFilter.value === ProjectFilters.Overdue) {
        const today = todayUserTimeZone();
        result = result.filter(p => !p.is_done && new Date(today) > new Date(p.due_date))
      }
    }

    // when the projects is after sorted manually with drag and drop
    if (projectSorter.value === ProjectSorter.Skip) {
      const projectMap = new Map(result.map(p => [p.project_id, p]));

      return projectsIdsOrder.value.length !== 0
        ? projectsIdsOrder.value
          .map(id => projectMap.get(id))
          .filter((p): p is Project => p !== undefined)
        : result;
    }

    // sort the projects
    if (!projectSorter.value) return result;
    return [...result].sort(sortFunctions[projectSorter.value]);
  });

  return { shownProjects, projectFilter, projectSorter, projectsIdsOrder };
}

export function ProjectsDisplay({
  projects,
  displayState,
  goals,
  goalSettings,
  setSelectedProject,
  showUnsorted,
  unfinishedUnsorted,
  isDemo,
}: ProjectsProps) {
  // to show + New Project, Unsorted, Filters, and Sort By buttons on small screen
  const showFilter = useSignal(false);
  // to control how big is the div that showing the projects, either only show
  // 1 row, or 2 rows
  const isViewMore = useSignal(false);

  const { shownProjects, projectFilter, projectSorter, projectsIdsOrder } = displayState;

  // Drag and drop state
  const draggedItemIndex = useSignal<number | null>(null);
  const dragOriginalList = useSignal<Project[] | null>(null);
  const isDroppedSuccessfully = useSignal(false);

  const handleDragStart = (e: DragEvent, index: number) => {
    draggedItemIndex.value = index;
    dragOriginalList.value = [...projects.value]; // Backup in case of cancel/drop outside
    isDroppedSuccessfully.value = false;

    // Immediately switch to manual sort so the live reordering isn't blocked by math
    if (projectSorter.value !== ProjectSorter.Skip) {
      projectSorter.value = ProjectSorter.Skip;
    }

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragEnter = (e: DragEvent, index: number) => {
    e.preventDefault();
    const dragIndex = draggedItemIndex.value;

    // Ignore if not dragging, or if entering the space we are already in
    if (dragIndex === null || dragIndex === index) return;

    // Identify the exact projects
    const currentShown = shownProjects.value;
    const draggedProject = currentShown[dragIndex];
    const targetProject = currentShown[index];

    const newList = [...projects.value];
    const origDragIndex = newList.findIndex(
      p => p.project_id === draggedProject.project_id
    );
    const origDropIndex = newList.findIndex(
      p => p.project_id === targetProject.project_id
    );

    // Live-swap the items in the main array
    if (origDragIndex !== -1 && origDropIndex !== -1) {
      const [removed] = newList.splice(origDragIndex, 1);
      newList.splice(origDropIndex, 0, removed);

      projects.value = newList; // Triggers UI reflow, items will shift!
      draggedItemIndex.value = index; // Update our drag index to the new position
      projectsIdsOrder.value = newList.map((project) => project.project_id);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault(); // Required by browser to allow dropping
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    isDroppedSuccessfully.value = true;
  };

  const handleDragEnd = () => {
    // If dropped outside a valid zone, revert to the original order
    if (!isDroppedSuccessfully.value && dragOriginalList.value) {
      projects.value = dragOriginalList.value;
    }

    draggedItemIndex.value = null;
    dragOriginalList.value = null;
    isDroppedSuccessfully.value = false;
  };

  return (
    <>
      <div class="mb-0 flex flex-col items-center justify-around gap-x-5 md:mb-6 md:flex-row md:flex-wrap md:justify-between">
        {(shownProjects.value.length > 0) && (
          <div
            onClick={() => showFilter.value = !showFilter.value}
            class={`${showFilter.value ? '' : 'mb-6'} mt-2.5 mb-4 flex min-h-11 cursor-pointer flex-row items-center px-3 sm:hidden`}
          >
            {showFilter.value ? 'Collapse ⌃' : 'Expand ⌄'}
          </div>
        )}

        <div
          class={`${showFilter.value || !shownProjects.value.length ? '' : 'hidden'} mb-5 flex w-full min-w-0 flex-col flex-wrap gap-2 min-[375px]:flex-row min-[375px]:items-center sm:flex md:mb-0 md:w-auto md:flex-1 md:justify-start`}
        >
          <button
            hx-get={`${isDemo ? "/demo" : ""}/home/create-project-form`} hx-target="#form-container" hx-swap="innerHTML"
            class="flex h-11 min-w-0 cursor-pointer items-center justify-center rounded-xl bg-background p-1.25 text-center text-base font-semibold whitespace-nowrap text-white hover:bg-hover min-[375px]:flex-auto md:mr-0 md:min-w-35 md:flex-none md:px-2.5 md:py-1.5"
          >
            + New Project
          </button>
          <button
            onClick={() => showUnsorted.value = true}
            class="flex h-11 min-w-0 cursor-pointer items-center justify-center rounded-xl bg-background p-1.25 text-center text-base font-semibold whitespace-nowrap text-white hover:bg-hover min-[375px]:flex-auto md:flex-none md:px-2.5 md:py-1.5"
          >
            <img src="/static/images/list.svg" alt="list of unsorted tasks" class="h-3.5 w-3.5" />&nbsp;Unsorted ({unfinishedUnsorted.value})
          </button>
          {goals.value.length > 0 && (
            <>
              <label
                for="show-goals"
                class="group goals-toggle order-0 inline-flex h-11 shrink-0 cursor-pointer items-center gap-0.5 rounded-xl border border-gray-200 bg-white px-2 text-base font-normal text-gray-600 transition-colors hover:bg-background hover:text-white hover:font-semibold focus-within:ring-background sm:order-1"
              >
                <input
                  id="show-goals"
                  type="checkbox"
                  role="switch"
                  class="sr-only"
                  checked={goalSettings.value.showGoals}
                  aria-controls="goal-options"
                  onChange={e => goalSettings.value = {
                    ...goalSettings.value,
                    showGoals: e.currentTarget.checked,
                  }}
                />
                Goals
                <span
                  aria-hidden="true"
                  class={`toggle-track flex h-5 w-7 items-center rounded-full p-0.5 transition-colors ${goalSettings.value.showGoals ? 'bg-background' : 'bg-gray-300'} group-hover:bg-hover`}
                >
                  <span
                    class={`toggle-thumb h-3 w-3 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none ${goalSettings.value.showGoals ? 'translate-x-2.75' : 'translate-x-0'}`}
                  />
                </span>
              </label>
              {goalSettings.value.showGoals && (
                <div
                  id="goal-options"
                  class="goal-picker order-3 flex h-11 w-full min-w-0 items-center gap-2 rounded-xl border border-background bg-white px-3 sm:w-80"
                >
                  <select
                    id="goal"
                    aria-label="Goal"
                    class="h-full min-w-0 flex-1 bg-transparent text-base font-semibold text-background"
                    value={goalSettings.value.selectedGoal}
                    onChange={e => goalSettings.value = {
                      ...goalSettings.value,
                      selectedGoal: e.currentTarget.value,
                    }}
                  >
                    <option value="all">All Projects</option>
                    {goals.value.map(goal => (
                      <option key={goal.goal_id} value={goal.goal_id}>{goal.goal_title}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    class="h-full shrink-0 cursor-pointer text-base font-normal text-background hover:underline"
                    onClick={() => goalSettings.value = {
                      ...goalSettings.value,
                      selectedGoal: "all",
                    }}
                  >
                    Reset
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div
          class={`${showFilter.value ? '' : 'hidden'} mb-5 flex w-full min-w-0 flex-row justify-evenly gap-2 sm:flex md:mb-0 md:w-auto md:justify-end md:gap-0`}
        >
          <div class="flex min-w-0 flex-1 md:mr-5 md:w-30 md:flex-none">
            <label
              for="tasksFilterStatus"
              class="flex w-full flex-row items-center justify-center rounded px-2 py-3 text-center text-base hover:text-background"
            >
              <img
                src="/static/images/filter2.png"
                alt=""
                class="mr-2 h-4 w-4 cursor-pointer"
                onClick={() => {
                  // Cast the element to include the optional showPicker method
                  const selectBox = document.getElementById("tasksFilterStatus") as HTMLSelectElement & { showPicker?: () => void };
                  if (selectBox && typeof selectBox.showPicker === "function")
                    selectBox.showPicker();
                }}
              />
              <select
                onChange={e => projectFilter.value = e.currentTarget.value as FilterValue}
                id="tasksFilterStatus"
                name="tasksFilterStatus"
                class="min-w-0 flex-1 cursor-pointer bg-transparent text-center text-nowrap text-ellipsis outline-none"
              >
                <option selected disabled>Filter</option>
                <option value={ProjectFilters.ALL}>All</option>
                <option value={ProjectFilters.Unfinished}>Unfinished</option>
                <option value={ProjectFilters.Finished}>Finished</option>
                <option value={ProjectFilters.Overdue}>Overdue</option>
              </select>
            </label>
          </div>
          <div class="flex min-w-0 flex-1 md:w-fit md:flex-none">
            <label
              for="projectsFilterPriority"
              class="flex w-full cursor-pointer flex-row items-center justify-center text-center text-base hover:text-background"
            >
              <img
                src="/static/images/sort.png"
                alt=""
                class="mr-2 h-5 w-3 cursor-pointer"
                onClick={() => {
                  const selectBox = document.getElementById("projectsFilterPriority") as HTMLSelectElement & { showPicker?: () => void };
                  if (selectBox && typeof selectBox.showPicker === "function")
                    selectBox.showPicker();
                }}
              />
              <select
                onChange={e => projectSorter.value = e.currentTarget.value as SortValue}
                id="projectsFilterPriority"
                name="projectsFilterPriority"
                class="min-w-0 flex-1 cursor-pointer bg-transparent px-2 py-3 text-center text-nowrap text-ellipsis outline-none md:w-35"
              >
                <option value={ProjectSorter.Skip} disabled selected>
                  Sort by
                </option>
                <option value={ProjectSorter.DueDateAsc}>
                  Due Date<span class="flex items-start text-3xl">&#8599;</span>
                </option>
                <option value={ProjectSorter.DueDateDesc}>
                  Due Date<span class="flex items-start text-3xl">&#8600;</span>
                </option>
                <option value={ProjectSorter.DoneDateAsc}>
                  Done Date<span class="flex items-start text-3xl">&#8599;</span>
                </option>
                <option value={ProjectSorter.DoneDateDesc}>
                  Done Date<span class="flex items-start text-3xl">&#8600;</span>
                </option>
                <option value={ProjectSorter.StartDateAsc}>
                  Start Date<span class="flex items-start text-3xl">&#8599;</span>
                </option>
                <option value={ProjectSorter.StartDateDesc}>
                  Start Date<span class="flex items-start text-3xl">&#8600;</span>
                </option>
                <option value={ProjectSorter.CompletionAsc}>
                  Completion<span class="flex items-start text-3xl">&#8599;</span>
                </option>
                <option value={ProjectSorter.CompletionDesc}>
                  Completion<span class="flex items-start text-3xl">&#8600;</span>
                </option>
                <option value={ProjectSorter.Priority}>
                  Priority
                </option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {(shownProjects.value.length > 0) ?
        <Fragment>
          <div
            id="projectsContainer"
            class={`${isViewMore.value ? 'h-132.5' : 'h-64'} grid snap-y snap-mandatory grid-cols-1 gap-3 overflow-hidden overflow-y-auto transition-all duration-300 ease-in-out md:grid-cols-2 lg:grid-cols-3`}
          >
            {shownProjects.value.map((project, index) => (
              <div
                key={project.project_id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                class={`min-w-0 cursor-grab active:cursor-grabbing transition-opacity duration-200
                  ${draggedItemIndex.value === index
                    ? 'opacity-30 border-2 border-dashed border-gray-400 rounded-xl scale-95'
                    : 'opacity-100 border-2 border-transparent'
                  }
                `}
              >
                <ProjectCard
                  project={project}
                  setSelectedProject={setSelectedProject}
                  isDemo={isDemo}
                />
              </div>
            ))}
          </div>

          {shownProjects.value.length > 3 && (
            <div class="flex flex-row items-center justify-end">
              {isViewMore.value ?
                <div class="flex flex-col w-full justify-center items-center">
                  <button
                    onClick={() => isViewMore.value = false}
                    class="mt-5 min-h-11 w-full cursor-pointer text-base font-medium hover:underline sm:min-h-0"
                  >
                    Hide
                  </button>
                </div>
                :
                <button
                  onClick={() => isViewMore.value = true}
                  class="mt-5 min-h-11 w-full cursor-pointer text-base font-medium text-nowrap hover:underline sm:min-h-0"
                >
                  View more
                </button>
              }
            </div>
          )}
        </Fragment>
        :
        <>
          <h3 class="mb-5 bg-background p-3 text-lg font-extrabold text-white md:my-10 md:text-2xl">
            {/* If the shownProject === 0, while the projects > 0, then all the projects
                are simply hidden. If both are === 0, then the user simply don't have any
                project yet. Or lastly, nothing match the selected filters.
            */}
            {projects.value.length === 0
              ? "You don't have any project yet."
              : projects.value.every(project => project.hide)
                ? "All of your projects are hidden."
                : "No projects match the selected filters."}
          </h3>
        </>
      }

      {(shownProjects.value.length > 3 ? isViewMore.value : projects.value.length > 0)
        && (
          <a
            href={isDemo ? "/demo/projects/all" : "/projects/all"}
            target="_blank"
            class="mt-5 flex min-h-11 w-full items-center justify-center text-base font-medium hover:underline sm:min-h-0"
          >
            All Projects
          </a>
        )}
    </>
  );
}
