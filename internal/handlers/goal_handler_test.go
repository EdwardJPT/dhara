package handlers

import (
	"database/sql"
	"encoding/json"
	"io/fs"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"tasksmanagement/internal/database"
	"tasksmanagement/internal/middleware"
	"tasksmanagement/internal/repository"
	"tasksmanagement/internal/service"
	"tasksmanagement/internal/utils"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
)

func goalCreationTestDB(t *testing.T) *sql.DB {
	t.Helper()
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
		`INSERT INTO users (user_id, username, email, password) VALUES (1, 'first', 'first@example.com', 'test'), (2, 'second', 'second@example.com', 'test')`,
		`INSERT INTO projects (project_id, public_id, user_id, project_title, is_done) VALUES (11, 'first', 1, 'First project', 0), (12, 'second', 1, 'Second project', 0), (13, 'finished', 1, 'Finished project', 1), (21, 'other', 2, 'Other user project', 0)`,
	} {
		if _, err := db.Exec(query); err != nil {
			t.Fatal(err)
		}
	}
	return db
}

func TestAddGoal(t *testing.T) {
	for _, test := range []struct {
		name          string
		body          string
		status        int
		wantIDs       string
		unauthorized  bool
		invalidUserID bool
		missingTable  bool
	}{
		{name: "create", body: `{"goal":"  Learn databases  ","project_ids":[11,12]}`, status: http.StatusCreated, wantIDs: "[11,12]"},
		{name: "duplicate project IDs", body: `{"goal":"Learn databases","project_ids":[11,11,12]}`, status: http.StatusCreated, wantIDs: "[11,12]"},
		{name: "empty project array", body: `{"goal":"Learn databases","project_ids":[]}`, status: http.StatusBadRequest},
		{name: "missing project array", body: `{"goal":"Learn databases"}`, status: http.StatusBadRequest},
		{name: "null project array", body: `{"goal":"Learn databases","project_ids":null}`, status: http.StatusBadRequest},
		{name: "user ID comes from authentication", body: `{"goal":"Learn databases","user_id":2,"project_ids":[11]}`, status: http.StatusCreated, wantIDs: "[11]"},
		{name: "empty title", body: `{"goal":"","project_ids":[11]}`, status: http.StatusBadRequest},
		{name: "blank title", body: `{"goal":" \n\t ","project_ids":[11]}`, status: http.StatusBadRequest},
		{name: "missing title", body: `{"project_ids":[11]}`, status: http.StatusBadRequest},
		{name: "malformed JSON", body: `{"goal":`, status: http.StatusBadRequest},
		{name: "string project ID", body: `{"goal":"Learn databases","project_ids":["11"]}`, status: http.StatusBadRequest},
		{name: "fractional project ID", body: `{"goal":"Learn databases","project_ids":[11.5]}`, status: http.StatusBadRequest},
		{name: "finished project", body: `{"goal":"Learn databases","project_ids":[13]}`, status: http.StatusBadRequest},
		{name: "other user project", body: `{"goal":"Learn databases","project_ids":[21]}`, status: http.StatusBadRequest},
		{name: "mixed ownership", body: `{"goal":"Learn databases","project_ids":[11,21]}`, status: http.StatusBadRequest},
		{name: "nonexistent project", body: `{"goal":"Learn databases","project_ids":[999]}`, status: http.StatusBadRequest},
		{name: "negative project ID", body: `{"goal":"Learn databases","project_ids":[-1]}`, status: http.StatusBadRequest},
		{name: "zero project ID", body: `{"goal":"Learn databases","project_ids":[0]}`, status: http.StatusBadRequest},
		{name: "unauthenticated", body: `{"goal":"Learn databases","project_ids":[11]}`, status: http.StatusSeeOther, unauthorized: true},
		{name: "invalid user claim", body: `{"goal":"Learn databases","project_ids":[11]}`, status: http.StatusUnauthorized, invalidUserID: true},
		{name: "database error", body: `{"goal":"Learn databases","project_ids":[11]}`, status: http.StatusInternalServerError, missingTable: true},
	} {
		t.Run(test.name, func(t *testing.T) {
			db := goalCreationTestDB(t)
			repo := repository.NewGoalRepository(db)
			handler := NewGoalHandler(service.NewGoalService(db, repo))
			jwt := jwtauth.New("HS256", []byte("test-secret"), nil)
			router := chi.NewRouter()
			router.Route("/goals", func(r chi.Router) {
				r.Use(middleware.Auth(jwt))
				r.Post("/", handler.AddGoal)
			})
			if test.missingTable {
				if _, err := db.Exec("DROP TABLE goals"); err != nil {
					t.Fatal(err)
				}
			}

			req := httptest.NewRequest(http.MethodPost, "/goals", strings.NewReader(test.body))
			req.Header.Set("Content-Type", "application/json")
			if !test.unauthorized {
				var userID any = "1"
				if test.invalidUserID {
					userID = 1
				}
				_, token, err := jwt.Encode(map[string]interface{}{"user_id": userID})
				if err != nil {
					t.Fatal(err)
				}
				req.AddCookie(&http.Cookie{Name: "bearer", Value: token})
			}
			response := httptest.NewRecorder()
			router.ServeHTTP(response, req)
			if response.Code != test.status {
				t.Fatalf("status = %d, want %d; body = %s", response.Code, test.status, response.Body.String())
			}
			if test.unauthorized {
				if response.Header().Get("Location") != "/" {
					t.Fatal("unauthenticated request did not redirect to login")
				}
			} else {
				var payload utils.APIResponse
				if err := json.Unmarshal(response.Body.Bytes(), &payload); err != nil {
					t.Fatal(err)
				}
				if response.Header().Get("Content-Type") != "application/json" || payload.Success != (test.status == http.StatusCreated) {
					t.Fatalf("unexpected API response: %+v", payload)
				}
				if test.status != http.StatusCreated && payload.Message == "" {
					t.Fatal("failed response has no error message")
				}
			}
			if test.missingTable {
				if err := db.Ping(); err != nil {
					t.Fatal(err)
				}
				return
			}

			goals, err := repo.GetUserGoals(1)
			if err != nil {
				t.Fatal(err)
			}
			if test.status != http.StatusCreated {
				if len(goals) != 0 {
					t.Fatalf("failed creation persisted goals: %+v", goals)
				}
				return
			}
			if len(goals) != 1 {
				t.Fatalf("created %d goals, want 1", len(goals))
			}
			goal := goals[0]
			if goal.ID <= 0 || goal.UserId != 1 || goal.Title != "Learn databases" || goal.ProjectIds != test.wantIDs || goal.CreatedAt == "" {
				t.Fatalf("unexpected saved goal: %+v", goal)
			}
			var ids []int64
			if err := json.Unmarshal([]byte(goal.ProjectIds), &ids); err != nil || ids == nil {
				t.Fatalf("project_ids is not a JSON array: %q (%v)", goal.ProjectIds, err)
			}
			otherGoals, err := repo.GetUserGoals(2)
			if err != nil || len(otherGoals) != 0 {
				t.Fatalf("goal was attached to the wrong user: %+v (%v)", otherGoals, err)
			}
		})
	}
}

