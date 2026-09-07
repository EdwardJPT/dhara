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
export interface HabitWithGroup {
    habit_id: number;
    habit_title: string;
    habit_icon: string;
    habit_frequency: number;
    habit_is_show: boolean;
    habits_group_title: string;
}