package repository

import (
	"database/sql"
	"errors"
	"strings"

	"tasksmanagement/internal/database"
	"tasksmanagement/internal/models"
)

type TaskRepository struct {
	db *sql.DB
}

func NewTaskRepository(db *sql.DB) *TaskRepository {
	return &TaskRepository{db: db}
}

func (r *TaskRepository) GetUserTasks(userId int64) ([]models.Task, error) {
	query := `
		SELECT * FROM tasks
		WHERE user_id = ?
		ORDER BY project_id ASC, due_date ASC, priority DESC
	`
	rows, err := r.db.Query(query, userId)
	if err != nil {
		return []models.Task{}, err
	}
	defer rows.Close()
	// Create a slice to hold the tasks
	tasks := []models.Task{}
	// Iterate over rows and scan into the struct
	for rows.Next() {
		var task models.Task
		if err := rows.Scan(
			&task.ID,
			&task.ProjectId,
			&task.UserId,
			&task.TaskTitle,
			&task.TaskDesc,
			&task.Priority,
			&task.DueDate,
			&task.IsDone,
			&task.DoneDate,
			&task.CreatedAt,
		); err != nil {
			return []models.Task{}, err
		}
		tasks = append(tasks, task)
	}

	if err = rows.Err(); err != nil {
		return []models.Task{}, err
	}

	return tasks, nil
}

