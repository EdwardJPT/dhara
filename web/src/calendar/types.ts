export type TasksWithProject = {
    task_id: number;
    task_title: string;
    task_desc: string;
    task_priority: boolean;
    task_due_date: string;
    task_is_done: boolean;
    task_done_date: number;
    project_title: string;
    project_priority: boolean;
    project_due_date: string;
    project_is_done: boolean;
    project_done_date: number;
}
export type UnsortedTask = {
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
export type HabitDoneInfo = {
    HabitID: number;
    HabitTitle: string;
    HabitIcon: string;
    DoneDate: string;
}