func TestManageGoal(t *testing.T) {
	for _, test := range []struct {
		name, method, path, body string
		status                   int
		wantIDs                  string
		unauthorized             bool
	}{
		{name: "rename and keep finished attachment", method: "PATCH", path: "/goals/1", body: `{"goal":"  Updated goal  ","project_ids":[11,13]}`, status: http.StatusOK, wantIDs: "[11,13]"},
		{name: "change attachments", method: "PATCH", path: "/goals/1", body: `{"goal":"Updated goal","project_ids":[12]}`, status: http.StatusOK, wantIDs: "[12]"},
		{name: "finished project only", method: "PATCH", path: "/goals/1", body: `{"goal":"Updated goal","project_ids":[13]}`, status: http.StatusOK, wantIDs: "[13]"},
		{name: "deduplicate attachments", method: "PATCH", path: "/goals/1", body: `{"goal":"Updated goal","project_ids":[13,13]}`, status: http.StatusOK, wantIDs: "[13]"},
		{name: "empty attachments", method: "PATCH", path: "/goals/1", body: `{"goal":"Updated goal","project_ids":[]}`, status: http.StatusBadRequest},
		{name: "missing attachments", method: "PATCH", path: "/goals/1", body: `{"goal":"Updated goal"}`, status: http.StatusBadRequest},
		{name: "empty title", method: "PATCH", path: "/goals/1", body: `{"goal":" ","project_ids":[11]}`, status: http.StatusBadRequest},
		{name: "invalid JSON", method: "PATCH", path: "/goals/1", body: `{"goal":`, status: http.StatusBadRequest},
		{name: "other user project", method: "PATCH", path: "/goals/1", body: `{"goal":"Updated goal","project_ids":[11,21]}`, status: http.StatusBadRequest},
		{name: "missing project", method: "PATCH", path: "/goals/1", body: `{"goal":"Updated goal","project_ids":[999]}`, status: http.StatusBadRequest},
		{name: "other user goal", method: "PATCH", path: "/goals/2", body: `{"goal":"Updated goal","project_ids":[11]}`, status: http.StatusNotFound},
		{name: "missing goal", method: "PATCH", path: "/goals/999", body: `{"goal":"Updated goal","project_ids":[11]}`, status: http.StatusNotFound},
		{name: "invalid goal ID", method: "PATCH", path: "/goals/invalid", body: `{"goal":"Updated goal","project_ids":[11]}`, status: http.StatusBadRequest},
		{name: "unauthenticated edit", method: "PATCH", path: "/goals/1", body: `{"goal":"Updated goal","project_ids":[11]}`, status: http.StatusSeeOther, unauthorized: true},
		{name: "delete goal", method: "DELETE", path: "/goals/1", status: http.StatusOK},
		{name: "delete other user goal", method: "DELETE", path: "/goals/2", status: http.StatusNotFound},
		{name: "delete missing goal", method: "DELETE", path: "/goals/999", status: http.StatusNotFound},
		{name: "delete invalid goal ID", method: "DELETE", path: "/goals/0", status: http.StatusBadRequest},
		{name: "unauthenticated delete", method: "DELETE", path: "/goals/1", status: http.StatusSeeOther, unauthorized: true},
	} {
		t.Run(test.name, func(t *testing.T) {
			db := goalCreationTestDB(t)
			if _, err := db.Exec(`INSERT INTO goals (goal_id, user_id, goal_title, project_ids) VALUES (1, 1, 'Original goal', '[11,13]'), (2, 2, 'Other goal', '[21]')`); err != nil {
				t.Fatal(err)
			}
			repo := repository.NewGoalRepository(db)
			handler := NewGoalHandler(service.NewGoalService(db, repo))
			jwt := jwtauth.New("HS256", []byte("test-secret"), nil)
			router := chi.NewRouter()
			router.Route("/goals", func(r chi.Router) {
				r.Use(middleware.Auth(jwt))
				r.Patch("/{goal_id}", handler.EditGoal)
				r.Delete("/{goal_id}", handler.DeleteGoal)
			})
			req := httptest.NewRequest(test.method, test.path, strings.NewReader(test.body))
			req.Header.Set("Content-Type", "application/json")
			if !test.unauthorized {
				_, token, err := jwt.Encode(map[string]interface{}{"user_id": "1"})
				if err != nil {
					t.Fatal(err)
				}
				req.AddCookie(&http.Cookie{Name: "bearer", Value: token})
			}
			response := httptest.NewRecorder()
			router.ServeHTTP(response, req)
			if response.Code != test.status {
				t.Fatalf("status = %d, want %d; body = %s", response.Code, test.status, response.Body.String())
			}
			if !test.unauthorized {
				var payload utils.APIResponse
				if err := json.Unmarshal(response.Body.Bytes(), &payload); err != nil {
					t.Fatal(err)
				}
				if payload.Success != (test.status == http.StatusOK) {
					t.Fatalf("unexpected API response: %+v", payload)
				}
			}
			goals, err := repo.GetUserGoals(1)
			if err != nil {
				t.Fatal(err)
			}
			if test.method == "DELETE" && test.status == http.StatusOK {
				if len(goals) != 0 {
					t.Fatal("goal was not deleted")
				}
			} else {
				if len(goals) != 1 {
					t.Fatalf("unexpected own goals: %+v", goals)
				}
				wantTitle, wantIDs := "Original goal", "[11,13]"
				if test.status == http.StatusOK {
					wantTitle, wantIDs = "Updated goal", test.wantIDs
				}
				if goals[0].Title != wantTitle || goals[0].ProjectIds != wantIDs {
					t.Fatalf("unexpected saved goal: %+v", goals[0])
				}
			}
			otherGoals, err := repo.GetUserGoals(2)
			if err != nil || len(otherGoals) != 1 || otherGoals[0].Title != "Other goal" || otherGoals[0].ProjectIds != "[21]" {
				t.Fatalf("other user's goal changed: %+v (%v)", otherGoals, err)
			}
			var projectCount int
			if err := db.QueryRow("SELECT COUNT(*) FROM projects").Scan(&projectCount); err != nil || projectCount != 4 {
				t.Fatalf("projects changed: %d (%v)", projectCount, err)
			}
		})
	}
}