func (r *TaskRepository) Create(taskData models.FirstTask, db database.DBTX) (int64, error) {
	query := `
		INSERT INTO tasks (
			project_id,
			user_id,
			task_title,
			task_desc,
			due_date,
			priority
		) VALUES (?, ?, ?, ?, ?, ?)
	`
	res, err := db.Exec(
		query,
		taskData.ProjectId,
		taskData.UserId,
		taskData.TaskTitle,
		taskData.TaskDesc,
		taskData.TaskDueDate,
		taskData.Priority,
	)
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

func (r *TaskRepository) GetProjectTasks(userId, projectId int64) ([]models.Task, error) {
	query := `
		SELECT * FROM tasks
		WHERE user_id = ? AND project_id = ?
		ORDER BY project_id ASC, due_date ASC, priority DESC
	`
	rows, err := r.db.Query(query, userId, projectId)
	if err != nil {
		return []models.Task{}, err
	}
	defer rows.Close()
	var tasks []models.Task
	for rows.Next() {
		var task models.Task
		if err := rows.Scan(
			&task.ID,
			&task.ProjectId,
			&task.UserId,
			&task.TaskTitle,
			&task.TaskDesc,
			&task.Priority,
			&task.DueDate,
			&task.IsDone,
			&task.DoneDate,
			&task.CreatedAt,
		); err != nil {
			return []models.Task{}, err
		}
		tasks = append(tasks, task)
	}

	if err = rows.Err(); err != nil {
		return []models.Task{}, err
	}

	return tasks, nil
}

func (r *TaskRepository) UpdateStatus(taskStatusReq models.UpdateTaskStatusRequest, userId int64) error {
	query := `
		UPDATE tasks
		SET
			is_done = ?,
			done_date = CASE
		        WHEN done_date = 0 AND is_done = 0 THEN UNIXEPOCH()
				ELSE 0
			END
		WHERE task_id = ? AND user_id = ?
	`
	res, err := r.db.Exec(
		query,
		taskStatusReq.DoneStatus,
		taskStatusReq.TaskId,
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
		return errors.New("task not found")
	}
	return nil
}

func (r *TaskRepository) UpdateDueDate(taskDueDateReq models.UpdateTaskDueRequest, userId int64) error {
	query := `
		UPDATE tasks
		SET due_date = ?
		WHERE task_id = ? AND user_id = ?
	`
	res, err := r.db.Exec(
		query,
		taskDueDateReq.TaskDueDate,
		taskDueDateReq.TaskId,
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
		return errors.New("task not found")
	}
	return nil
}

func (r *TaskRepository) CreateWithUnsorted(taskData models.UnsortedTask, projectId int64, tx database.DBTX) (models.Task, error) {
	query := `INSERT INTO tasks (
		project_id,
		user_id,
		task_title,
		task_desc,
		due_date,
		priority,
		is_done,
		done_date,
		created_at
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
	row := tx.QueryRow(
		query,
		projectId,
		taskData.UserId,
		taskData.UnsortedTitle,
		taskData.UnsortedDesc,
		taskData.DueDate,
		taskData.Priority,
		taskData.IsDone,
		taskData.DoneDate,
		taskData.CreatedAt,
	)
	task := models.Task{}
	if err := row.Scan(
		&task.ID,
		&task.ProjectId,
		&task.UserId,
		&task.TaskTitle,
		&task.TaskDesc,
		&task.Priority,
		&task.DueDate,
		&task.IsDone,
		&task.DoneDate,
		&task.CreatedAt,
	); err != nil {
		return models.Task{}, err
	}
	return task, nil
}

func (r *TaskRepository) CreateTasks(taskData []models.InputAddTask, projectId, userId int64, tx *sql.Tx) (int, error) {
	query := `INSERT INTO tasks (
		project_id,
		user_id,
		task_title,
		task_desc,
		due_date,
		priority
	) VALUES (?, ?, ?, ?, ?, ?)`
	stmt, err := tx.Prepare(query)
	if err != nil {
		return 0, err
	}
	defer stmt.Close()

	inputLength := len(taskData)
	insertCount := 0
	for i := range inputLength {
		_, err := stmt.Exec(
			projectId,
			userId,
			taskData[i].TaskTitle,
			taskData[i].TaskDesc,
			taskData[i].TaskDueDate,
			taskData[i].Priority,
		)
		if err != nil {
			return 0, err
		}
		insertCount++
	}
	return insertCount, nil
}

func (r *TaskRepository) GetUserTasksWithDueDates(userId int64) (map[string][]models.TasksWithProject, error) {
	query := `
		SELECT
			t.task_id,
			t.task_title,
			t.task_desc,
			t.priority,
			t.due_date,
			t.is_done,
			t.done_date,
			p.project_title,
			p.priority,
			p.due_date,
			p.is_done,
			p.done_date
		FROM tasks t
		LEFT JOIN projects p
			ON t.project_id = p.project_id
		WHERE t.user_id = ? AND p.user_id = ?
		ORDER BY t.due_date ASC, t.done_date ASC, t.priority DESC
	`
	rows, err := r.db.Query(query, userId, userId)
	if err != nil {
		return map[string][]models.TasksWithProject{}, err
	}
	defer rows.Close()

	dueDatesWithTasks := make(map[string][]models.TasksWithProject)

	for rows.Next() {
		var twp models.TasksWithProject
		err := rows.Scan(
			&twp.TaskID,
			&twp.TaskTitle,
			&twp.TaskDesc,
			&twp.TaskPriority,
			&twp.TaskDueDate,
			&twp.TaskIsDone,
			&twp.TaskDoneDate,
			&twp.ProjectTitle,
			&twp.ProjectPriority,
			&twp.ProjectDueDate,
			&twp.ProjectIsDone,
			&twp.ProjectDoneDate,
		)
		if err != nil {
			return map[string][]models.TasksWithProject{}, err
		}
		// Group by due_date
		dueDate := twp.TaskDueDate
		if _, exists := dueDatesWithTasks[dueDate]; !exists {
			dueDatesWithTasks[dueDate] = []models.TasksWithProject{twp}
		} else {
			dueDatesWithTasks[dueDate] = append(dueDatesWithTasks[dueDate], twp)
		}
	}

	if err = rows.Err(); err != nil {
		return map[string][]models.TasksWithProject{}, err
	}

	return dueDatesWithTasks, nil
}

func (r *TaskRepository) Update(userId, taskId int64, req models.UpdateTaskRequest) error {
	query := `
		UPDATE tasks
		SET
			task_title = ?,
			task_desc = ?,
			priority = ?,
			due_date = ?,
			is_done = ?,
			done_date = ?
		WHERE task_id = ? AND user_id = ?
	`
	res, err := r.db.Exec(
		query,
		req.TaskTitle,
		req.TaskDesc,
		req.TaskPriority,
		req.TaskDueDate,
		req.TaskIsDone,
		req.TaskDoneDate,
		taskId,
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
		return errors.New("task not found")
	}
	return nil
}

func (r *TaskRepository) Delete(userId, taskId int64) error {
	query := `DELETE FROM tasks WHERE task_id = ? AND user_id = ?`
	res, err := r.db.Exec(query, taskId, userId)
	if err != nil {
		return err
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return errors.New("task not found")
	}
	return nil
}

func (r *TaskRepository) GetTaskStatsByUserID(userID int64, offset, inverseOffset string) (*models.TaskStats, error) {
	queryTemplate := `
		SELECT
			-- ====== THIS WEEK ======
			COALESCE(SUM(
				CASE WHEN due_date >= datetime(date('now', '@USER_OFFSET', '-' || strftime('%w', 'now', '@USER_OFFSET') || ' days'), '@INVERSE_OFFSET')
					  AND due_date < datetime(date('now', '@USER_OFFSET', '+' || (7 - strftime('%w', 'now', '@USER_OFFSET')) || ' days'), '@INVERSE_OFFSET')
					 THEN 1 ELSE 0 END
			), 0) AS total_this_week,

			COALESCE(SUM(
				CASE WHEN due_date >= datetime(date('now', '@USER_OFFSET', '-' || strftime('%w', 'now', '@USER_OFFSET') || ' days'), '@INVERSE_OFFSET')
					  AND due_date < datetime(date('now', '@USER_OFFSET', '+' || (7 - strftime('%w', 'now', '@USER_OFFSET')) || ' days'), '@INVERSE_OFFSET')
					  AND is_done = 1
					 THEN 1 ELSE 0 END
			), 0) AS done_this_week,

			-- ====== THIS MONTH ======
			COALESCE(SUM(
				CASE WHEN strftime('%Y-%m', due_date, '@USER_OFFSET') = strftime('%Y-%m', 'now', '@USER_OFFSET')
					 THEN 1 ELSE 0 END
			), 0) AS total_this_month,

			COALESCE(SUM(
				CASE WHEN strftime('%Y-%m', due_date, '@USER_OFFSET') = strftime('%Y-%m', 'now', '@USER_OFFSET')
					  AND is_done = 1
					 THEN 1 ELSE 0 END
			), 0) AS done_this_month,

			-- ====== LAST 7 DAYS ======
			COALESCE(SUM(
				CASE WHEN due_date >= datetime(date('now', '@USER_OFFSET', '-7 days'), '@INVERSE_OFFSET')
					  AND due_date < datetime(date('now', '@USER_OFFSET', '+1 day'), '@INVERSE_OFFSET')
					 THEN 1 ELSE 0 END
			), 0) AS total_last_7_days,

			COALESCE(SUM(
				CASE WHEN due_date >= datetime(date('now', '@USER_OFFSET', '-7 days'), '@INVERSE_OFFSET')
					  AND due_date < datetime(date('now', '@USER_OFFSET', '+1 day'), '@INVERSE_OFFSET')
					  AND is_done = 1
					 THEN 1 ELSE 0 END
			), 0) AS done_last_7_days,

			-- ====== LAST 30 DAYS ======
			COALESCE(SUM(
				CASE WHEN due_date >= datetime(date('now', '@USER_OFFSET', '-30 days'), '@INVERSE_OFFSET')
					  AND due_date < datetime(date('now', '@USER_OFFSET', '+1 day'), '@INVERSE_OFFSET')
					 THEN 1 ELSE 0 END
			), 0) AS total_last_30_days,

			COALESCE(SUM(
				CASE WHEN due_date >= datetime(date('now', '@USER_OFFSET', '-30 days'), '@INVERSE_OFFSET')
					  AND due_date < datetime(date('now', '@USER_OFFSET', '+1 day'), '@INVERSE_OFFSET')
					  AND is_done = 1
					 THEN 1 ELSE 0 END
			), 0) AS done_last_30_days,

			-- ====== LAST 90 DAYS ======
			COALESCE(SUM(
				CASE WHEN due_date >= datetime(date('now', '@USER_OFFSET', '-90 days'), '@INVERSE_OFFSET')
					  AND due_date < datetime(date('now', '@USER_OFFSET', '+1 day'), '@INVERSE_OFFSET')
					 THEN 1 ELSE 0 END
			), 0) AS total_last_90_days,

			COALESCE(SUM(
				CASE WHEN due_date >= datetime(date('now', '@USER_OFFSET', '-90 days'), '@INVERSE_OFFSET')
					  AND due_date < datetime(date('now', '@USER_OFFSET', '+1 day'), '@INVERSE_OFFSET')
					  AND is_done = 1
					 THEN 1 ELSE 0 END
			), 0) AS done_last_90_days,

			-- ====== LAST 180 DAYS ======
			COALESCE(SUM(
				CASE WHEN due_date >= datetime(date('now', '@USER_OFFSET', '-180 days'), '@INVERSE_OFFSET')
					  AND due_date < datetime(date('now', '@USER_OFFSET', '+1 day'), '@INVERSE_OFFSET')
					 THEN 1 ELSE 0 END
			), 0) AS total_last_180_days,

			COALESCE(SUM(
				CASE WHEN due_date >= datetime(date('now', '@USER_OFFSET', '-180 days'), '@INVERSE_OFFSET')
					  AND due_date < datetime(date('now', '@USER_OFFSET', '+1 day'), '@INVERSE_OFFSET')
					  AND is_done = 1
					 THEN 1 ELSE 0 END
			), 0) AS done_last_180_days,

			-- ====== THIS QUARTER ======
			COALESCE(SUM(
				CASE WHEN strftime('%Y', due_date, '@USER_OFFSET') = strftime('%Y', 'now', '@USER_OFFSET')
					  AND (strftime('%m', due_date, '@USER_OFFSET') + 2) / 3 = (strftime('%m', 'now', '@USER_OFFSET') + 2) / 3
					 THEN 1 ELSE 0 END
			), 0) AS total_this_quarter,

			COALESCE(SUM(
				CASE WHEN strftime('%Y', due_date, '@USER_OFFSET') = strftime('%Y', 'now', '@USER_OFFSET')
					  AND (strftime('%m', due_date, '@USER_OFFSET') + 2) / 3 = (strftime('%m', 'now', '@USER_OFFSET') + 2) / 3
					  AND is_done = 1
					 THEN 1 ELSE 0 END
			), 0) AS done_this_quarter,

			-- ====== THIS SEMESTER (HALF-YEAR) ======
			COALESCE(SUM(
				CASE WHEN strftime('%Y', due_date, '@USER_OFFSET') = strftime('%Y', 'now', '@USER_OFFSET')
					  AND (strftime('%m', due_date, '@USER_OFFSET') + 5) / 6 = (strftime('%m', 'now', '@USER_OFFSET') + 5) / 6
					 THEN 1 ELSE 0 END
			), 0) AS total_this_semester,

			COALESCE(SUM(
				CASE WHEN strftime('%Y', due_date, '@USER_OFFSET') = strftime('%Y', 'now', '@USER_OFFSET')
					  AND (strftime('%m', due_date, '@USER_OFFSET') + 5) / 6 = (strftime('%m', 'now', '@USER_OFFSET') + 5) / 6
					  AND is_done = 1
					 THEN 1 ELSE 0 END
			), 0) AS done_this_semester,

			-- ====== THIS YEAR ======
			COALESCE(SUM(
				CASE WHEN strftime('%Y', due_date, '@USER_OFFSET') = strftime('%Y', 'now', '@USER_OFFSET')
					 THEN 1 ELSE 0 END
			), 0) AS total_this_year,

			COALESCE(SUM(
				CASE WHEN strftime('%Y', due_date, '@USER_OFFSET') = strftime('%Y', 'now', '@USER_OFFSET')
					  AND is_done = 1
					 THEN 1 ELSE 0 END
			), 0) AS done_this_year,

			-- ====== ALL TIME ======
			COUNT(task_id) AS total_all_time,

			COALESCE(SUM(is_done), 0) AS done_all_time

		FROM tasks WHERE user_id = ? AND due_date != '';
	`
	// Safely inject the parsed offsets into the query string
	query := strings.ReplaceAll(queryTemplate, "@USER_OFFSET", offset)
	query = strings.ReplaceAll(query, "@INVERSE_OFFSET", inverseOffset)

	// Execute the query, leaving only `userID` as the dynamic SQL argument
	var stats models.TaskStats
	err := r.db.QueryRow(query, userID).Scan(
		&stats.ThisWeekTotal, &stats.ThisWeekDone,
		&stats.ThisMonthTotal, &stats.ThisMonthDone,
		&stats.Last7DaysTotal, &stats.Last7DaysDone,
		&stats.Last30DaysTotal, &stats.Last30DaysDone,
		&stats.Last90DaysTotal, &stats.Last90DaysDone,
		&stats.Last180DaysTotal, &stats.Last180DaysDone,
		&stats.CurrentQuarterTotal, &stats.CurrentQuarterDone,
		&stats.CurrentSemesterTotal, &stats.CurrentSemesterDone,
		&stats.ThisYearTotal, &stats.ThisYearDone,
		&stats.AllTimeTotal, &stats.AllTimeDone,
	)

	if err != nil {
		return nil, err
	}

	return &stats, nil
}
