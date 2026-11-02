package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	errs "tasksmanagement/internal/errors"
	"tasksmanagement/internal/models"
	"tasksmanagement/internal/service"
	"tasksmanagement/internal/utils"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
)

type GoalHandler struct {
	goalService *service.GoalService
}

func NewGoalHandler(goalService *service.GoalService) *GoalHandler {
	return &GoalHandler{goalService: goalService}
}

func (h *GoalHandler) AddGoal(w http.ResponseWriter, r *http.Request) {
	userId, ok := goalUserID(w, r)
	if !ok {
		return
	}

	var req models.CreateGoalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid request body")
		return
	}

	if err := h.goalService.CreateGoal(userId, req); err != nil {
		goalErrorResponse(w, err)
		return
	}

	utils.SuccessResponse(w, http.StatusCreated, nil, "")
}

func (h *GoalHandler) EditGoal(w http.ResponseWriter, r *http.Request) {
	userId, ok := goalUserID(w, r)
	if !ok {
		return
	}
	goalId, ok := goalURLID(w, r)
	if !ok {
		return
	}
	var req models.UpdateGoalRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid request body")
		return
	}
	if err := h.goalService.UpdateGoal(userId, goalId, req); err != nil {
		goalErrorResponse(w, err)
		return
	}
	utils.SuccessResponse(w, http.StatusOK, nil, "")
}

func (h *GoalHandler) DeleteGoal(w http.ResponseWriter, r *http.Request) {
	userId, ok := goalUserID(w, r)
	if !ok {
		return
	}
	goalId, ok := goalURLID(w, r)
	if !ok {
		return
	}
	if err := h.goalService.DeleteGoal(userId, goalId); err != nil {
		goalErrorResponse(w, err)
		return
	}
	utils.SuccessResponse(w, http.StatusOK, nil, "")
}

func goalUserID(w http.ResponseWriter, r *http.Request) (int64, bool) {
	_, claims, _ := jwtauth.FromContext(r.Context())
	userIDStr, ok := claims["user_id"].(string)
	userId, err := strconv.ParseInt(userIDStr, 10, 64)
	if !ok || err != nil || userId <= 0 {
		utils.ErrorResponse(w, http.StatusUnauthorized, err, "Invalid credentials")
		return 0, false
	}
	return userId, true
}

func goalURLID(w http.ResponseWriter, r *http.Request) (int64, bool) {
	goalId, err := strconv.ParseInt(chi.URLParam(r, "goal_id"), 10, 64)
	if err != nil || goalId <= 0 {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid goal ID")
		return 0, false
	}
	return goalId, true
}

func goalErrorResponse(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, errs.ErrGoalNotFound):
		utils.ErrorResponse(w, http.StatusNotFound, err, err.Error())
	case errors.Is(err, errs.ErrEmptyGoal), errors.Is(err, errs.ErrEmptyGoalProjects), errors.Is(err, errs.ErrInvalidGoalProjects), errors.Is(err, errs.ErrInvalidGoalUpdateProjects):
		utils.ErrorResponse(w, http.StatusBadRequest, err, err.Error())
	default:
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Failed to save changes to the goal. Please try again.")
	}
}
