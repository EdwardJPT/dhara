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
