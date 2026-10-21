package models

import (
	_ "github.com/mattn/go-sqlite3"
)

// Task object based on the database schema
type Task struct {
	ID        int64  `json:"task_id"`
	ProjectId int64  `json:"project_id"`
	UserId    int64  `json:"user_id"`
	TaskTitle string `json:"task_title"`
	TaskDesc  string `json:"task_desc"`
	Priority  bool   `json:"priority"`
	DueDate   string `json:"due_date"`
	IsDone    bool   `json:"is_done"`
	DoneDate  int    `json:"done_date"`
	CreatedAt string `json:"created_at"`
}

type FirstTask struct {
	ProjectId   int64  `json:"project_id"`
	UserId      int64  `json:"user_id"`
	TaskTitle   string `json:"task_title"`
	TaskDesc    string `json:"task_desc"`
	TaskDueDate string `json:"due_date"`
	Priority    bool   `json:"priority"`
}

type UpdateTaskStatusRequest struct {
	TaskId     int64 `json:"taskId"`
	DoneStatus bool  `json:"doneStatus"`
	ProjectId  int64 `json:"projectId"`
}

type UpdateTaskDueRequest struct {
	TaskId      int64  `json:"taskId"`
	TaskDueDate string `json:"due_date"`
}

type InputAddTask struct {
	TaskTitle   string `json:"task_title"`
	TaskDesc    string `json:"task_desc"`
	TaskDueDate string `json:"due_date"`
	Priority    bool   `json:"priority"`
}

type AddTaskRequest struct {
	TaskData  []InputAddTask `json:"task_data"`
	ProjectId int64          `json:"projectId"`
}

type UpdateTaskRequest struct {
	TaskTitle    string `json:"task_title"`
	TaskDesc     string `json:"task_desc"`
	TaskPriority bool   `json:"task_priority"`
	TaskDueDate  string `json:"task_due_date"`
	TaskIsDone   bool   `json:"task_is_done"`
	TaskDoneDate int    `json:"task_done_date"`
}

type TasksWithProject struct {
	TaskID          int64  `json:"task_id"`
	TaskTitle       string `json:"task_title"`
	TaskDesc        string `json:"task_desc"`
	TaskPriority    bool   `json:"task_priority"`
	TaskDueDate     string `json:"task_due_date"`
	TaskIsDone      bool   `json:"task_is_done"`
	TaskDoneDate    int    `json:"task_done_date"`
	ProjectTitle    string `json:"project_title"`
	ProjectPriority bool   `json:"project_priority"`
	ProjectDueDate  string `json:"project_due_date"`
	ProjectIsDone   bool   `json:"project_is_done"`
	ProjectDoneDate int    `json:"project_done_date"`
}

type TaskStats struct {
	ThisWeekTotal            int `json:"total_this_week"`
	ThisWeekDone             int `json:"done_this_week"`
	ThisWeekCompleted        int `json:"completed_this_week"`

	ThisMonthTotal           int `json:"total_this_month"`
	ThisMonthDone            int `json:"done_this_month"`
	ThisMonthCompleted       int `json:"completed_this_month"`

	Last7DaysTotal           int `json:"total_last_7_days"`
	Last7DaysDone            int `json:"done_last_7_days"`
	Last7DaysCompleted       int `json:"completed_last_7_days"`

	Last30DaysTotal          int `json:"total_last_30_days"`
	Last30DaysDone           int `json:"done_last_30_days"`
	Last30DaysCompleted      int `json:"completed_last_30_days"`

	Last90DaysTotal          int `json:"total_last_90_days"`
	Last90DaysDone           int `json:"done_last_90_days"`
	Last90DaysCompleted      int `json:"completed_last_90_days"`

	Last180DaysTotal         int `json:"total_last_180_days"`
	Last180DaysDone          int `json:"done_last_180_days"`
	Last180DaysCompleted     int `json:"completed_last_180_days"`

	CurrentQuarterTotal      int `json:"total_this_quarter"`
	CurrentQuarterDone       int `json:"done_this_quarter"`
	CurrentQuarterCompleted  int `json:"completed_this_quarter"`

	CurrentSemesterTotal     int `json:"total_this_semester"`
	CurrentSemesterDone      int `json:"done_this_semester"`
	CurrentSemesterCompleted int `json:"completed_this_semester"`

	ThisYearTotal            int `json:"total_this_year"`
	ThisYearDone             int `json:"done_this_year"`
	ThisYearCompleted        int `json:"completed_this_year"`

	AllTimeTotal             int `json:"total_all_time"`
	AllTimeDone              int `json:"done_all_time"`
	AllTimeCompleted         int `json:"completed_all_time"`
}
