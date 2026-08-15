package repository

import (
	"database/sql"
	"errors"

	"tasksmanagement/internal/database"
	"tasksmanagement/internal/models"
)

type UnsortedRepository struct {
	db *sql.DB
}

func NewUnsortedRepository(db *sql.DB) *UnsortedRepository {
	return &UnsortedRepository{db: db}
}

func (r *UnsortedRepository) Create(userId int64, req models.CreateUnsortedTask) (int64, error) {
	query := `
		INSERT INTO unsorted (
			user_id,
			unsorted_title,
			unsorted_desc,
			priority,
			due_date
		) VALUES (?, ?, ?, ?, ?)
	`
	res, err := r.db.Exec(
		query,
		userId,
		req.UnsortedTitle,
		req.UnsortedDesc,
		req.Priority == "on",
		req.DueDate,
	)
	if err != nil {
		return 0, err
	}
	// Get the rowid for updating the unsorted in the frontend
	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}
	return id, nil
}

func (r *UnsortedRepository) GetUserUnsorteds(userId int64) ([]models.UnsortedTask, error) {
	query := `
		SELECT * FROM unsorted
		WHERE user_id = ?
		ORDER BY is_done ASC, priority DESC, due_date ASC, done_date DESC
	`
	rows, err := r.db.Query(query, userId)
	if err != nil {
		return []models.UnsortedTask{}, err
	}
	defer rows.Close()
	// Create a slice to hold the tasks
	unsorteds := []models.UnsortedTask{}
	// Iterate over rows and scan into the struct
	for rows.Next() {
		var unsorted models.UnsortedTask
		if err := rows.Scan(
			&unsorted.ID,
			&unsorted.UserId,
			&unsorted.UnsortedTitle,
			&unsorted.UnsortedDesc,
			&unsorted.Priority,
			&unsorted.DueDate,
			&unsorted.IsDone,
			&unsorted.DoneDate,
			&unsorted.CreatedAt,
		); err != nil {
			return []models.UnsortedTask{}, err
		}
		unsorteds = append(unsorteds, unsorted)
	}

	if err = rows.Err(); err != nil {
		return []models.UnsortedTask{}, err
	}

	return unsorteds, nil
}

func (r *UnsortedRepository) UpdateStatus(unsortedStatusReq models.UpdateUnsortedStatusRequest, userId int64) error {
	query := `
		UPDATE unsorted
		SET
			is_done = ?,
			done_date = CASE
				WHEN done_date = 0 AND is_done = 0 THEN UNIXEPOCH()
				ELSE 0
			END
		WHERE unsorted_id = ? AND user_id = ?
	`
	res, err := r.db.Exec(
		query,
		unsortedStatusReq.IsDone,
		unsortedStatusReq.UnsortedId,
		userId,
	)
	if err != nil {
		return err
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return errors.New("unsorted task not found")
	}
	return nil
}

// Return the whole unsorted task and not just the id is because we call this
// function in 2 places. First is when delete the unsorted itself, and second
// is when we assign the unsorted to a specific project
func (r *UnsortedRepository) Delete(userId int64, unsortedId int64, tx database.DBTX) (models.UnsortedTask, error) {
	// conditional for transacation
	var dbtx database.DBTX = r.db
	if tx != nil {
		dbtx = tx
	}
	query := `
		DELETE FROM unsorted
		WHERE unsorted_id = ? AND user_id = ?
		RETURNING *
	`
	// Get the rowid for the frontend
	unsorted := models.UnsortedTask{}
	if err := dbtx.QueryRow(query, unsortedId, userId).Scan(
		&unsorted.ID,
		&unsorted.UserId,
		&unsorted.UnsortedTitle,
		&unsorted.UnsortedDesc,
		&unsorted.Priority,
		&unsorted.DueDate,
		&unsorted.IsDone,
		&unsorted.DoneDate,
		&unsorted.CreatedAt,
	); err != nil {
		return models.UnsortedTask{}, err
	}
	return unsorted, nil
}

func (r *UnsortedRepository) GetUserUnsortedsWithDueDates(userId int64) (map[string][]models.UnsortedTask, error) {
	query := `
		SELECT * FROM unsorted
		WHERE user_id = ?
		ORDER BY is_done ASC, done_date DESC, due_date ASC, priority DESC
	`
	rows, err := r.db.Query(query, userId)
	if err != nil {
		return map[string][]models.UnsortedTask{}, err
	}
	defer rows.Close()

	dueDatesWithUnsorteds := make(map[string][]models.UnsortedTask)

	// Iterate over rows and scan into the struct
	for rows.Next() {
		var unsorted models.UnsortedTask
		if err := rows.Scan(
			&unsorted.ID,
			&unsorted.UserId,
			&unsorted.UnsortedTitle,
			&unsorted.UnsortedDesc,
			&unsorted.Priority,
			&unsorted.DueDate,
			&unsorted.IsDone,
			&unsorted.DoneDate,
			&unsorted.CreatedAt,
		); err != nil {
			return map[string][]models.UnsortedTask{}, err
		}
		// Group by due_date
		dueDate := unsorted.DueDate
		if _, exists := dueDatesWithUnsorteds[dueDate]; !exists {
			dueDatesWithUnsorteds[dueDate] = []models.UnsortedTask{unsorted}
		} else {
			dueDatesWithUnsorteds[dueDate] = append(dueDatesWithUnsorteds[dueDate], unsorted)
		}
	}

	if err = rows.Err(); err != nil {
		return map[string][]models.UnsortedTask{}, err
	}

	return dueDatesWithUnsorteds, nil
}
