export type Project = {
    project_id: number;
    public_id: string;
    user_id: number;
    project_title: string;
    project_desc: string;
    priority: boolean;
    start_date: string;
    due_date: string;
    to_dos_all: number;
    to_dos_done: number;
    is_done: boolean;
    done_date: number;
    created_at: string;
    hide: boolean;
}
export type Task = {
    task_id: number;
    project_id: number;
    user_id: number;
    task_title: string;
    task_desc: string;
    priority: boolean;
    due_date: string;
    is_done: boolean;
    done_date: number;
    created_at: string;
}
export type TaskStats = {
    total_this_week: number;
    done_this_week: number;
    completed_this_week: number;
    total_this_month: number;
    done_this_month: number;
    completed_this_month: number;
    total_last_7_days: number;
    done_last_7_days: number;
    completed_last_7_days: number;
    total_last_30_days: number;
    done_last_30_days: number;
    completed_last_30_days: number;
    total_last_90_days: number;
    done_last_90_days: number;
    completed_last_90_days: number;
    total_last_180_days: number;
    done_last_180_days: number;
    completed_last_180_days: number;
    total_this_quarter: number;
    done_this_quarter: number;
    completed_this_quarter: number;
    total_this_semester: number;
    done_this_semester: number;
    completed_this_semester: number;
    total_this_year: number;
    done_this_year: number;
    completed_this_year: number;
    total_all_time: number;
    done_all_time: number;
    completed_all_time: number;
}
export type Habit = {
    habit_id: number;
    habits_group_id: number;
    user_id: number;
    habit_title: string;
    habit_icon: string;
    frequency: number;
    is_show: boolean;
    created_at: string;
}
export type HabitsGroupWithHabits = {
    habits_group_id: number;
    habits_group_title: string;
    is_show: boolean;
    created_at: string;
    habits: Habit[];
}
export type HabitDoneDate = {
    habit_date_id: number;
    done_date: string;
    check_in_created_at: string;
}
export type HabitWithDoneDates = {
    habit: Habit;
    done_dates: { [key: string]: HabitDoneDate };
}
export type HabitDoneToday = {
    habit_id: number;
    habits_group_id: number;
    habit_title: string;
    habit_icon: string;
    frequency: number;
    current_streak: number;
    total_completions: number;
    done_date: string;
    habit_created_date: string;
}
export type HabitPerformance = {
    habit_id: number;
    habit_title: string;
    habit_icon: string;
    count: number;
}
export type BestWorstReport = {
    best_habits: HabitPerformance[];
    worst_habits: HabitPerformance[];
}
export type HabitBestWorstStats = { [key: string]: BestWorstReport };
export type HabitStats = {
    habit_id: number;
    habit_title: string;
    created_at: string;
    frequency: number;
    this_week: number;
    this_month: number;
    last_7_days: number;
    last_30_days: number;
    last_90_days: number;
    last_180_days: number;
    current_quarter: number;
    current_semester: number;
    this_year: number;
    all_time: number;
}
export type GroupWithHabitsStats = {
    habits_group_id: number;
    habits_group_title: string;
    habits: HabitStats[];
}
export type ProductivityPeaks = {
    peak_hours: string;
    peak_days: string;
}
export type AllPeaksMap = { [key: string]: ProductivityPeaks }
export type MonthlyConsistency = {
    month: string;
    total_valid_days: number;
    total_done_days: number;
    consistency_percentage: number;
}
export type DayStats = {
    day_of_week: string;
    total_eligible: number;
    total_completed: number;
    consistency_rate: number;
}
export type WeeklyConsistency = { [key: string]: DayStats[] }
