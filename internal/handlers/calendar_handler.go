package handlers

import (
	"database/sql"
	"html/template"
	"log"
	"net/http"
	"strconv"

	"tasksmanagement/internal/repository"

	"github.com/go-chi/jwtauth/v5"
)

type CalendarHandler struct {
	repoTask     *repository.TaskRepository
	repoUnsorted *repository.UnsortedRepository
	repoHabit    *repository.HabitRepository
	templates    *template.Template
}

func NewCalendarHandler(db *sql.DB) *CalendarHandler {
	tmpl := template.New("")
	tmpl = template.Must(tmpl.ParseGlob("web/templates/calendar/*.html"))
	tmpl = template.Must(tmpl.ParseGlob("web/templates/components/*.html"))
	return &CalendarHandler{
		repoTask:     repository.NewTaskRepository(db),
		repoUnsorted: repository.NewUnsortedRepository(db),
		repoHabit:    repository.NewHabitRepository(db),
		templates:    tmpl,
	}
}

func (h *CalendarHandler) CalendarPage(w http.ResponseWriter, r *http.Request) {
	// Get user info from context
	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		log.Println("Parse user_id error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}

	// Query the tasks that owned by the user
	tasksGroupByDueDate, err := h.repoTask.GetUserTasksWithDueDates(userId)
	if err != nil {
		log.Println("Query tasks error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}
	// Query the unsorted tasks that owned by the user
	unsortedsGroupByDueDate, err := h.repoUnsorted.GetUserUnsortedsWithDueDates(userId)
	if err != nil {
		log.Println("Query unsorteds error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}
	// Query the habits that owned by the user
	habitsGroupByDueDate, err := h.repoHabit.GetUserHabitsByDoneDate(userId)
	if err != nil {
		log.Println("Query habits error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}

	// Pass data to template
	data := struct {
		IsDemo               bool
		DueDateTasksJSON     template.JS
		DueDateUnsortedsJSON template.JS
		DueDateHabitsJSON    template.JS
	}{
		IsDemo:               false,
		DueDateTasksJSON:     template.JS(toJSON(tasksGroupByDueDate)),
		DueDateUnsortedsJSON: template.JS(toJSON(unsortedsGroupByDueDate)),
		DueDateHabitsJSON:    template.JS(toJSON(habitsGroupByDueDate)),
	}

	err = h.templates.ExecuteTemplate(w, "calendar", data)
	if err != nil {
		log.Println("Template error:", err)
		http.Error(w, "There's a problem in the server.", http.StatusInternalServerError)
	}
}
