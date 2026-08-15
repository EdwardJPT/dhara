package service

import (
	"database/sql"
	"errors"
	"time"

	"tasksmanagement/internal/database"
	"tasksmanagement/internal/models"
	"tasksmanagement/internal/repository"
)

type TaskService struct {
	repoTask     *repository.TaskRepository
	repoUnsorted *repository.UnsortedRepository
	transaction  *database.Transaction
}

func NewTaskService(db *sql.DB, repoTask *repository.TaskRepository, repoUnsorted *repository.UnsortedRepository) *TaskService {
	return &TaskService{
		repoTask:     repoTask,
		repoUnsorted: repoUnsorted,
		transaction:  database.InitTransactionObject(db),
	}
}

// --- Task Operations ---

func (s *TaskService) GetUserTasks(userId int64) ([]models.Task, error) {
	return s.repoTask.GetUserTasks(userId)
}

func (s *TaskService) UpdateTaskStatus(req models.UpdateTaskStatusRequest, userId int64) error {
	return s.repoTask.UpdateStatus(req, userId)
}

func (s *TaskService) UpdateTaskDueDate(req models.UpdateTaskDueRequest, userId int64) error {
	return s.repoTask.UpdateDueDate(req, userId)
}

func (s *TaskService) GetProjectTasks(userId, projectId int64) ([]models.Task, error) {
	return s.repoTask.GetProjectTasks(userId, projectId)
}

func (s *TaskService) CreateTasks(taskData []models.InputAddTask, projectId, userId int64) error {
	tx, err := s.transaction.Start()
	if err != nil {
		return errors.New("failed to start transaction")
	}
	defer tx.Rollback()

	insertedTasks, err := s.repoTask.CreateTasks(taskData, projectId, userId, tx)
	if err != nil {
		return errors.New("failed to insert tasks")
	}
	if insertedTasks == len(taskData) {
		tx.Commit()
	}
	return nil
}

func (s *TaskService) EditTask(userId, taskId int64, req models.UpdateTaskRequest) error {
	// Validation
	if req.TaskTitle == "" {
		return errors.New("task title is required")
	}
	if req.TaskDueDate != "" {
		if _, err := time.Parse("2006-01-02", req.TaskDueDate); err != nil {
			return errors.New("invalid due date format. Use YYYY-MM-DD")
		}
	}
	if req.TaskIsDone && req.TaskDoneDate == 0 {
		return errors.New("invalid done date format. Use unix epoch time")
	}
	return s.repoTask.Update(userId, taskId, req)
}

func (s *TaskService) DeleteTask(userId, taskId int64) error {
	return s.repoTask.Delete(userId, taskId)
}

// --- Unsorted Operations ---

func (s *TaskService) GetUserUnsorteds(userId int64) ([]models.UnsortedTask, error) {
	return s.repoUnsorted.GetUserUnsorteds(userId)
}

func (s *TaskService) AddUnsortedTask(userId int64, req models.CreateUnsortedTask) (int64, error) {
	return s.repoUnsorted.Create(userId, req)
}

func (s *TaskService) UpdateUnsortedStatus(req models.UpdateUnsortedStatusRequest, userId int64) error {
	return s.repoUnsorted.UpdateStatus(req, userId)
}

func (s *TaskService) DeleteUnsortedTask(userId, unsortedId int64) (int64, error) {
	deletedUnsorted, err := s.repoUnsorted.Delete(userId, unsortedId, nil)
	if err != nil {
		return 0, err
	}
	return deletedUnsorted.ID, nil
}

func (s *TaskService) AssignUnsortedTask(userId, projectId, unsortedId int64) (models.Task, error) {
	tx, err := s.transaction.Start()
	if err != nil {
		return models.Task{}, err
	}
	defer tx.Rollback()

	deletedUnsorted, err := s.repoUnsorted.Delete(userId, unsortedId, tx)
	if err != nil || deletedUnsorted.ID <= 0 {
		return models.Task{}, errors.New("query delete unsorted error")
	}

	task, err := s.repoTask.CreateWithUnsorted(deletedUnsorted, projectId, tx)
	if err != nil {
		return models.Task{}, err
	}

	if err := tx.Commit(); err != nil {
		return models.Task{}, err
	}

	return task, nil
}

func (s *TaskService) GetUserTaskStats(userID int64, offset, inverseOffset string) (*models.TaskStats, error) {
	return s.repoTask.GetTaskStatsByUserID(userID, offset, inverseOffset)
}
