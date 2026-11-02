package repository

import (
	"database/sql"

	"tasksmanagement/internal/database"
	"tasksmanagement/internal/models"
)

type GoalRepository struct {
	db *sql.DB
}

func NewGoalRepository(db *sql.DB) *GoalRepository {
	return &GoalRepository{db: db}
}

func (r *GoalRepository) CanAttachProject(userId, projectId int64, includeFinished bool, db database.DBTX) (bool, error) {
	query := `
		SELECT EXISTS (
			SELECT 1 FROM projects
			WHERE project_id = ? AND user_id = ? AND (is_done = 0 OR ?)
		)
	`
	var canAttach bool
	err := db.QueryRow(query, projectId, userId, includeFinished).Scan(&canAttach)
	return canAttach, err
}

func (r *GoalRepository) Create(userId int64, title, projectIds string, db database.DBTX) error {
	query := `
		INSERT INTO goals (user_id, goal_title, project_ids)
		VALUES (?, ?, ?)
	`
	_, err := db.Exec(query, userId, title, projectIds)
	return err
}

func (r *GoalRepository) Update(userId, goalId int64, title, projectIds string, db database.DBTX) (int64, error) {
	query := `
		UPDATE goals SET goal_title = ?, project_ids = ?
		WHERE goal_id = ? AND user_id = ?
	`
	result, err := db.Exec(query, title, projectIds, goalId, userId)
	if err != nil {
		return 0, err
	}
	return result.RowsAffected()
}

func (r *GoalRepository) Delete(userId, goalId int64) (int64, error) {
	result, err := r.db.Exec(`DELETE FROM goals WHERE goal_id = ? AND user_id = ?`, goalId, userId)
	if err != nil {
		return 0, err
	}
	return result.RowsAffected()
}

func (r *GoalRepository) GetUserGoals(userId int64) ([]models.Goal, error) {
	query := `
		SELECT goal_id, user_id, goal_title, project_ids, created_at
		FROM goals
		WHERE user_id = ?
		ORDER BY goal_id ASC
	`
	rows, err := r.db.Query(query, userId)
	if err != nil {
		return []models.Goal{}, err
	}
	defer rows.Close()

	goals := []models.Goal{}
	for rows.Next() {
		var goal models.Goal
		if err := rows.Scan(
			&goal.ID,
			&goal.UserId,
			&goal.Title,
			&goal.ProjectIds,
			&goal.CreatedAt,
		); err != nil {
			return []models.Goal{}, err
		}
		goals = append(goals, goal)
	}
	if err := rows.Err(); err != nil {
		return []models.Goal{}, err
	}
	return goals, nil
}
