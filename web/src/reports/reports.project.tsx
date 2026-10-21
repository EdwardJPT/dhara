import { ReadonlySignal, Signal, useComputed, useSignal } from "@preact/signals";

import TimeToggle from "./reports.timeToggle";
import { useDateRange, TimeRangeType } from "./hooks";
import { isDateWithinRange } from "./utils";
import { formattingDateTask } from "../utils";
import { ReportsTimeRange, TaskStatsKeyMap } from "../constants";

import { Project, Task, TaskStats } from "./types";

import ProjectPortfolio from "./reports.project.portfolio";
import ProjectProductivity from "./reports.project.productivity";
import { unixToYYYYMMDD } from "../utils";

interface ProjectsReportsProps {
  projects: Signal<Project[]>;
  tasks: Signal<Task[]>;
  taskStats: ReadonlySignal<TaskStats>;
  isDemo: boolean;
}

export function ProjectsReports({
  projects,
  tasks,
  taskStats,
  isDemo,
}: ProjectsReportsProps) {
  const timeRange: Signal<TimeRangeType> = useSignal(ReportsTimeRange.ThisWeek);
  const setTimeRage = (range: TimeRangeType) => (timeRange.value = range);

  const rangeDate = useDateRange(timeRange);

  console.log({ projects })

  const projectsStats = useComputed(() => {
    // Projects section
    let dueProjectsTotal = 0;           // due in the period
    let dueProjectsCompleted = 0;       // due in the period AND done
    let projectsCompletedInPeriod = 0;  // done in the period, whatever their due date

    const isAll = timeRange.value === ReportsTimeRange.ALL;

    projects.value.forEach((project) => {
      const { due_date } = project;
      const isDueWithinRange = isDateWithinRange(due_date, rangeDate.value, isAll);

      dueProjectsTotal += isDueWithinRange ? 1 : 0;;
      dueProjectsCompleted += isDueWithinRange && project.is_done ? 1 : 0;

      const { done_date } = project;
      const doneDateStr = unixToYYYYMMDD(done_date);
      const isDoneWithinRange = isDateWithinRange(doneDateStr, rangeDate.value, isAll);

      projectsCompletedInPeriod += isDoneWithinRange && project.is_done ? 1 : 0;
    });

    // Tasks section
    const { total, done, completed } = TaskStatsKeyMap[timeRange.value];

    const dueTasksTotal = taskStats.value[total];
    // this tasks DUE at current period
    const dueTasksCompleted = taskStats.value[done];
    // this tasks DONE at current period
    const tasksCompletedInPeriod = taskStats.value[completed];

    return {
      dueProjectsTotal, dueProjectsCompleted, projectsCompletedInPeriod,
      dueTasksTotal, dueTasksCompleted, tasksCompletedInPeriod,
    };
  });

  const percetageCompletedProjects = useComputed(() => {
    const { dueProjectsTotal, dueProjectsCompleted } = projectsStats.value;
    return Math.round((dueProjectsCompleted / dueProjectsTotal) * 100);
  });

  const percetageCompletedTasks = useComputed(() => {
    const { dueTasksTotal, dueTasksCompleted } = projectsStats.value;
    return Math.round((dueTasksCompleted / dueTasksTotal) * 100);
  });

  // Overdue stats - Projects
  const overdueProjectsCount = useComputed(() => {
    let count = 0;
    const now = new Date().getTime();
    projects.value.forEach((project) => {
      if (!project.is_done && new Date(project.due_date).getTime() < now) {
        count += 1;
      }
    });
    return count;
  });

  // Overdue stats - Tasks
  const overdueTasksCount = useComputed(() => {
    let count = 0;
    let priorityCount = 0;
    const now = new Date().getTime();

    tasks.value.forEach((task) => {
      const isDone = task.is_done;
      const dueDate = task.due_date;
      const isDueDatePast = new Date(task.due_date).getTime() < now;

      const isOverdue = !isDone && dueDate && isDueDatePast;

      count += isOverdue ? 1 : 0;

      const isPriority = task.priority;

      priorityCount += isOverdue && isPriority ? 1 : 0;
    });
    return { count, priorityCount };
  });

  return (
    <div className="bg-white py-6 sm:py-6 px-4 sm:px-8 w-full max-w-7xl mx-auto text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-5 gap-4 sm:gap-6">
        <div className="flex flex-col">
          <h1 className="text-[25px] text-background font-semibold">
            Project Progress
          </h1>
          <div className="flex items-center space-x-2 text-sm text-hover flex-wrap">
            <span className="font-semibold">
              {formattingDateTask(rangeDate.value.start.toLocaleDateString("en-CA"))}
            </span>
            <span className="text-background">&rarr;</span>
            <span className="font-semibold">
              {formattingDateTask(rangeDate.value.end.toLocaleDateString("en-CA"))}
            </span>
          </div>
        </div>

        <TimeToggle timeRange={timeRange.value} setTimeRange={setTimeRage} />
      </div>

      {/* Projects metrics section */}
      <section className="metrics project-metrics grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-3 items-stretch mb-6">
        <div className="metric text-left bg-[#e0fffd] border-l-6 border-l-background p-4 flex flex-col gap-1 shadow-sm">
          <span className="metric-title flex items-center gap-2 text-slate-500 text-[15px] font-semibold">
            Projects completed
          </span>
          <span className="metric-value text-2xl font-semibold text-slate-800 mt-1 mb-1">
            {projectsStats.value.projectsCompletedInPeriod}
          </span>
          <span className="metric-description text-sm text-slate-500 font-medium">
            Finished during this period
          </span>
        </div>

        <div className="metric-wrap relative bg-[#effcf9] border-l-6 border-l-hover p-4 flex flex-col gap-1 shadow-sm">
          <div className="metric text-left flex flex-col gap-1 w-full h-full">
            <span className="metric-title text-slate-500 text-[15px] font-semibold">
              Project deadlines met
            </span>
            <span className="metric-value text-2xl font-semibold text-slate-800 mt-1 mb-1">
              {isNaN(percetageCompletedProjects.value) ? 0 : percetageCompletedProjects.value}%
            </span>
            <span className="metric-description text-sm text-slate-500 font-medium">
              {projectsStats.value.dueProjectsCompleted} of {projectsStats.value.dueProjectsTotal} projects due this period completed
            </span>
          </div>
        </div>

        <div className="metric text-left bg-red-50 border-l-6 border-l-red-400 p-4 flex flex-col gap-1 shadow-sm">
          <span className="metric-title flex items-center gap-2 text-slate-500 text-[15px] font-semibold">
            Overdue projects
          </span>
          <span className="metric-value overdue-value text-2xl font-semibold text-red-600 mt-1 mb-1">
            {overdueProjectsCount.value}
          </span>
          <span className="metric-description text-sm text-slate-500 font-medium">
            Still open · across all dates
          </span>
        </div>
      </section>

      {/* Table of Projects */}
      <ProjectPortfolio
        projects={projects}
        tasks={tasks}
        timeRange={timeRange}
        rangeDate={rangeDate}
        isDemo={isDemo}
      />

      {/* Tasks section */}
      <section className="flex flex-col my-6 sm:mb-5 sm:mt-0">
        <h2 className="text-[22.5px] text-background font-semibold">
          Task Progress
        </h2>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Metrics and progress for the individual tasks across your projects
        </p>
      </section>

      {/* Tasks metric section */}
      <section className="metrics task-metrics grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-3 items-stretch mb-6">
        <div className="metric text-left bg-[#e0fffd] border-l-6 border-l-background p-4 flex flex-col gap-1 shadow-sm">
          <span className="metric-title flex items-center gap-2 text-slate-500 text-sm font-semibold">
            Tasks completed
          </span>
          <span className="metric-value text-2xl font-semibold text-slate-800 mt-1 mb-1">
            {projectsStats.value.tasksCompletedInPeriod}
          </span>
          <span className="metric-description text-sm text-slate-500 font-medium">
            Finished during this period
          </span>
        </div>

        <div className="metric-wrap relative bg-[#effcf9] border-l-6 border-l-hover p-4 flex flex-col gap-1 shadow-sm">
          <button className="metric text-left flex flex-col gap-1 w-full h-full">
            <span className="metric-title flex items-center gap-2 text-slate-500 text-sm font-semibold">
              Task deadlines met
            </span>
            <span className="metric-value text-2xl font-semibold text-slate-800 mt-1 mb-1">
              {isNaN(percetageCompletedTasks.value) ? 0 : percetageCompletedTasks.value}%
            </span>
            <span className="metric-description text-sm text-slate-500 font-medium">
              {projectsStats.value.dueTasksCompleted} of {projectsStats.value.dueTasksTotal} tasks due this period completed
            </span>
          </button>
        </div>

        <div className="metric text-left bg-red-50 border-l-6 border-l-red-400 p-4 flex flex-col gap-1 shadow-sm">
          <span className="metric-title flex items-center gap-2 text-slate-500 text-sm font-semibold">
            Overdue tasks
          </span>
          <span className="metric-value overdue-value text-2xl font-semibold text-red-600 mt-1 mb-1">
            {overdueTasksCount.value.count}
          </span>
          <span className="metric-description text-sm text-slate-500 font-medium">
            {overdueTasksCount.value.priorityCount} marked as priority
          </span>
        </div>
      </section>

      <ProjectProductivity
        tasks={tasks}
        timeRange={timeRange}
        rangeDate={rangeDate}
        percetageCompletedTasks={percetageCompletedTasks}
      />
    </div>
  );
}
