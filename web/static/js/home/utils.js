// web/src/components/constants.js
var ALL = "all";
var Priority = "priority";
var ProjectFilters = Object.freeze({
  ALL,
  Unfinished: "unfinished",
  Finished: "finished",
  Overdue: "overdue"
});
var ProjectSorter = Object.freeze({
  Skip: "",
  DueDateAsc: "dueDateAsc",
  DueDateDesc: "dueDateDesc",
  DoneDateAsc: "doneDateAsc",
  DoneDateDesc: "doneDateDesc",
  Priority
});
var TaskFiltersPriority = Object.freeze({ ALL, Priority });
var TaskFiltersStatus = Object.freeze({
  ALL,
  Unfinished: "unfinished",
  Finished: "finished",
  Overdue: "overdue"
});
var TaskFiltersTime = Object.freeze({
  ALL,
  Today: "today",
  ThisWeek: "week",
  SevenDays: "7days",
  ThisMonth: "month",
  ThirtyDays: "30days",
  ThisQuarter: "quarter"
});
var TaskSorter = Object.freeze({
  Skip: "",
  DueDateAsc: "dueDateAsc",
  DueDateDesc: "dueDateDesc",
  DoneDateAsc: "doneDateAsc",
  DoneDateDesc: "doneDateDesc",
  Priority: "priority"
});
var defaultTaskFilters = Object.freeze({
  selectedProject: ALL,
  priority: ALL,
  status: ALL,
  time: TaskFiltersTime.Today
});
var monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
function getWeekRange(date) {
  const day = date.getDay();
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - day);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return { startOfWeek, endOfWeek };
}
function getMonthRange(date) {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);
  return { startOfMonth, endOfMonth };
}
function getQuarterRange(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const quarterStartMonth = Math.floor(month / 3) * 3;
  const startOfQuarter = new Date(year, quarterStartMonth, 1);
  const quarterEndMonth = quarterStartMonth + 2;
  const endOfQuarter = new Date(year, quarterEndMonth + 1, 0);
  endOfQuarter.setHours(23, 59, 59, 999);
  return { startOfQuarter, endOfQuarter };
}
var ReportsTimeRange = Object.freeze({
  ThisWeek: "Week",
  ThisMonth: "Month",
  ThreeMonths: "3 Months",
  SixMonths: "6 Months",
  SevenDays: "Last 7 days",
  ThirtyDays: "Last 30 days",
  NinetyDays: "Last 90 days",
  HundredEightyDays: "Last 180 days",
  ThisYear: "This Year",
  ALL: "All"
});
var TaskStatsKeyMap = Object.freeze({
  [ReportsTimeRange.ThisWeek]: { total: "thisWeekTotal", done: "thisWeekDone" },
  [ReportsTimeRange.ThisMonth]: { total: "thisMonthTotal", done: "thisMonthDone" },
  [ReportsTimeRange.ThreeMonths]: { total: "currentQuarterTotal", done: "currentQuarterDone" },
  [ReportsTimeRange.SixMonths]: { total: "currentSemesterTotal", done: "currentSemesterDone" },
  [ReportsTimeRange.SevenDays]: { total: "last7DaysTotal", done: "last7DaysDone" },
  [ReportsTimeRange.ThirtyDays]: { total: "last30DaysTotal", done: "last30DaysDone" },
  [ReportsTimeRange.NinetyDays]: { total: "last90DaysTotal", done: "last90DaysDone" },
  [ReportsTimeRange.HundredEightyDays]: { total: "last180DaysTotal", done: "last180DaysDone" },
  [ReportsTimeRange.ThisYear]: { total: "thisYearTotal", done: "thisYearDone" },
  [ReportsTimeRange.ALL]: { total: "allTimeTotal", done: "allTimeDone" }
});

// web/src/home/utils.ts
function isContainMonthsName(str) {
  return monthNames.includes(str.split(" ")[0]);
}
function filterTasks(tasks, filters, todayStr) {
  let result = tasks;
  const todayDate = new Date(todayStr);
  if (filters.priority !== TaskFiltersPriority.ALL) {
    result = result.filter((t) => t.priority);
  }
  if (filters.selectedProject !== ALL && Number.isFinite(filters.selectedProject)) {
    result = result.filter((t) => t.project_id === filters.selectedProject);
  }
  if (filters.status !== TaskFiltersStatus.ALL) {
    if (filters.status === TaskFiltersStatus.Unfinished) {
      result = result.filter((t) => !t.is_done);
    } else if (filters.status === TaskFiltersStatus.Finished) {
      result = result.filter((t) => t.is_done);
    } else if (filters.status === TaskFiltersStatus.Overdue) {
      result = result.filter((t) => !t.is_done && todayDate > new Date(t.due_date));
    }
  }
  if (filters.time !== ALL) {
    result = result.filter((t) => {
      const taskDueDate = new Date(t.due_date);
      if (filters.time === TaskFiltersTime.Today) {
        return t.due_date === todayStr;
      }
      if (filters.time === TaskFiltersTime.ThisWeek) {
        const { startOfWeek, endOfWeek } = getWeekRange(todayDate);
        return taskDueDate >= startOfWeek && taskDueDate <= endOfWeek;
      }
      if (filters.time === TaskFiltersTime.SevenDays) {
        const thisDay = new Date(todayStr);
        const next7DaysEnd = new Date(todayStr);
        next7DaysEnd.setDate(thisDay.getDate() + 6);
        next7DaysEnd.setHours(23, 59, 59, 999);
        return taskDueDate >= thisDay && taskDueDate <= next7DaysEnd;
      }
      if (filters.time === TaskFiltersTime.ThisMonth) {
        const { startOfMonth, endOfMonth } = getMonthRange(todayDate);
        return taskDueDate >= startOfMonth && taskDueDate <= endOfMonth;
      }
      if (filters.time === TaskFiltersTime.ThirtyDays) {
        const thisDay = new Date(todayStr);
        const next30DaysEnd = new Date(todayStr);
        next30DaysEnd.setDate(thisDay.getDate() + 29);
        next30DaysEnd.setHours(23, 59, 59, 999);
        return taskDueDate >= thisDay && taskDueDate <= next30DaysEnd;
      }
      if (filters.time === TaskFiltersTime.ThisQuarter) {
        const { startOfQuarter, endOfQuarter } = getQuarterRange(todayDate);
        return taskDueDate >= startOfQuarter && taskDueDate <= endOfQuarter;
      }
      if (isContainMonthsName(filters.time)) {
        const monthStr = filters.time.split(" ")[0];
        const month = monthNames.indexOf(monthStr);
        const year = Number(filters.time.split(" ")[1]);
        return taskDueDate >= new Date(year, month) && taskDueDate <= new Date(year, month + 1);
      }
      if (filters.time) {
        return t.due_date === filters.time;
      }
      return false;
    });
  }
  return result;
}
function convertToTask(unsorted, projectId, newTaskId) {
  const {
    unsorted_id,
    unsorted_title,
    unsorted_desc,
    ...commonProps
  } = unsorted;
  return {
    ...commonProps,
    task_id: newTaskId ?? unsorted_id,
    project_id: projectId,
    task_title: unsorted_title,
    task_desc: unsorted_desc
  };
}
export {
  convertToTask,
  filterTasks
};
