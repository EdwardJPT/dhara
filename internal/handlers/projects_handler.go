package handlers

import (
	"html/template"
	"log"
	"net/http"
	"strconv"

	"tasksmanagement/internal/service"

	"github.com/go-chi/jwtauth/v5"
)

type ProjectsHandler struct {
	projectService *service.ProjectService
	goalService    *service.GoalService
	templates      *template.Template
}

func NewProjectsHandler(projectService *service.ProjectService, goalService *service.GoalService) *ProjectsHandler {
	tmpl := template.New("")
	tmpl = template.Must(tmpl.ParseGlob("web/templates/projects/*.html"))
	tmpl = template.Must(tmpl.ParseGlob("web/templates/components/*.html"))
	return &ProjectsHandler{
		projectService: projectService,
		goalService:    goalService,
		templates:      tmpl,
	}
}

func (h *ProjectsHandler) ProjectsPage(w http.ResponseWriter, r *http.Request) {
	// Get user info from context
	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		log.Println("Parse user_id error:", err)
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Query the projects that owned by the user
	projects, err := h.projectService.GetUserProjects(userId)
	if err != nil {
		log.Println("Query projects error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}

	goals, err := h.goalService.GetUserGoals(userId)
	if err != nil {
		log.Println("Query goals error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}

	// Pass data to template
	data := struct {
		IsDemo       bool
		ProjectsJSON template.JS
		GoalsJSON    template.JS
	}{
		IsDemo:       false,
		ProjectsJSON: template.JS(toJSON(projects)),
		GoalsJSON:    template.JS(toJSON(goals)),
	}

	if err := h.templates.ExecuteTemplate(w, "projects", data); err != nil {
		log.Println("Template execute error:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}
