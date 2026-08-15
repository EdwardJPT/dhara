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

type ProjectHandler struct {
	projectService *service.ProjectService
	taskService    *service.TaskService
	templates      *template.Template
}

func NewProjectHandler(projectService *service.ProjectService, taskService *service.TaskService) *ProjectHandler {
	tmpl := template.New("")
	tmpl = template.Must(tmpl.ParseGlob("web/templates/project/*.html"))
	tmpl = template.Must(tmpl.ParseGlob("web/templates/components/*.html"))
	return &ProjectHandler{
		projectService: projectService,
		taskService:    taskService,
		templates:      tmpl,
	}
}

func (h *ProjectHandler) render(w http.ResponseWriter, name string, data any) {
	if err := h.templates.ExecuteTemplate(w, name, data); err != nil {
		log.Println("Template execute error:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (h *ProjectHandler) ProjectPage(w http.ResponseWriter, r *http.Request) {
	// Get user info from context
	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		log.Println("Parse user_id error:", err)
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}
	// Get project info from url
	projectNanoID := chi.URLParam(r, "projectNanoID")
	// Query the project
	project, err := h.projectService.GetProjectByNanoID(userId, projectNanoID)
	if err != nil {
		log.Println("Query project error:", err)
		http.Error(w, "Project is not found", http.StatusNotFound)
		return
	}
	// Query the tasks
	tasks, err := h.taskService.GetProjectTasks(userId, project.ID)
	if err != nil {
		log.Println("Query project task error:", err)
		http.Error(w, "Tasks of this project is not found", http.StatusInternalServerError)
		return
	}

	countPriorityProjects := h.projectService.GetUnfinishedPriorityCount(userId)

	// Pass data to template
	data := struct {
		IsDemo            bool
		ProjectTitle      string
		ProjectJSON       template.JS
		TasksJSON         template.JS
		CountPriorityJSON template.JS
	}{
		IsDemo:            false,
		ProjectTitle:      project.Title,
		ProjectJSON:       template.JS(toJSON(project)),
		TasksJSON:         template.JS(toJSON(tasks)),
		CountPriorityJSON: template.JS(toJSON(countPriorityProjects)),
	}

	h.render(w, "project", data)
}

func (h *ProjectHandler) AddTasks(w http.ResponseWriter, r *http.Request) {
	// Construct the input for database
	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusUnauthorized, err, "Unauthorized user")
		return
	}

	req := models.AddTaskRequest{}
	// Decode the JSON request body into the slice
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Bad request")
		return
	}

	err = h.taskService.CreateTasks(req.TaskData, req.ProjectId, userId)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "There's a problem in the server")
		return
	}

	utils.SuccessResponse(w, http.StatusOK, nil, "")
}

func (h *ProjectHandler) EditProject(w http.ResponseWriter, r *http.Request) {
	// Get user info from context
	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		utils.ErrorResponse(w, http.StatusUnauthorized, err, "Unauthorized user")
		return
	}

	req := models.EditProjectRequest{}
	// Get project info from url
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		utils.ErrorResponse(w, http.StatusBadRequest, err, "Bad request")
		return
	}

	err = h.projectService.UpdateProject(userId, req.ID, req)
	if err != nil {
		utils.ErrorResponse(w, http.StatusInternalServerError, err, "There's a problem in the server")
		return
	}

	utils.SuccessResponse(w, http.StatusOK, nil, "")
}
