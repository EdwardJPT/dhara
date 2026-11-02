package handlers

import (
	"database/sql"
	"encoding/json"
	"html/template"
	"io/fs"
	"net/http"
	"net/http/httptest"
	"regexp"
	"strconv"
	"testing"

	"tasksmanagement/internal/database"
	"tasksmanagement/internal/models"
	"tasksmanagement/internal/repository"
	"tasksmanagement/internal/service"

	"github.com/go-chi/jwtauth/v5"
)

func TestHomePageGoals(t *testing.T) {
	db, err := sql.Open("sqlite3", ":memory:?_foreign_keys=on")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { db.Close() })
	db.SetMaxOpenConns(1)

	migrations := database.Migrations()
	paths, err := fs.Glob(migrations, "migrations/*.up.sql")
	if err != nil {
		t.Fatal(err)
	}
	for _, path := range paths {
		migration, err := fs.ReadFile(migrations, path)
		if err != nil {
			t.Fatal(err)
		}
		if _, err := db.Exec(string(migration)); err != nil {
			t.Fatalf("apply %s: %v", path, err)
		}
	}
	for _, query := range []string{
		`INSERT INTO users (user_id, username, email, password) VALUES (1, 'first', 'first@example.com', 'test'), (2, 'second', 'second@example.com', 'test'), (3, 'empty', 'empty@example.com', 'test')`,
		`INSERT INTO goals (goal_id, user_id, goal_title, project_ids) VALUES (1, 1, 'Learn databases', '[11,27]'), (2, 2, 'Another user goal', '[42]')`,
		`INSERT INTO goals (goal_id, user_id, goal_title) VALUES (3, 1, 'Read more')`,
	} {
		if _, err := db.Exec(query); err != nil {
			t.Fatal(err)
		}
	}

	tmpl := template.Must(template.ParseGlob("../../web/templates/home/*.html"))
	tmpl = template.Must(tmpl.ParseGlob("../../web/templates/components/*.html"))
	projectRepo := repository.NewProjectRepository(db)
	taskRepo := repository.NewTaskRepository(db)
	handler := &HomeHandler{
		projectService: service.NewProjectService(db, projectRepo, taskRepo),
		taskService:    service.NewTaskService(db, taskRepo, repository.NewUnsortedRepository(db)),
		goalService:    service.NewGoalService(db, repository.NewGoalRepository(db)),
		templates:      tmpl,
	}
	request := func(userID string) *httptest.ResponseRecorder {
		t.Helper()
		token, _, err := jwtauth.New("HS256", []byte("test-secret"), nil).Encode(map[string]interface{}{"user_id": userID})
		if err != nil {
			t.Fatal(err)
		}
		req := httptest.NewRequest(http.MethodGet, "/home", nil)
		req = req.WithContext(jwtauth.NewContext(req.Context(), token, nil))
		response := httptest.NewRecorder()
		handler.HomePage(response, req)
		return response
	}

	for _, test := range []struct {
		name    string
		userID  string
		goalIDs []int64
	}{
		{"own goals", "1", []int64{1, 3}},
		{"other user", "2", []int64{2}},
		{"no goals", "3", []int64{}},
	} {
		t.Run(test.name, func(t *testing.T) {
			response := request(test.userID)
			if response.Code != http.StatusOK {
				t.Fatalf("status = %d, body = %s", response.Code, response.Body.String())
			}
			match := regexp.MustCompile("window.goalList = JSON.parse\\(`([^`]*)`\\);").FindStringSubmatch(response.Body.String())
			if len(match) != 2 {
				t.Fatal("home template did not include goalList using JSON.parse")
			}
			// Decode the JavaScript escapes added inside the template literal.
			goalsJSON, err := strconv.Unquote(`"` + match[1] + `"`)
			if err != nil {
				t.Fatal(err)
			}
			var goals []models.Goal
			if err := json.Unmarshal([]byte(goalsJSON), &goals); err != nil {
				t.Fatal(err)
			}
			if goals == nil || len(goals) != len(test.goalIDs) {
				t.Fatalf("unexpected goals JSON: %s", match[1])
			}
			for i, goal := range goals {
				if goal.ID != test.goalIDs[i] || goal.Title == "" || goal.CreatedAt == "" {
					t.Fatalf("unexpected goal: %+v", goal)
				}
				var projectIDs []int64
				if err := json.Unmarshal([]byte(goal.ProjectIds), &projectIDs); err != nil || projectIDs == nil {
					t.Fatalf("invalid project_ids: %q (%v)", goal.ProjectIds, err)
				}
				if goal.ID == 1 && (len(projectIDs) != 2 || projectIDs[0] != 11 || projectIDs[1] != 27) {
					t.Fatalf("project IDs changed: %v", projectIDs)
				}
				if goal.ID == 3 && goal.ProjectIds != "[]" {
					t.Fatalf("default project_ids = %q", goal.ProjectIds)
				}
			}
		})
	}

	t.Run("rollback and query failure", func(t *testing.T) {
		migration, err := fs.ReadFile(migrations, "migrations/000019_create_goals_table.down.sql")
		if err != nil {
			t.Fatal(err)
		}
		if _, err := db.Exec(string(migration)); err != nil {
			t.Fatal(err)
		}
		if response := request("1"); response.Code != http.StatusInternalServerError {
			t.Fatalf("failed goals query returned status %d", response.Code)
		}
	})
}
