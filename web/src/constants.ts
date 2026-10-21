export const ALL = "all";
export const Priority = "priority";

export const ProjectFilters = {
    ALL,
    Unfinished: "unfinished",
    Finished: "finished",
    Overdue: "overdue",
} as const;

export const ProjectSorter = {
    Skip: "",
    DueDateAsc: "dueDateAsc",
    DueDateDesc: "dueDateDesc",
    DoneDateAsc: "doneDateAsc",
    DoneDateDesc: "doneDateDesc",
    StartDateAsc: "startDateAsc",
    StartDateDesc: "startDateDesc",
    CompletionAsc: "completionAsc",
    CompletionDesc: "completionDesc",
    Priority,
} as const;

export const TaskFiltersPriority = { ALL, Priority } as const;

export const TaskFiltersStatus = {
    ALL,
    Unfinished: "unfinished",
    Finished: "finished",
    Overdue: "overdue",
} as const;

export const TaskFiltersTime = {
    ALL,
    Today: "today",
    ThisWeek: "week",
    SevenDays: "7days",
    ThisMonth: "month",
    ThirtyDays: "30days",
    ThisQuarter: "quarter",
    ThisYear: "year",
} as const;

export const TaskSorter = {
    Skip: "",
    DueDateAsc: "dueDateAsc",
    DueDateDesc: "dueDateDesc",
    DoneDateAsc: "doneDateAsc",
    DoneDateDesc: "doneDateDesc",
    Priority: "priority",
} as const;

export const defaultTaskFilters = {
    selectedProject: ALL,
    priority: ALL,
    status: ALL,
    time: TaskFiltersTime.Today,
} as const;

export const monthNames = [
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
    "December",
] as const;

export const shortMonthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
] as const;

export const daysName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
] as const;

export const daysInitial = ["S", "M", "T", "W", "T", "F", "S"] as const;

// Don't rearrange this object because it's also rearrange the drop down elements
// on the TimeToggle front end component
export const ReportsTimeRange = {
    ThisWeek: "Week",
    ThisMonth: "Month",
    ThreeMonths: "3 Months",
    SixMonths: "6 Months",
    SevenDays: "Last 7 days",
    ThirtyDays: "Last 30 days",
    NinetyDays: "Last 90 days",
    HundredEightyDays: "Last 180 days",
    ThisYear: "This Year",
    ALL: "All",
} as const;

// Bridge the above objects with the json from back end
export const TaskStatsKeyMap = {
    [ReportsTimeRange.ThisWeek]: {
        total: "total_this_week",
        done: "done_this_week",
        completed: "completed_this_week",
    },
    [ReportsTimeRange.ThisMonth]: {
        total: "total_this_month",
        done: "done_this_month",
        completed: "completed_this_month",
    },
    [ReportsTimeRange.ThreeMonths]: {
        total: "total_this_quarter",
        done: "done_this_quarter",
        completed: "completed_this_quarter",
    },
    [ReportsTimeRange.SixMonths]: {
        total: "total_this_semester",
        done: "done_this_semester",
        completed: "completed_this_semester",
    },
    [ReportsTimeRange.SevenDays]: {
        total: "total_last_7_days",
        done: "done_last_7_days",
        completed: "completed_last_7_days",
    },
    [ReportsTimeRange.ThirtyDays]: {
        total: "total_last_30_days",
        done: "done_last_30_days",
        completed: "completed_last_30_days",
    },
    [ReportsTimeRange.NinetyDays]: {
        total: "total_last_90_days",
        done: "done_last_90_days",
        completed: "completed_last_90_days",
    },
    [ReportsTimeRange.HundredEightyDays]: {
        total: "total_last_180_days",
        done: "done_last_180_days",
        completed: "completed_last_180_days",
    },
    [ReportsTimeRange.ThisYear]: {
        total: "total_this_year",
        done: "done_this_year",
        completed: "completed_this_year",
    },
    [ReportsTimeRange.ALL]: {
        total: "total_all_time",
        done: "done_all_time",
        completed: "completed_all_time",
    },
} as const;
