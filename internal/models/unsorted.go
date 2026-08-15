package models

import (
	_ "github.com/mattn/go-sqlite3"
)

// UnsortedTask object based on the database schema
type UnsortedTask struct {
	ID            int64  `json:"unsorted_id"`
	UserId        int64  `json:"user_id"`
	UnsortedTitle string `json:"unsorted_title"`
	UnsortedDesc  string `json:"unsorted_desc"`
	Priority      bool   `json:"priority"`
	DueDate       string `json:"due_date"`
	IsDone        bool   `json:"is_done"`
	DoneDate      int    `json:"done_date"`
	CreatedAt     string `json:"created_at"`
}

type CreateUnsortedTask struct {
	UnsortedTitle string `json:"unsorted_title"`
	UnsortedDesc  string `json:"unsorted_desc"`
	Priority      string `json:"priority"`
	DueDate       string `json:"unsorted_due_date"`
}

type UpdateUnsortedStatusRequest struct {
	UnsortedId int64 `json:"unsorted_id"`
	IsDone     bool  `json:"checked"`
}

type AssignUnsortedTask struct {
	ProjectId  string `json:"project_id"`
	UnsortedId string `json:"unsorted_id"`
}

type DeleteUnsortedTask struct {
	UnsortedId int64 `json:"unsorted_id"`
}
