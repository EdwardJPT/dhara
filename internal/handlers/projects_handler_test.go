package handlers

import (
	"encoding/json"
	"html/template"
	"net/http"
	"net/http/httptest"
	"regexp"
	"strconv"
	"testing"

	"tasksmanagement/internal/models"
	"tasksmanagement/internal/repository"
	"tasksmanagement/internal/service"

	"github.com/go-chi/jwtauth/v5"
)

func TestProjectsPageGoals(t *testing.T) {
	tmpl := template.Must(template.ParseGlob("../../web/templates/projects/*.html"))
	tmpl = template.Must(tmpl.ParseGlob("../../web/templates/components/*.html"))
	for _, isDemo := range []bool{false, true} {
		t.Run(strconv.FormatBool(isDemo), func(t *testing.T) {
			response := httptest.NewRecorder()
			req := httptest.NewRequest(http.MethodGet, "/projects/all", nil)
			if isDemo {
				handler := &DemoHandler{projectsTmpl: tmpl}
				handler.DemoProjectsPage(response, req)
			} else {
				db := goalCreationTestDB(t)
				if _, err := db.Exec(`INSERT INTO goals (user_id, goal_title, project_ids) VALUES (1, 'Own goal', '[11,13]'), (2, 'Other user goal', '[21]')`); err != nil {
					t.Fatal(err)
				}
				handler := &ProjectsHandler{
					projectService: service.NewProjectService(db, repository.NewProjectRepository(db), repository.NewTaskRepository(db)),
					goalService:    service.NewGoalService(db, repository.NewGoalRepository(db)),
					templates:      tmpl,
				}
				token, _, err := jwtauth.New("HS256", []byte("test-secret"), nil).Encode(map[string]interface{}{"user_id": "1"})
				if err != nil {
					t.Fatal(err)
				}
				req = req.WithContext(jwtauth.NewContext(req.Context(), token, nil))
				handler.ProjectsPage(response, req)
			}
			if response.Code != http.StatusOK {
				t.Fatalf("status = %d, body = %s", response.Code, response.Body.String())
			}
			readData := func(name string, destination any) {
				t.Helper()
				match := regexp.MustCompile("window\\." + name + " = JSON.parse\\(`([^`]*)`\\);").FindStringSubmatch(response.Body.String())
				if len(match) != 2 {
					t.Fatalf("missing %s in projects template", name)
				}
				decoded, err := strconv.Unquote(`"` + match[1] + `"`)
				if err != nil {
					t.Fatal(err)
				}
				if err := json.Unmarshal([]byte(decoded), destination); err != nil {
					t.Fatal(err)
				}
			}
			var projects []models.Project
			var goals []models.Goal
			readData("projectList", &projects)
			readData("goalList", &goals)
			if len(goals) == 0 {
				t.Fatal("no goals sent to projects page")
			}
			projectIDs := make(map[int64]bool)
			for _, project := range projects {
				projectIDs[project.ID] = true
			}
			for _, goal := range goals {
				if goal.UserId != 1 || goal.Title == "Other user goal" {
					t.Fatalf("unexpected goal: %+v", goal)
				}
				var ids []int64
				if err := json.Unmarshal([]byte(goal.ProjectIds), &ids); err != nil || len(ids) == 0 {
					t.Fatalf("invalid goal attachments: %q (%v)", goal.ProjectIds, err)
				}
				for _, id := range ids {
					if !projectIDs[id] {
						t.Fatalf("goal refers to missing project %d", id)
					}
				}
			}
		})
	}
}
