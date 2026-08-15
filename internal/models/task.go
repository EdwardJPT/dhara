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
	ThisWeekTotal        int `json:"thisWeekTotal"`
	ThisWeekDone         int `json:"thisWeekDone"`
	ThisMonthTotal       int `json:"thisMonthTotal"`
	ThisMonthDone        int `json:"thisMonthDone"`
	Last7DaysTotal       int `json:"last7DaysTotal"`
	Last7DaysDone        int `json:"last7DaysDone"`
	Last30DaysTotal      int `json:"last30DaysTotal"`
	Last30DaysDone       int `json:"last30DaysDone"`
	Last90DaysTotal      int `json:"last90DaysTotal"`
	Last90DaysDone       int `json:"last90DaysDone"`
	Last180DaysTotal     int `json:"last180DaysTotal"`
	Last180DaysDone      int `json:"last180DaysDone"`
	CurrentQuarterTotal  int `json:"currentQuarterTotal"`
	CurrentQuarterDone   int `json:"currentQuarterDone"`
	CurrentSemesterTotal int `json:"currentSemesterTotal"`
	CurrentSemesterDone  int `json:"currentSemesterDone"`
	ThisYearTotal        int `json:"thisYearTotal"`
	ThisYearDone         int `json:"thisYearDone"`
	AllTimeTotal         int `json:"allTimeTotal"`
	AllTimeDone          int `json:"allTimeDone"`
}
