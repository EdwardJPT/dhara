
export interface Project {
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
}
export interface Task {
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
export interface UnsortedTask {
    unsorted_id: number;
    user_id: number;
    unsorted_title: string;
    unsorted_desc: string;
    priority: boolean;
    due_date: string;
    is_done: boolean;
    done_date: number;
    created_at: string;
}
export interface Habit {
    habit_id: number;
    habits_group_id: number;
    user_id: number;
    habit_title: string;
    habit_icon: string;
    frequency: number;
    is_show: boolean;
    created_at: string;
}
export interface HabitsGroupWithHabits {
    habits_group_id: number;
    habits_group_title: string;
    is_show: boolean;
    created_at: string;
    habits: Habit[];
}
export interface HabitDoneDate {
    habit_date_id: number;
    done_date: string;
    check_in_created_at: string;
}
export interface HabitWithDoneDates {
    habit: Habit;
    done_dates: {[key: string]: HabitDoneDate};
}