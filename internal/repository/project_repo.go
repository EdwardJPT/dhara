package repository

import (
	"database/sql"
	"errors"
	"math"

	"tasksmanagement/internal/database"
	"tasksmanagement/internal/models"
)

type ProjectRepository struct {
	db *sql.DB
}

func NewProjectRepository(db *sql.DB) *ProjectRepository {
	return &ProjectRepository{db: db}
}

func (r *ProjectRepository) GetUserProjects(userId int64) ([]models.Project, error) {
	query := `
		SELECT * FROM projects
		WHERE user_id = ?
		ORDER BY priority DESC, is_done ASC, project_id ASC
	`
	rows, err := r.db.Query(query, userId)
	if err != nil {
		return []models.Project{}, err
	}
	defer rows.Close()
	// Create a slice to hold the projects
	projects := []models.Project{}
	// Iterate over rows and scan into the struct
	for rows.Next() {
		var project models.Project
		if err := rows.Scan(
			&project.ID,
			&project.PublicId,
			&project.UserId,
			&project.Title,
			&project.Desc,
			&project.Priority,
			&project.StartDate,
			&project.DueDate,
			&project.ToDosAll,
			&project.ToDosDone,
			&project.IsDone,
			&project.DoneDate,
			&project.CreatedAt,
			&project.Hide,
		); err != nil {
			return []models.Project{}, err
		}
		projects = append(projects, project)
	}

	if err = rows.Err(); err != nil {
		return []models.Project{}, err
	}

	return projects, nil
}

func (r *ProjectRepository) GetUnfinishedPriorityCount(userId int64) int {
	query := `
		SELECT COUNT(project_id)
		FROM projects
		WHERE
			user_id = ?
			AND
			priority = 1
			AND
			is_done = 0
	`
	var count int
	err := r.db.QueryRow(query, userId).Scan(&count)
	// return big number so user can't create a priority project
	if err != nil {
		return math.MaxInt32
	}
	return count
}

func (r *ProjectRepository) Create(formData models.InputProject, db database.DBTX) (int64, error) {
	var query string
	var err error
	var res sql.Result
	if formData.StartDate == "" {
		query = `INSERT INTO projects (
			public_id,
			user_id,
			project_title,
			project_desc,
			priority,
			due_date
		) VALUES (?, ?, ?, ?, ?, ?)`
		// no need to insert to_dos_all first value because we already wrote triggers
		res, err = db.Exec(
			query,
			formData.PublicId,
			formData.UserId,
			formData.Title,
			formData.Desc,
			formData.Priority,
			formData.DueDate,
		)
	} else {
		query = `INSERT INTO projects (
			public_id,
			user_id,
			project_title,
			project_desc,
			priority,
			start_date,
			due_date
		) VALUES (?, ?, ?, ?, ?, ?, ?)`
		// to_dos_all first value is 0 because we already wrote triggers
		res, err = db.Exec(
			query,
			formData.PublicId,
			formData.UserId,
			formData.Title,
			formData.Desc,
			formData.Priority,
			formData.StartDate,
			formData.DueDate,
		)
	}
	if err != nil {
		return 0, err
	}
	// Get the rowid for inserting the task
	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}
	return id, nil
}

func (r *ProjectRepository) GetProjectByNanoID(userId int64, nanoid string) (models.Project, error) {
	query := `
		SELECT * FROM projects
		WHERE public_id = ? AND user_id = ?
		ORDER BY priority DESC, is_done ASC
	`
	row := r.db.QueryRow(query, nanoid, userId)
	var project models.Project
	if err := row.Scan(
		&project.ID,
		&project.PublicId,
		&project.UserId,
		&project.Title,
		&project.Desc,
		&project.Priority,
		&project.StartDate,
		&project.DueDate,
		&project.ToDosAll,
		&project.ToDosDone,
		&project.IsDone,
		&project.DoneDate,
		&project.CreatedAt,
		&project.Hide,
	); err != nil {
		return models.Project{}, err
	}
	return project, nil
}

func (r *ProjectRepository) Update(userId, projectId int64, req models.EditProjectRequest) error {
	query := `
		UPDATE projects
		SET
			project_title = ?,
			project_desc = ?,
			priority = ?,
			start_date = ?,
			due_date = ?,
			is_done = ?,
			done_date = ?,
			hide = ?
		WHERE project_id = ? AND user_id = ?
	`
	res, err := r.db.Exec(
		query,
		req.Title,
		req.Desc,
		req.Priority,
		req.StartDate,
		req.DueDate,
		req.IsDone,
		req.DoneDate,
		req.Hide,
		projectId,
		userId,
	)
	if err != nil {
		return err
	}
	rowAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowAffected != 1 {
		return errors.New("updated project more than 1 rows")
	}
	return nil
}
