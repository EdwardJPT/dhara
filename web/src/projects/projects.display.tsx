import { useComputed, useSignal, Signal } from "@preact/signals";
import { useMemo } from "preact/hooks";

import { ProjectCard } from "../home/home.projects";
import { ProjectFilters, ProjectSorter } from "../constants";
import { todayUserTimeZone } from "../utils";
import type { Project } from "../models";
import type { Goal } from "../home/types";

interface ProjectsProps {
  projects: Signal<Project[]>;
  goals: Signal<Goal[]>;
  isDemo: boolean;
}

type FilterValue = typeof ProjectFilters[keyof typeof ProjectFilters] | "hidden";
type SortValue = typeof ProjectSorter[keyof typeof ProjectSorter];

export function ProjectsDisplay({ projects, goals, isDemo }: ProjectsProps) {
  const projectFilter = useSignal<FilterValue>(ProjectFilters.ALL);
  const selectedGoal = useSignal("all");
  const projectSorter = useSignal<SortValue>(ProjectSorter.Skip);
  const search = useSignal("");
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
    const query = search.value.trim().toLowerCase();
    const today = todayUserTimeZone();
    let goalProjectIds: number[] | null = null;
    if (selectedGoal.value !== "all") {
      const goal = goals.value.find(goal => String(goal.goal_id) === selectedGoal.value);
      if (goal) {
        try {
          const ids = JSON.parse(goal.project_ids);
          goalProjectIds = Array.isArray(ids) ? ids : [];
        } catch (e) {
          console.error("Error parsing goal project IDs", e);
          goalProjectIds = [];
        }
      }
    }

    const result = projects.value.filter(project => {
      if (goalProjectIds && !goalProjectIds.includes(project.project_id)) return false;
      if (projectFilter.value === "hidden" && !project.hide) return false;
      if (projectFilter.value === ProjectFilters.Unfinished && project.is_done) return false;
      if (projectFilter.value === ProjectFilters.Finished && !project.is_done) return false;
      if (projectFilter.value === ProjectFilters.Overdue &&
        (project.is_done || !project.due_date || project.due_date >= today)) return false;

      return !query ||
        project.project_title.toLowerCase().includes(query) ||
        project.project_desc.toLowerCase().includes(query);
    });

    if (projectSorter.value === ProjectSorter.Skip) return result;
    return result.sort(sortFunctions[projectSorter.value]);
  });

  const setSelectedProject = (projectId: number) => {
    const project = projects.value.find(project => project.project_id === projectId);
    if (project) {
      window.location.href = `${isDemo ? "/demo" : ""}/project/${project.public_id}`;
    }
  };

  return (
    <>
      <div class="mb-6 flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div class="flex flex-wrap gap-1" role="group" aria-label="Filter projects by status">
          {Object.entries(ProjectFilters).map(([label, value]) => (
            <button
              key={value}
              onClick={() => projectFilter.value = value}
              aria-pressed={projectFilter.value === value}
              class={`min-h-11 cursor-pointer rounded-md px-4 py-2 text-sm font-semibold transition-colors ${projectFilter.value === value
                ? "bg-background text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-background"
                }`}
            >
              {value === ProjectFilters.ALL ? "All" : label}
            </button>
          ))}
          <button
            onClick={() => projectFilter.value = "hidden"}
            aria-pressed={projectFilter.value === "hidden"}
            class={`min-h-11 cursor-pointer rounded-md px-4 py-2 text-sm font-semibold transition-colors ${projectFilter.value === "hidden"
              ? "bg-background text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-background"
              }`}
          >
            Hidden
          </button>
        </div>
        <div class="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
          {goals.value.length > 0 && (
            <label
              for="all-projects-goal"
              class="flex min-h-11 w-full min-w-0 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-500 sm:w-48"
            >
              Goals
              <select
                id="all-projects-goal"
                value={selectedGoal.value}
                onChange={e => selectedGoal.value = e.currentTarget.value}
                class="min-h-11 min-w-0 flex-1 cursor-pointer bg-transparent text-sm font-semibold text-slate-600 outline-none focus:ring-1 focus:ring-background"
              >
                <option value="all">All Goals</option>
                {goals.value.map(goal => (
                  <option key={goal.goal_id} value={goal.goal_id}>{goal.goal_title}</option>
                ))}
              </select>
            </label>
          )}
          <div class="flex min-h-11 min-w-0 items-center text-sm text-slate-500 hover:text-background">
            <img src="/static/images/sort.png" alt="" class="h-5 w-3" />
            <select
              aria-label="Sort projects"
              value={projectSorter.value}
              onChange={e => projectSorter.value = e.currentTarget.value as SortValue}
              class="font-semibold min-h-11 w-full min-w-0 cursor-pointer px-2 py-2"
            >
              <option value={ProjectSorter.Skip}>Sort by</option>
              <option value={ProjectSorter.DueDateAsc}>Due Date &#8599;</option>
              <option value={ProjectSorter.DueDateDesc}>Due Date &#8600;</option>
              <option value={ProjectSorter.DoneDateAsc}>Done Date &#8599;</option>
              <option value={ProjectSorter.DoneDateDesc}>Done Date &#8600;</option>
              <option value={ProjectSorter.StartDateAsc}>Start Date &#8599;</option>
              <option value={ProjectSorter.StartDateDesc}>Start Date &#8600;</option>
              <option value={ProjectSorter.CompletionAsc}>Completion &#8599;</option>
              <option value={ProjectSorter.CompletionDesc}>Completion &#8600;</option>
              <option value={ProjectSorter.Priority}>Priority</option>
            </select>
          </div>
          <input
            type="search"
            aria-label="Search projects"
            placeholder="Search projects"
            value={search.value}
            onInput={e => search.value = e.currentTarget.value}
            class="min-h-11 w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-background focus:ring-1 focus:ring-background lg:w-64"
          />
        </div>
      </div>

      <p class="mb-4 text-sm font-medium text-slate-500" aria-live="polite">
        Showing {shownProjects.value.length} of {projects.value.length} projects
      </p>

      {shownProjects.value.length > 0 ? (
        <div id="projectsContainer" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shownProjects.value.map(project => (
            <ProjectCard
              key={project.project_id}
              project={project}
              setSelectedProject={setSelectedProject}
              isDemo={isDemo}
            />
          ))}
        </div>
      ) : (
        <div class="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <h2 class="text-xl font-semibold text-slate-700">
            {projects.value.length === 0 ? "You don't have any project yet." : "No matching projects"}
          </h2>
          <p class="mt-3 text-sm text-slate-500">
            {projects.value.length === 0
              ? "Head back to Home to create your first project."
              : "Try adjusting your filters or search term."}
          </p>
        </div>
      )}
    </>
  );
}
