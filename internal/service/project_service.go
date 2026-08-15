package service

import (
	"database/sql"

	"tasksmanagement/internal/database"
	"tasksmanagement/internal/models"
	"tasksmanagement/internal/repository"
	"tasksmanagement/internal/utils"

	gonanoid "github.com/matoous/go-nanoid/v2"
)

type ProjectService struct {
	repoProject *repository.ProjectRepository
	repoTask    *repository.TaskRepository
	transaction *database.Transaction
}

func NewProjectService(db *sql.DB, repoProject *repository.ProjectRepository, repoTask *repository.TaskRepository) *ProjectService {
	return &ProjectService{
		repoProject: repoProject,
		repoTask:    repoTask,
		transaction: database.InitTransactionObject(db),
	}
}

func (s *ProjectService) GetUserProjects(userId int64) ([]models.Project, error) {
	return s.repoProject.GetUserProjects(userId)
}

func (s *ProjectService) GetProjectByNanoID(userId int64, nanoid string) (models.Project, error) {
	return s.repoProject.GetProjectByNanoID(userId, nanoid)
}

func (s *ProjectService) UpdateProject(userId, projectId int64, req models.EditProjectRequest) error {
	err := s.repoProject.Update(userId, projectId, req)
	if err != nil {
		return err
	}
	return nil
}

func (s *ProjectService) CreateProject(formData models.CreateProjectRequest) error {
	// Check priority limit
	if formData.Priority {
		countPriorityProjects := s.repoProject.GetUnfinishedPriorityCount(formData.UserId)
		if countPriorityProjects >= utils.MaxPriorityProject {
			formData.Priority = false
		}
	}

	// Generate NanoID
	nanoId, err := gonanoid.New(10)
	if err != nil {
		return err
	}

	// Start Transaction
	tx, err := s.transaction.Start()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Create Project
	projectData := models.InputProject{
		PublicId:  nanoId,
		UserId:    formData.UserId,
		Title:     formData.Title,
		Desc:      formData.Desc,
		StartDate: formData.StartDate,
		DueDate:   formData.DueDate,
		Priority:  formData.Priority,
	}

	projectId, err := s.repoProject.Create(projectData, tx)
	if err != nil {
		return err
	}

	// Create First Task
	taskData := models.FirstTask{
		ProjectId:   projectId,
		UserId:      formData.UserId,
		TaskTitle:   formData.TaskTitle,
		TaskDesc:    formData.TaskDesc,
		TaskDueDate: formData.TaskDueDate,
		Priority:    formData.TaskPriority,
	}

	_, err = s.repoTask.Create(taskData, tx)
	if err != nil {
		return err
	}

	// Commit
	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (s *ProjectService) GetUnfinishedPriorityCount(userId int64) int {
	return s.repoProject.GetUnfinishedPriorityCount(userId)
}
