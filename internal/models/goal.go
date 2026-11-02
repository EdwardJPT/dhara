package models

type Goal struct {
	ID         int64  `json:"goal_id"`
	UserId     int64  `json:"user_id"`
	Title      string `json:"goal_title"`
	ProjectIds string `json:"project_ids"`
	CreatedAt  string `json:"created_at"`
}

type CreateGoalRequest struct {
	Goal       string  `json:"goal"`
	ProjectIds []int64 `json:"project_ids"`
}

type UpdateGoalRequest struct {
	Goal       string  `json:"goal"`
	ProjectIds []int64 `json:"project_ids"`
}
