import { ReadonlySignal, Signal, useComputed, useSignal } from "@preact/signals";
import { ReportsTimeRange } from "../constants";
import type { TimeRangeType } from "./hooks";
import type { Project, Task } from "./types";
import { isTimestampWithinRange } from "./utils";
import { unixToMMMDD } from "../utils";

export interface PortfolioProject extends Project {
  totalTasks: number;
  completedTasks: number;
  finishedInPeriodTasks: number;
  overdueTasks: number;
  isProjectOverdue: boolean | "";
  isProjectFinishedInPeriod: boolean;
  isProjectActive: boolean;
  progressPercent: number;
  openTasks: number;
  daysPast: number;
}

const projectColors = ["bg-indigo-500", "bg-blue-500", "bg-teal-500", "bg-slate-500", "bg-rose-500", "bg-emerald-500"];

interface PortfolioRowProps {
  project: PortfolioProject;
  index: number;
  isDemo?: boolean;
}

const PortfolioRow = ({
  project: proj,
  index: i,
  isDemo = false,
}: PortfolioRowProps) => {
  const rowColor = projectColors[i % projectColors.length];

  return (
    <div key={proj.project_id} className="portfolio-row bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 transition-colors relative">

        <div className="portfolio-name flex items-center gap-3 col-span-1 md:col-span-5 pr-6">
          <span className={`w-9 h-9 flex items-center justify-center text-white font-bold shrink-0 ${rowColor}`}>
            {proj.project_title.charAt(0).toUpperCase()}
          </span>
          <div className="flex flex-col overflow-hidden">
            <a
              href={isDemo ? `/demo/project/${proj.public_id}` : `/project/${proj.public_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-600 text-base truncate hover:underline hover:text-teal-800 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {proj.project_title}
            </a>
            <span className="font-medium text-slate-500 text-sm flex flex-wrap items-center gap-1 mt-0.5">
              {proj.due_date ? `Due ${new Date(proj.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "No project deadline"}
              <span className="mx-0.5 hidden sm:inline">&middot;</span>

              <span className={proj.isProjectOverdue ? "text-red-500 font-semibold" : ""}>
                {proj.isProjectOverdue
                  ? "Project overdue"
                  : proj.is_done
                    ? `Finished ${proj.done_date ? unixToMMMDD(proj.done_date) : ""}`
                    : "Active"}
              </span>

            </span>
          </div>
        </div>

        <div className="portfolio-progress col-span-1 md:col-span-3 flex flex-col justify-center my-2 md:my-0">
          <div className="flex justify-between items-end mb-1">
            <span className="font-semibold text-slate-800 text-sm">{proj.progressPercent}%</span>
            <span className="font-medium text-slate-500 text-sm">{proj.completedTasks}/{proj.totalTasks} Tasks</span>
          </div>
          <progress
            className="w-full h-1.5 [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:bg-indigo-300 [&::-moz-progress-bar]:bg-indigo-300 overflow-hidden"
            max="100"
            aria-label={`${proj.project_title}: ${proj.completedTasks} of ${proj.totalTasks} tasks complete`}
            value={proj.progressPercent}
          />
        </div>

        <div className="portfolio-count col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
          <span className="md:hidden font-medium text-slate-500 text-sm">Finished in period</span>
          <span className="font-semibold text-slate-800 text-base">{proj.finishedInPeriodTasks}</span>
        </div>

        <div className="portfolio-count col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
          <span className="md:hidden font-medium text-slate-500 text-sm">Overdue tasks</span>
          <span className={proj.overdueTasks > 0 ? "font-semibold text-red-600 text-base" : "font-semibold text-slate-800 text-base"}>
            {proj.overdueTasks}
          </span>
        </div>

      </div>
    </div>
  );
};

interface ProjectPortfolioProps {
  projects: Signal<Project[]>;
  tasks: Signal<Task[]>;
  timeRange: Signal<TimeRangeType>;
  rangeDate: ReadonlySignal<{ start: Date; end: Date }>;
  isDemo: boolean;
}

export default function ProjectPortfolio({
  projects,
  tasks,
  timeRange,
  rangeDate,
  isDemo,
}: ProjectPortfolioProps) {
  const portfolioTab = useSignal<"active" | "finished" | "overdue" | "all">("active");
  const showAllPortfolio = useSignal(false);

  const portfolioCounts = useComputed(() => {
    let active = 0;
    let finished = 0;
    let overdue = 0;
    const all = projects.value.length;
    const now = new Date().getTime();
    const isAll = timeRange.value === ReportsTimeRange.ALL;

    projects.value.forEach(p => {
      const pOverdue = !p.is_done && p.due_date && new Date(p.due_date).getTime() < now;
      const pFinished = p.is_done && isTimestampWithinRange(p.done_date, rangeDate.value.start, rangeDate.value.end, isAll);

      if (pOverdue) overdue++;
      if (pFinished) finished++;
      if (!p.is_done && !pOverdue) active++;
    });

    return { active, finished, overdue, all };
  });

  const portfolioData = useComputed(() => {
    const now = new Date().getTime();
    const isAll = timeRange.value === ReportsTimeRange.ALL;

    const mappedProjects = projects.value.map(project => {
      const projectTasks = tasks.value.filter(t => t.project_id === project.project_id);
      const totalTasks = projectTasks.length;
      const completedTasks = projectTasks.filter(t => t.is_done).length;

      const finishedInPeriodTasks = projectTasks.filter(t =>
        t.is_done && isTimestampWithinRange(t.done_date, rangeDate.value.start, rangeDate.value.end, isAll)
      ).length;

      const overdueTasks = projectTasks.filter(t =>
        !t.is_done && t.due_date && new Date(t.due_date).getTime() < now
      ).length;

      const isProjectOverdue = !project.is_done && project.due_date && new Date(project.due_date).getTime() < now;
      const isProjectFinishedInPeriod = project.is_done && isTimestampWithinRange(project.done_date, rangeDate.value.start, rangeDate.value.end, isAll);
      const isProjectActive = !project.is_done && !isProjectOverdue;
      const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
      const daysPast = project.due_date ? Math.floor((now - new Date(project.due_date).getTime()) / (1000 * 60 * 60 * 24)) : 0;

      return {
        ...project,
        totalTasks,
        completedTasks,
        finishedInPeriodTasks,
        overdueTasks,
        isProjectOverdue,
        isProjectFinishedInPeriod,
        isProjectActive,
        progressPercent,
        openTasks: totalTasks - completedTasks,
        daysPast
      };
    });

    // Filter list based on selected tab, then sort by due_date
    return mappedProjects
      .filter(p => {
        if (portfolioTab.value === "active") return p.isProjectActive;
        if (portfolioTab.value === "finished") return p.isProjectFinishedInPeriod;
        if (portfolioTab.value === "overdue") return p.isProjectOverdue;
        return true; // "all"
      })
      .sort((a, b) => {
        // If both are missing due dates, keep their original order
        if (!a.due_date && !b.due_date) return 0;
        // If 'a' has no due date, push it below 'b'
        if (!a.due_date) return 1;
        // If 'b' has no due date, push it below 'a'
        if (!b.due_date) return -1;
        // Sort by earliest due date first
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });
  });

  return (
    <section className="project-portfolio sm:my-7.5">
      {/* Tabs */}
      <div className="detail-tabs flex border-b border-gray-200 mb-4 gap-6 overflow-x-auto no-scrollbar" aria-label="Project views">
        <button
          onClick={() => { portfolioTab.value = "active"; showAllPortfolio.value = false; }}
          className={`pb-2 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${portfolioTab.value === "active" ? "border-background text-background" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          aria-pressed={portfolioTab.value === "active"}
        >
          Active now
          <span className={`py-0.5 px-2 text-xs font-semibold ${portfolioTab.value === "active" ? "bg-indigo-100 text-background" : "bg-gray-100 text-gray-600"}`}>
            {portfolioCounts.value.active}
          </span>
        </button>
        <button
          onClick={() => { portfolioTab.value = "finished"; showAllPortfolio.value = false; }}
          className={`pb-2 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${portfolioTab.value === "finished" ? "border-background text-background" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          aria-pressed={portfolioTab.value === "finished"}
        >
          Finished in period
          <span className={`py-0.5 px-2 text-xs font-semibold ${portfolioTab.value === "finished" ? "bg-indigo-100 text-background" : "bg-gray-100 text-gray-600"}`}>
            {portfolioCounts.value.finished}
          </span>
        </button>
        <button
          onClick={() => { portfolioTab.value = "overdue"; showAllPortfolio.value = false; }}
          className={`pb-2 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${portfolioTab.value === "overdue" ? "border-background text-background" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          aria-pressed={portfolioTab.value === "overdue"}
        >
          Overdue now
          <span className={`py-0.5 px-2 text-xs font-semibold ${portfolioTab.value === "overdue" ? "bg-indigo-100 text-background" : "bg-gray-100 text-gray-600"}`}>
            {portfolioCounts.value.overdue}
          </span>
        </button>
        <button
          onClick={() => { portfolioTab.value = "all"; showAllPortfolio.value = false; }}
          className={`pb-2 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${portfolioTab.value === "all" ? "border-background text-background" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          aria-pressed={portfolioTab.value === "all"}
        >
          All projects
          <span className={`py-0.5 px-2 text-xs font-semibold ${portfolioTab.value === "all" ? "bg-indigo-100 text-background" : "bg-gray-100 text-gray-600"}`}>
            {portfolioCounts.value.all}
          </span>
        </button>
      </div>

      <div className="portfolio-context text-sm text-gray-500 font-medium mb-4" aria-live="polite">
        Project status and task progress as of {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}.
      </div>

      {/* Desktop Columns Header */}
      <div className="portfolio-columns hidden md:grid md:grid-cols-12 gap-4 text-sm font-semibold text-slate-500 mb-2 px-4" aria-hidden="true">
        <span className="col-span-5">Projects</span>
        <span className="col-span-3">Task progress now</span>
        <span className="col-span-2 text-center">Tasks finished in period</span>
        <span className="col-span-2 text-center">Overdue tasks now</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {/* Always Visible First 3 */}
        <div className="flex flex-col gap-2">
          {
            portfolioData.value.slice(0, 3).map((proj, i) =>
              <PortfolioRow
                key={proj.project_id}
                project={proj as PortfolioProject}
                index={i}
                isDemo={isDemo}
              />
            )
          }
        </div>

        {/* Animated Wrapper for Remaining Items */}
        {portfolioData.value.length > 3 && (
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${showAllPortfolio.value ? "grid-rows-[1fr] opacity-100 pt-2" : "grid-rows-[0fr] opacity-0 pt-0"
              }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-2">
                {
                  portfolioData.value.slice(3).map((proj, i) =>
                    <PortfolioRow
                      key={proj.project_id}
                      project={proj as PortfolioProject}
                      index={i + 3}
                      isDemo={isDemo}
                    />
                  )
                }
              </div>
            </div>
          </div>
        )}

        {portfolioData.value.length === 0 && (
          <div className="text-center py-8 text-sm font-medium text-gray-500 border border-dashed border-gray-200">
            No projects found for this category.
          </div>
        )}

        {/* Show All Toggle Button */}
        {portfolioData.value.length > 3 && (
          <button
            onClick={() => showAllPortfolio.value = !showAllPortfolio.value}
            className="mt-4 py-2.5 px-4 bg-white border border-gray-200 text-slate-600 text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors w-full flex justify-center items-center"
          >
            {showAllPortfolio.value ? "Show Less" : `Show All (${portfolioData.value.length})`}
          </button>
        )}
      </div>
    </section>
  );
}
