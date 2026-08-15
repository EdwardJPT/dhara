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
function formattingDateProject(date) {
  if (!date) return "";
  let dateArray = date.split("-");
  let formattedDate = dateArray[2] + " " + monthNames[dateArray[1] - 1].slice(0, 3) + " " + dateArray[0];
  return formattedDate ? formattedDate : "";
}
function formattingDateTask(date) {
  let dateArray = date.split("-");
  let formattedDate = dateArray[2] + " " + monthNames[dateArray[1] - 1] + " " + dateArray[0];
  return formattedDate;
}
function todayUserTimeZone() {
  const now = /* @__PURE__ */ new Date();
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    // Dynamically get the user"s browser timezone
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
  return now.toLocaleDateString("en-CA", options);
}
function nDaysAgo(dateString) {
  if (!dateString) return "Has no start date";
  const startDate = new Date(dateString);
  const today = new Date(todayUserTimeZone());
  const daysAgo = (today - startDate) / (1e3 * 60 * 60 * 24);
  if (daysAgo > 1) return `${daysAgo} days ago`;
  if (daysAgo == 1) return "Yesterday";
  if (daysAgo == 0) return "Today";
  if (daysAgo == -1) return "Tomorrow";
  return `${-daysAgo} days from now`;
}
function nDaysLeft(dateString) {
  if (!dateString) return "Has no deadline";
  const deadline = new Date(dateString);
  const today = new Date(todayUserTimeZone());
  const daysLeft = (deadline - today) / (1e3 * 60 * 60 * 24);
  if (daysLeft > 1) return `${daysLeft} days left`;
  if (daysLeft == 1) return "Tomorrow";
  if (daysLeft == 0) return "Today";
  if (daysLeft == -1) return "Overdue yesterday";
  return `${-daysLeft} days overdue`;
}
var nDaysAgoDone = (dateString) => {
  if (!dateString) return "Has no done date";
  const doneDate = new Date(
    formattingDateProject(
      new Date(dateString * 1e3).toLocaleDateString("en-CA")
    )
  );
  const today = new Date(todayUserTimeZone());
  const daysAgo = Math.floor((today - doneDate) / (1e3 * 60 * 60 * 24));
  if (daysAgo > 1) return `${daysAgo} days ago`;
  if (daysAgo == 1) return "Yesterday";
  if (daysAgo == 0) return "Today";
  if (daysAgo == -1) return "Tomorrow";
  return `${-daysAgo} days from now`;
};
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
function getSemesterRange(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const semesterStartMonth = Math.floor(month / 6) * 6;
  const startOfSemester = new Date(year, semesterStartMonth, 1);
  const semesterEndMonth = semesterStartMonth + 5;
  const endOfSemester = new Date(year, semesterEndMonth + 1, 0);
  endOfSemester.setHours(23, 59, 59, 999);
  return { startOfSemester, endOfSemester };
}
function getYearRange(date) {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0);
  const endOfYear = new Date(year, 12, 0, 23, 59, 59, 999);
  return { startOfYear, endOfYear };
}
var daysInitial = ["S", "M", "T", "W", "T", "F", "S"];
var daysName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
var monthsName = [
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
function formattingDateObj(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const date = String(dateObj.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + date;
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
export {
  ALL,
  Priority,
  ProjectFilters,
  ProjectSorter,
  ReportsTimeRange,
  TaskFiltersPriority,
  TaskFiltersStatus,
  TaskFiltersTime,
  TaskSorter,
  TaskStatsKeyMap,
  daysInitial,
  daysName,
  defaultTaskFilters,
  formattingDateObj,
  formattingDateProject,
  formattingDateTask,
  getMonthRange,
  getQuarterRange,
  getSemesterRange,
  getWeekRange,
  getYearRange,
  monthNames,
  monthsName,
  nDaysAgo,
  nDaysAgoDone,
  nDaysLeft,
  todayUserTimeZone
};
