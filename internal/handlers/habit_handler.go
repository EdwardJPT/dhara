package handlers

import (
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"strconv"

	"tasksmanagement/internal/models"
	"tasksmanagement/internal/service"
	"tasksmanagement/internal/utils"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
)

type HabitHandler struct {
	habitService *service.HabitService
	templates    *template.Template
}

func NewHabitHandler(habitService *service.HabitService) *HabitHandler {
	tmpl := template.New("")
	tmpl = template.Must(tmpl.ParseGlob("web/templates/habits/*.html"))
	tmpl = template.Must(tmpl.ParseGlob("web/templates/components/*.html"))
	return &HabitHandler{
		habitService: habitService,
		templates:    tmpl,
	}
}

func (h *HabitHandler) HabitPage(w http.ResponseWriter, r *http.Request) {
	// Get user info from context
	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		log.Println("Parse user_id error:", err)
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	habitsGroups, err := h.habitService.GetUserHabitsGroups(userId)
	if err != nil {
		log.Println("Query habits group with habits error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}
	habitsDate, err := h.habitService.GetUserHabitsDoneDate(userId)
	if err != nil {
		log.Println("Query habits date error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}

	data := struct {
		IsDemo         bool
		HabitsJSON     template.JS
		HabitsDateJSON template.JS
	}{
		IsDemo:         false,
		HabitsJSON:     template.JS(toJSON(habitsGroups)),
		HabitsDateJSON: template.JS(toJSON(habitsDate)),
	}

	if err = h.templates.ExecuteTemplate(w, "habits", data); err != nil {
		log.Println("Template error:", err)
		http.Error(w, "There's a problem in the server.", http.StatusInternalServerError)
	}
}

func (h *HabitHandler) AddHabit(w http.ResponseWriter, r *http.Request) {
	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusUnauthorized, err, "Parse user_id error:")
		return
	}

	// Parse the post body
	var req models.CreateNewHabitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Bad request error:")
		return
	}

	err = h.habitService.CreateHabit(userId, req)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Failed to create habit:")
		return
	}

	utils.SuccessResponse(w, http.StatusCreated, nil, "")
}

func (h *HabitHandler) PatchHabitsGroupIsShow(w http.ResponseWriter, r *http.Request) {
	groupIDStr := chi.URLParam(r, "group_id")
	groupId, err := strconv.ParseInt(groupIDStr, 10, 64)
	if err != nil {
		h.failHabitCheckIn(w, err, "Bad request:", http.StatusBadRequest)
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		h.failHabitCheckIn(w, err, "Parse user_id error:", http.StatusUnauthorized)
		return
	}

	// Parse the post body
	var req models.UpdateHabitsGroupIsShowRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid request body")
		return
	}
	if req.HabitsGroupID != groupId {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Invalid request body")
		return
	}

	// Update the status or is_show of the group habit
	habitsGroupAffected, err := h.habitService.UpdateHabitsGroupIsShow(req, userId)
	if habitsGroupAffected != 1 || err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "Update habits group is show error")
		return
	}

	utils.SuccessResponse(w, http.StatusOK, nil, "")
}

type HabitCheckInResponse struct {
	Success   bool             `json:"success"`
	Status    string           `json:"status"`
	DoneDates map[string]int64 `json:"done_dates"`
}

func (h *HabitHandler) failHabitCheckIn(w http.ResponseWriter, err error, message string, statusError int) {
	log.Println(message, err)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusError)
	json.NewEncoder(w).Encode(HabitCheckInResponse{
		Success:   false,
		Status:    "failed",
		DoneDates: map[string]int64{},
	})
}

func (h *HabitHandler) HabitCheckIn(w http.ResponseWriter, r *http.Request) {
	groupIDStr := chi.URLParam(r, "group_id")
	groupId, err := strconv.ParseInt(groupIDStr, 10, 64)
	if err != nil {
		h.failHabitCheckIn(w, err, "Bad request:", http.StatusBadRequest)
		return
	}

	habitIDStr := chi.URLParam(r, "habit_id")
	habitId, err := strconv.ParseInt(habitIDStr, 10, 64)
	if err != nil {
		h.failHabitCheckIn(w, err, "Bad request:", http.StatusBadRequest)
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		h.failHabitCheckIn(w, err, "Parse user_id error:", http.StatusUnauthorized)
		return
	}

	// Parse the post body
	var req models.HabitCheckInRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.failHabitCheckIn(w, err, "Bad request error:", http.StatusBadRequest)
		return
	}
	if req.HabitsGroupID != groupId || req.HabitID != habitId {
		h.failHabitCheckIn(w, err, "Bad request error:", http.StatusBadRequest)
		return
	}

	ids, doneDates, err := h.habitService.CheckIn(userId, req)
	if err != nil {
		h.failHabitCheckIn(w, err, "Habit check in error:", http.StatusInternalServerError)
		return
	}

	newDoneDates := make(map[string]int64)
	for i, d := range doneDates {
		newDoneDates[d] = ids[i]
	}

	// Succeed create the habit
	json.NewEncoder(w).Encode(HabitCheckInResponse{
		Success:   true,
		Status:    "completed",
		DoneDates: newDoneDates,
		// IDs?
	})
}
