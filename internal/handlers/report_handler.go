package handlers

import (
	"html/template"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"tasksmanagement/internal/service"

	"github.com/go-chi/jwtauth/v5"
)

type ReportHandler struct {
	projectService *service.ProjectService
	taskService    *service.TaskService
	habitService   *service.HabitService
	templates      *template.Template
}

func NewReportHandler(
	projectService *service.ProjectService,
	taskService *service.TaskService,
	habitService *service.HabitService,
) *ReportHandler {
	tmpl := template.New("")
	tmpl = template.Must(tmpl.ParseGlob("web/templates/reports/*.html"))
	tmpl = template.Must(tmpl.ParseGlob("web/templates/components/*.html"))
	return &ReportHandler{
		projectService: projectService,
		taskService:    taskService,
		habitService:   habitService,
		templates:      tmpl,
	}
}

var tzRegex = regexp.MustCompile(`^[+-]\d{2}:\d{2}$`)

func (h *ReportHandler) ReportPage(w http.ResponseWriter, r *http.Request) {
	// Get user info from context
	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		log.Println("Parse user_id error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}
	username, _ := claims["username"].(string)

	// Read the cookie to get user's timezone
	userOffset := "+00:00" // Default to UTC
	cookie, err := r.Cookie("tz_offset")
	// Validate the cookie
	if err == nil && tzRegex.MatchString(cookie.Value) {
		userOffset = cookie.Value
	}
	// Calculate the inverse offset (Flip '+' to '-', and '-' to '+')
	var inverseOffset string
	if strings.HasPrefix(userOffset, "+") {
		inverseOffset = "-" + strings.TrimPrefix(userOffset, "+")
	} else {
		inverseOffset = "+" + strings.TrimPrefix(userOffset, "-")
	}

	// Projects & Tasks Report

	// Query the projects that owned by the user
	projects, err := h.projectService.GetUserProjects(userId)
	if err != nil {
		log.Println("Query projects error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}
	visibleProjects := projects[:0]
	for _, project := range projects {
		if !project.Hide {
			visibleProjects = append(visibleProjects, project)
		}
	}
	projects = visibleProjects

	// Query the tasks that owned by the user
	tasks, err := h.taskService.GetUserTasks(userId)
	if err != nil {
		log.Println("Query tasks error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}

	// Query the the stats of task completion
	taskStats, err := h.taskService.GetUserTaskStats(userId, userOffset, inverseOffset)
	if err != nil {
		log.Println("Query task stats error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}

	// Habits Report
	habitsDoneToday, err := h.habitService.GetHabitsDoneToday(userId, userOffset)
	if err != nil {
		log.Println("Query habits done today error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}

	habitsBestWorstStats, err := h.habitService.GetAllBestAndWorst(userId, userOffset, inverseOffset)
	if err != nil {
		log.Println("Query best and worst habits error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}

	habitsGroupStats, err := h.habitService.GetGroupStatsWithHabitsByUserID(userId, userOffset, inverseOffset)
	if err != nil {
		log.Println("Query habits group stats error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}

	habitsProductivityPeaks, err := h.habitService.CalculateAllProductivityPeaks(userId, userOffset, inverseOffset)
	if err != nil {
		log.Println("Query habits productivity peaks error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}

	habitsMonthlyConsistency, err := h.habitService.GetMonthlyConsistency(userId)
	if err != nil {
		log.Println("Query habits monthly consistency error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}

	// Fetch ALL calculated data at once
	habitsWeeklyConsistency, err := h.habitService.CalculateAllPeriodsConsistency(userId)
	if err != nil {
		log.Println("Query habits weekly consistency error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}

	// Pass data to template
	data := struct {
		IsDemo                       bool
		Username                     string
		ProjectsJSON                 template.JS
		TasksJSON                    template.JS
		TaskStatsJSON                template.JS
		HabitsDoneTodayJSON          template.JS
		HabitsBestWorstStatsJSON     template.JS
		HabitsGroupStatsJSON         template.JS
		HabitsProductivityPeaksJSON  template.JS
		HabitsMonthlyConsistencyJSON template.JS
		HabitsWeeklyConsistencyJSON  template.JS
	}{
		IsDemo:                       false,
		Username:                     username,
		ProjectsJSON:                 template.JS(toJSON(projects)),
		TasksJSON:                    template.JS(toJSON(tasks)),
		TaskStatsJSON:                template.JS(toJSON(taskStats)),
		HabitsDoneTodayJSON:          template.JS(toJSON(habitsDoneToday)),
		HabitsBestWorstStatsJSON:     template.JS(toJSON(habitsBestWorstStats)),
		HabitsGroupStatsJSON:         template.JS(toJSON(habitsGroupStats)),
		HabitsProductivityPeaksJSON:  template.JS(toJSON(habitsProductivityPeaks)),
		HabitsMonthlyConsistencyJSON: template.JS(toJSON(habitsMonthlyConsistency)),
		HabitsWeeklyConsistencyJSON:  template.JS(toJSON(habitsWeeklyConsistency)),
	}

	err = h.templates.ExecuteTemplate(w, "reports", data)
	if err != nil {
		log.Println("Template error:", err)
		http.Error(w, "There's a problem in the server.", http.StatusInternalServerError)
	}
}
