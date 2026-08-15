package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"tasksmanagement/internal/models"
	"tasksmanagement/internal/service"
	"tasksmanagement/internal/utils"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
)

type TaskHandler struct {
	service *service.TaskService
}

func NewTaskHandler(service *service.TaskService) *TaskHandler {
	return &TaskHandler{service: service}
}

// --- Task Handlers ---

func (h *TaskHandler) PatchTaskStatus(w http.ResponseWriter, r *http.Request) {
	taskIDStr := chi.URLParam(r, "id")
	taskId, err := strconv.ParseInt(taskIDStr, 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid task ID")
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Unauthorized request")
		return
	}

	var req models.UpdateTaskStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid request body")
		return
	}
	req.TaskId = taskId

	if err := h.service.UpdateTaskStatus(req, userId); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Update task status error")
		return
	}

	utils.SuccessResponse(w, http.StatusOK, nil, "completed")
}

func (h *TaskHandler) PatchTaskDueDate(w http.ResponseWriter, r *http.Request) {
	taskIDStr := chi.URLParam(r, "id")
	taskId, err := strconv.ParseInt(taskIDStr, 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid task ID")
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Unauthorized request")
		return
	}

	var req models.UpdateTaskDueRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid request body")
		return
	}
	req.TaskId = taskId

	if err := h.service.UpdateTaskDueDate(req, userId); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Update due date error")
		return
	}

	utils.SuccessResponse(w, http.StatusOK, nil, "completed")
}

func (h *TaskHandler) EditTask(w http.ResponseWriter, r *http.Request) {
	taskIDStr := chi.URLParam(r, "id")
	taskId, err := strconv.ParseInt(taskIDStr, 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid task ID")
		return
	}

	var req models.UpdateTaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid request body")
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Unauthorized request")
		return
	}

	if err := h.service.EditTask(userId, taskId, req); err != nil {
		message := fmt.Sprintf("Edit task error: %v", err)
		utils.ErrorResponse(w, http.StatusInternalServerError, err, message)
		return
	}

	utils.SuccessResponse(w, http.StatusOK, nil, "completed")
}

func (h *TaskHandler) DeleteTask(w http.ResponseWriter, r *http.Request) {
	taskIDStr := chi.URLParam(r, "id")
	taskId, err := strconv.ParseInt(taskIDStr, 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid task ID")
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Unauthorized request")
		return
	}

	if err := h.service.DeleteTask(userId, taskId); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Delete task error")
		return
	}

	utils.SuccessResponse(w, http.StatusOK, map[string]int64{"task_id": taskId}, "completed")
}

// --- Unsorted Handlers ---

func (h *TaskHandler) CreateUnsortedTask(w http.ResponseWriter, r *http.Request) {
	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Unauthorized request")
		return
	}

	var req models.CreateUnsortedTask
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid request body")
		return
	}

	unsortedId, err := h.service.AddUnsortedTask(userId, req)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Failed to create unsorted task")
		return
	}

	utils.SuccessResponse(w, http.StatusOK, map[string]int64{"unsorted_id": unsortedId}, "succeed")
}

func (h *TaskHandler) PatchUnsortedTask(w http.ResponseWriter, r *http.Request) {
	unsortedIDStr := chi.URLParam(r, "id")
	unsortedId, err := strconv.ParseInt(unsortedIDStr, 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid request body")
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Unauthorized request")
		return
	}

	var req models.UpdateUnsortedStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid request body")
		return
	}
	req.UnsortedId = unsortedId

	if err := h.service.UpdateUnsortedStatus(req, userId); err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Update unsorted status error")
		return
	}

	utils.SuccessResponse(w, http.StatusOK, nil, "completed")
}

func (h *TaskHandler) DeleteUnsortedTask(w http.ResponseWriter, r *http.Request) {
	unsortedIDStr := chi.URLParam(r, "id")
	unsortedId, err := strconv.ParseInt(unsortedIDStr, 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid request body")
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Unauthorized request")
		return
	}

	deletedUnsortedId, err := h.service.DeleteUnsortedTask(userId, unsortedId)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Delete query error")
		return
	}

	utils.SuccessResponse(w, http.StatusOK, map[string]int64{"unsorted_id": deletedUnsortedId}, "succeed")
}

func (h *TaskHandler) AssignUnsortedTask(w http.ResponseWriter, r *http.Request) {
	unsortedIDStr := chi.URLParam(r, "id")
	unsortedId, err := strconv.ParseInt(unsortedIDStr, 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid unsorted ID")
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Unauthorized request")
		return
	}

	var req models.AssignUnsortedTask
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid request body")
		return
	}
	projectId, err := strconv.ParseInt(req.ProjectId, 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid project ID")
		return
	}

	task, err := h.service.AssignUnsortedTask(userId, projectId, unsortedId)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Failed to assign unsorted task to a project")
		return
	}

	utils.SuccessResponse(w, http.StatusOK, map[string]models.Task{"task": task}, "succeed")
}
