package handlers

import (
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"strconv"

	"tasksmanagement/internal/models"
	"tasksmanagement/internal/service"

	"github.com/go-chi/jwtauth/v5"
)

type HomeHandler struct {
	projectService *service.ProjectService
	taskService    *service.TaskService
	templates      *template.Template
}

func NewHomeHandler(projectService *service.ProjectService, taskService *service.TaskService) *HomeHandler {
	tmpl := template.New("")
	tmpl = template.Must(tmpl.ParseGlob("web/templates/home/*.html"))
	tmpl = template.Must(tmpl.ParseGlob("web/templates/components/*.html"))
	return &HomeHandler{
		projectService: projectService,
		taskService:    taskService,
		templates:      tmpl,
	}
}

func toJSON(v any) string {
	b, _ := json.Marshal(v)
	return string(b)
}

func (h *HomeHandler) render(w http.ResponseWriter, name string, data any, httpCode int) {
	w.WriteHeader(httpCode)
	if err := h.templates.ExecuteTemplate(w, name, data); err != nil {
		log.Println("Template execute error:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (h *HomeHandler) HomePage(w http.ResponseWriter, r *http.Request) {
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
	// Query the tasks that owned by the user
	tasks, err := h.taskService.GetUserTasks(userId)
	if err != nil {
		log.Println("Query tasks error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}
	// Query the unsorted tasks that owned by the user
	unsorteds, err := h.taskService.GetUserUnsorteds(userId)
	if err != nil {
		log.Println("Query unsorted error:", err)
		http.Error(w, "There's a problem in the server", http.StatusInternalServerError)
		return
	}

	// Pass data to template
	data := struct {
		IsDemo        bool
		ProjectsJSON  template.JS
		TasksJSON     template.JS
		UnsortedsJSON template.JS
	}{
		IsDemo:        false,
		ProjectsJSON:  template.JS(toJSON(projects)),
		TasksJSON:     template.JS(toJSON(tasks)),
		UnsortedsJSON: template.JS(toJSON(unsorteds)),
	}

	h.render(w, "home", data, http.StatusOK)
}

func (h *HomeHandler) CreateProjectForm(w http.ResponseWriter, r *http.Request) {
	data := struct{ IsDemo bool }{IsDemo: false}
	h.render(w, "create_project", data, http.StatusOK)
}

type createProjectResponse struct {
	Message string
}

func (h *HomeHandler) CreateProject(w http.ResponseWriter, r *http.Request) {
	// Get user info from context
	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		log.Println("Parse user_id error:", err)
		message := createProjectResponse{Message: "Invalid credentials"}
		h.render(w, "create_project_resp", message, http.StatusUnauthorized)
		return
	}

	// Parse form data
	if err := r.ParseForm(); err != nil {
		log.Println("Parse form error:", err)
		message := createProjectResponse{Message: "Bad Request"}
		h.render(w, "create_project_resp", message, http.StatusBadRequest)
		return
	}

	req := models.CreateProjectRequest{
		UserId:       userId,
		Title:        r.FormValue("title"),
		Desc:         r.FormValue("desc"),
		StartDate:    r.FormValue("start_date"),
		DueDate:      r.FormValue("due_date"),
		Priority:     r.FormValue("priority") == "1",
		TaskTitle:    r.FormValue("task-title"),
		TaskDesc:     r.FormValue("task-desc"),
		TaskDueDate:  r.FormValue("task-due_date"),
		TaskPriority: r.FormValue("task-priority") == "1",
	}

	err = h.projectService.CreateProject(req)
	if err != nil {
		log.Println("Create project error:", err)
		message := createProjectResponse{Message: "Failed to create the project"}
		h.render(w, "create_project_resp", message, http.StatusInternalServerError)
		return
	}

	// Change the message if succeed in creating the project
	message := createProjectResponse{Message: "Success adding the project"}
	h.render(w, "create_project_resp", message, http.StatusCreated)
}
