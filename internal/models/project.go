package models

import (
	_ "github.com/mattn/go-sqlite3"
)

// Project object based on the database schema
type Project struct {
	ID        int64  `json:"project_id"`
	PublicId  string `json:"public_id"`
	UserId    int64  `json:"user_id"`
	Title     string `json:"project_title"`
	Desc      string `json:"project_desc"`
	Priority  bool   `json:"priority"`
	StartDate string `json:"start_date"`
	DueDate   string `json:"due_date"`
	ToDosAll  int    `json:"to_dos_all"`
	ToDosDone int    `json:"to_dos_done"`
	IsDone    bool   `json:"is_done"`
	DoneDate  int    `json:"done_date"`
	CreatedAt string `json:"created_at"`
}

// The shape of input when creating project from the /home/create-project
type CreateProjectRequest struct {
	UserId    int64  `json:"user_id"`
	Title     string `json:"project_title"`
	Desc      string `json:"project_desc"`
	StartDate string `json:"start_date"`
	DueDate   string `json:"due_date"`
	Priority  bool   `json:"priority"`
	// First Task
	TaskTitle    string `json:"task-title"`
	TaskDesc     string `json:"task-desc"`
	TaskDueDate  string `json:"task-due_date"`
	TaskPriority bool   `json:"task-priority"`
}

type InputProject struct {
	PublicId  string `json:"public_id"`
	UserId    int64  `json:"user_id"`
	Title     string `json:"project_title"`
	Desc      string `json:"project_desc"`
	Priority  bool   `json:"priority"`
	StartDate string `json:"start_date"`
	DueDate   string `json:"due_date"`
}

type ProjectTitle struct {
	PublicId string `json:"public_id"`
	Title    string `json:"project_title"`
}

type EditProjectRequest struct {
	ID        int64  `json:"project_id"`
	Title     string `json:"project_title"`
	Desc      string `json:"project_desc"`
	Priority  bool   `json:"priority"`
	StartDate string `json:"start_date"`
	DueDate   string `json:"due_date"`
	IsDone    bool   `json:"is_done"`
	DoneDate  int    `json:"done_date"`
}
