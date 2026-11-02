package service

import (
	"database/sql"
	"encoding/json"
	"strings"

	"tasksmanagement/internal/database"
	errs "tasksmanagement/internal/errors"
	"tasksmanagement/internal/models"
	"tasksmanagement/internal/repository"
)

type GoalService struct {
	repoGoal    *repository.GoalRepository
	transaction *database.Transaction
}

func NewGoalService(db *sql.DB, repoGoal *repository.GoalRepository) *GoalService {
	return &GoalService{
		repoGoal:    repoGoal,
		transaction: database.InitTransactionObject(db),
	}
}

func (s *GoalService) GetUserGoals(userId int64) ([]models.Goal, error) {
	return s.repoGoal.GetUserGoals(userId)
}

func (s *GoalService) CreateGoal(userId int64, req models.CreateGoalRequest) error {
	return s.saveGoal(userId, 0, req)
}

func (s *GoalService) UpdateGoal(userId, goalId int64, req models.UpdateGoalRequest) error {
	return s.saveGoal(userId, goalId, models.CreateGoalRequest(req))
}

func (s *GoalService) DeleteGoal(userId, goalId int64) error {
	rowsAffected, err := s.repoGoal.Delete(userId, goalId)
	if err != nil {
		return err
	}
	if rowsAffected != 1 {
		return errs.ErrGoalNotFound
	}
	return nil
}

func (s *GoalService) saveGoal(userId, goalId int64, req models.CreateGoalRequest) error {
	title := strings.TrimSpace(req.Goal)
	if title == "" {
		return errs.ErrEmptyGoal
	}
	if len(req.ProjectIds) == 0 {
		return errs.ErrEmptyGoalProjects
	}

	projectIds := make([]int64, 0, len(req.ProjectIds))
	invalidProjectError := errs.ErrInvalidGoalProjects
	if goalId != 0 {
		invalidProjectError = errs.ErrInvalidGoalUpdateProjects
	}
	seen := make(map[int64]bool)
	for _, id := range req.ProjectIds {
		if id <= 0 {
			return invalidProjectError
		}
		if !seen[id] {
			projectIds = append(projectIds, id)
			seen[id] = true
		}
	}
	projectIdsJSON, err := json.Marshal(projectIds)
	if err != nil {
		return err
	}

	tx, err := s.transaction.Start()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, id := range projectIds {
		canAttach, err := s.repoGoal.CanAttachProject(userId, id, goalId != 0, tx)
		if err != nil {
			return err
		}
		if !canAttach {
			return invalidProjectError
		}
	}
	if goalId == 0 {
		if err := s.repoGoal.Create(userId, title, string(projectIdsJSON), tx); err != nil {
			return err
		}
	} else {
		rowsAffected, err := s.repoGoal.Update(userId, goalId, title, string(projectIdsJSON), tx)
		if err != nil {
			return err
		}
		if rowsAffected != 1 {
			return errs.ErrGoalNotFound
		}
	}
	return tx.Commit()
}
