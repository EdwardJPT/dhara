import { Fragment } from "preact";
import { useSignal, useComputed, Signal, useSignalEffect } from "@preact/signals";
import { useMemo } from "preact/hooks";

import type { Project } from "./types.ts";

import {
  ProjectFilters,
  ProjectSorter,
  formattingDateProject,
  todayUserTimeZone,
  nDaysAgo,
  nDaysLeft,
} from "../components/constants"

interface ProjectsProps {
  projects: Signal<Project[]>;
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

const ProjectCard = ({ project, setSelectedProject, isDemo }: ProjectCardProps) => {
  return (
    <div
      onClick={() => setSelectedProject(project.project_id)}
      class={`${project.is_done ? 'bg-pink-300 opacity-50' : 'bg-white'} group flex h-64 cursor-pointer snap-start flex-col rounded-lg border-l-4 border-background p-6 shadow hover:bg-pink-50`}
    >
      <div class="flex flex-col justify-start">
        <div class="mb-2 flex justify-between">
          <a
            // Check if isDemo is true to determine the link
            href={isDemo ? `/demo/project/${project.public_id}` : `/project/${project.public_id}`}
            target="_blank"
            class="block h-fit max-h-10 items-center overflow-y-auto text-lg font-semibold text-slate-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {project.project_title}
          </a>
          {project.priority &&
            <span class="p-2 my-auto inline-flex max-h-6 w-fit items-center rounded-full bg-red-100 text-xs font-medium text-red-800">
              Priority
            </span>
          }
        </div>

        <div class="overflow-y-auto">
          <p class="h-25 min-h-20 text-base text-ellipsis text-gray-700">
            {project.project_desc}
          </p>
        </div>
      </div>

      <div class="hidden flex-row items-center justify-between pt-1 group-hover:flex">
        <p class="text-sm text-gray-500 font-medium">
          Start: {formattingDateProject(project.start_date)}
        </p>
        <p class="flex flex-row items-center text-sm text-hover">
          <img src="/static/images/clock.svg" alt="clock icon" class="h-3 w-3" />&nbsp;
          {nDaysAgo(project.start_date)}
        </p>
      </div>
      {project.done_date ?
        <div class="flex items-center justify-between py-2 group-hover:py-0">
          <p class="bg-white text-sm font-extrabold text-gray-800 no-underline opacity-100">
            DONE : {formattingDateProject(new Date(project.done_date * 1000).toLocaleDateString("en-CA"))}
          </p>
        </div>
        :
        <div class="flex items-center justify-between py-2 group-hover:py-0">
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
        <span class="text-sm font-medium text-gray-500">
          {project.to_dos_done}/{project.to_dos_all}
        </span>
      </div>
    </div>
  );
};

export function ProjectsDisplay({
  projects,
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

  // Helper function to load the initial project filter
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
      return (new Date(a.due_date)).getTime() - (new Date(b.due_date)).getTime();
    },
    [ProjectSorter.DueDateDesc]: (a: Project, b: Project) => {
      return (new Date(b.due_date)).getTime() - (new Date(a.due_date)).getTime()
    },
    [ProjectSorter.DoneDateAsc]: (a: Project, b: Project) => {
      return (new Date(a.done_date)).getTime() - (new Date(b.done_date)).getTime();
    },
    [ProjectSorter.DoneDateDesc]: (a: Project, b: Project) => {
      return (new Date(b.done_date)).getTime() - (new Date(a.done_date)).getTime()
    },
    [ProjectSorter.StartDateAsc]: (a: Project, b: Project) => {
      return (new Date(a.start_date)).getTime() - (new Date(b.start_date)).getTime();
    },
    [ProjectSorter.StartDateDesc]: (a: Project, b: Project) => {
      return (new Date(b.start_date)).getTime() - (new Date(a.start_date)).getTime()
    },
    [ProjectSorter.CompletionAsc]: (a: Project, b: Project) => {
      return (a.to_dos_done / a.to_dos_all) - (b.to_dos_done / b.to_dos_all);
    },
    [ProjectSorter.CompletionDesc]: (a: Project, b: Project) => {
      return (b.to_dos_done / b.to_dos_all) - (a.to_dos_done / a.to_dos_all);
    },
    [ProjectSorter.Priority]: (a: Project, b: Project) => {
      return Number(b.priority) - Number(a.priority)
    },
  }), []);

  const shownProjects = useComputed(() => {
    let result = projects.value;
    const today = todayUserTimeZone();
    // filter based on finish status
    if (projectFilter.value !== ProjectFilters.ALL) {
      if (projectFilter.value === ProjectFilters.Unfinished) {
        result = result.filter(p => !p.is_done)
      }
      if (projectFilter.value === ProjectFilters.Finished) {
        result = result.filter(p => p.is_done)
      }
      if (projectFilter.value === ProjectFilters.Overdue) {
        result = result.filter(p => !p.is_done && new Date(today) > new Date(p.due_date))
      }
    }
    // sort the projects
    if (!projectSorter.value) return result;
    return [...result].sort(sortFunctions[projectSorter.value]);
  });

  return (
    <>
      <div class="mb-0 flex flex-col items-center justify-around md:mb-6 md:flex-row md:justify-between">
        {(shownProjects.value.length > 0) && (
          <div
            onClick={() => showFilter.value = !showFilter.value}
            class={`${showFilter.value ? '' : 'mb-6'} mt-2.5 mb-4 flex cursor-pointer flex-row items-center sm:hidden`}
          >
            {showFilter.value ? 'Collapse ⌃' : 'Expand ⌄'}
          </div>
        )}

        <div
          class={`${showFilter.value || !shownProjects.value.length ? '' : 'hidden'} mb-5 flex w-full flex-row justify-evenly sm:flex md:mb-0 md:justify-start`}
        >
          <button
            hx-get={`${isDemo ? "/demo" : ""}/home/create-project-form`} hx-target="#form-container" hx-swap="innerHTML"
            class="flex min-w-35 cursor-pointer items-center justify-center rounded-xl bg-background p-1.25 text-center text-base font-semibold text-white hover:bg-hover md:mr-5 md:px-2.5 md:py-1 md:text-lg"
          >
            + New Project
          </button>
          <button
            onClick={() => showUnsorted.value = true}
            class="flex cursor-pointer items-center justify-center rounded-xl bg-background p-1.25 text-center text-base font-semibold text-white hover:bg-hover md:px-2.5 md:py-1 md:text-lg"
          >
            <img src="/static/images/list.svg" alt="list of unsorted tasks" class="h-3.5 w-3.5" />&nbsp;Unsorted ({unfinishedUnsorted.value})
          </button>
        </div>
        <div
          class={`${showFilter.value ? '' : 'hidden'} mb-5 flex w-full flex-row justify-evenly sm:flex md:mb-0 md:justify-end`}
        >
          <div class="flex w-35 cursor-pointer flex-row items-center justify-center text-center text-base md:mr-5 hover:text-background md:w-30">
            <img src="/static/images/filter2.png" alt="" class="h-4 w-4" />&nbsp;
            <select
              onChange={e => projectFilter.value = e.currentTarget.value as FilterValue}
              id="tasksFilterStatus"
              name="tasksFilterStatus"
              class="w-full px-2 py-3 text-center text-nowrap text-ellipsis"
            >
              <option selected disabled>Filter</option>
              <option value={ProjectFilters.ALL}>All</option>
              <option value={ProjectFilters.Unfinished}>Unfinished</option>
              <option value={ProjectFilters.Finished}>Finished</option>
              <option value={ProjectFilters.Overdue}>Overdue</option>
            </select>
          </div>
          <div class="flex w-35 cursor-pointer flex-row items-center justify-center text-center text-base hover:text-background md:w-fit">
            <img src="/static/images/sort.png" alt="" class="h-5 w-3" />
            <select
              onChange={e => projectSorter.value = e.currentTarget.value as SortValue}
              id="projectsFilterPriority"
              name="projectsFilterPriority"
              class="w-full px-2 py-3 text-center text-nowrap text-ellipsis md:w-35"
            >
              <option value={ProjectSorter.Skip} disabled selected>Sort by</option>
              <option value={ProjectSorter.DueDateAsc}>Due Date<span class="flex items-start text-3xl">&#8599;</span></option>
              <option value={ProjectSorter.DueDateDesc}>Due Date<span class="flex items-start text-3xl">&#8600;</span></option>
              <option value={ProjectSorter.DoneDateAsc}>Done Date<span class="flex items-start text-3xl">&#8599;</span></option>
              <option value={ProjectSorter.DoneDateDesc}>Done Date<span class="flex items-start text-3xl">&#8600;</span></option>
              <option value={ProjectSorter.StartDateAsc}>Start Date<span class="flex items-start text-3xl">&#8599;</span></option>
              <option value={ProjectSorter.StartDateDesc}>Start Date<span class="flex items-start text-3xl">&#8600;</span></option>
              <option value={ProjectSorter.CompletionAsc}>Completion<span class="flex items-start text-3xl">&#8599;</span></option>
              <option value={ProjectSorter.CompletionDesc}>Completion<span class="flex items-start text-3xl">&#8600;</span></option>
              <option value={ProjectSorter.Priority}>Priority</option>
            </select>
          </div>
        </div>
      </div>

      {(shownProjects.value.length > 0) ?
        <Fragment>
          <div
            id="projectsContainer"
            class={`${isViewMore.value ? 'h-132.5' : 'h-64'} grid snap-y snap-mandatory grid-cols-1 gap-3 overflow-hidden overflow-y-auto transition-all duration-300 ease-in-out md:grid-cols-2 lg:grid-cols-3`}
          >
            {shownProjects.value.map(project => (
              <ProjectCard
                key={project.project_id}
                project={project}
                setSelectedProject={setSelectedProject}
                isDemo={isDemo}
              />
            ))}
          </div>

          {shownProjects.value.length > 3 && (
            <div class="flex flex-row items-center justify-end">
              {isViewMore.value ?
                <button
                  onClick={() => isViewMore.value = false}
                  class="mt-5 mr-5 w-full cursor-pointer text-base font-medium hover:underline"
                >
                  Hide
                </button>
                :
                <button
                  onClick={() => isViewMore.value = true}
                  class="mt-5 w-full cursor-pointer text-base font-medium text-nowrap hover:underline"
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
            You don't have any project yet.
          </h3>
        </>
      }
    </>
  );
}
