package main

import (
	"log"
	"net/http"
	"os"

	"tasksmanagement/internal/database"
	"tasksmanagement/internal/handlers"
	"tasksmanagement/internal/middleware"
	"tasksmanagement/internal/repository"
	"tasksmanagement/internal/service"

	"github.com/go-chi/chi/v5"
	mw "github.com/go-chi/chi/v5/middleware" // mw == middleware
	"github.com/go-chi/jwtauth/v5"
	"github.com/joho/godotenv"
)

func main() {
	// Load the environment variable
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Failed to load .env file: %v\n", err)
	}

	// Init the databse connection
	db, err := database.InitSQLite()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v\n", err)
	}
	defer db.Close()
	log.Printf("Success connecting to the database.\n")
	log.Printf("Foreign Keys %d\n", database.CheckFK(db))
	log.Printf("Journal Mode %s\n", database.CheckJournalMode(db))
	log.Printf("  Cache Size %d\n", database.CheckCacheSize(db))

	// Run the migration
	err = database.RunMigrations(db)
	if err != nil {
		log.Fatalf("DB Migration failed: %v\n", err)
	}
	log.Println("DB Migration success")

	// Set up the jwt for auth
	jwtSecret := os.Getenv("JWT_SECRET")
	jwt := jwtauth.New("HS256", []byte(jwtSecret), nil)

	// Init Repositories
	userRepo := repository.NewUserRepository(db)
	projectRepo := repository.NewProjectRepository(db)
	taskRepo := repository.NewTaskRepository(db)
	unsortedRepo := repository.NewUnsortedRepository(db)
	habitRepo := repository.NewHabitRepository(db)

	// Init Services
	userService := service.NewUserService(userRepo, jwt)
	projectService := service.NewProjectService(db, projectRepo, taskRepo)
	taskService := service.NewTaskService(db, taskRepo, unsortedRepo)
	habitService := service.NewHabitService(db, habitRepo)

	// Init the handlers by passing the db and jwt
	userHandler := handlers.NewUserHandler(userService)
	homeHandler := handlers.NewHomeHandler(projectService, taskService)
	projectHandler := handlers.NewProjectHandler(projectService, taskService)
	taskHandler := handlers.NewTaskHandler(taskService)
	habitHandler := handlers.NewHabitHandler(habitService)
	calendarHandler := handlers.NewCalendarHandler(db)
	reportHandler := handlers.NewReportHandler(projectService, taskService, habitService)
	demoHandler := handlers.NewDemoHandler(
		projectService, taskService, habitService, taskRepo, unsortedRepo, habitRepo,
	)
	miscHandler := handlers.NewMiscHandler()

	// Init the chi router
	r := chi.NewRouter()
	// Chi basic middlewares
	r.Use(mw.RequestID)
	r.Use(mw.RealIP)
	r.Use(mw.Logger)
	r.Use(mw.Recoverer)
	// Routers
	// Auth routers
	r.Route("/", func(r chi.Router) {
		r.Group(func(r chi.Router) {
			// Middleware that would redirect authenticated users to /home
			r.Use(middleware.AuthenticatedRedirector(jwt))
			r.Get("/", userHandler.SignInPage)
			r.Get("/signup", userHandler.SignUpPage)
		})
		// API/Action endpoints
		r.Post("/", userHandler.SignIn)
		r.Post("/signup", userHandler.SignUp)
		r.Post("/logout", userHandler.SignOut)
	})
	// Home routers - Protected
	r.Route("/home", func(r chi.Router) {
		r.Use(middleware.Auth(jwt))
		r.Get("/", homeHandler.HomePage)
		r.Get("/create-project-form", homeHandler.CreateProjectForm)
		r.Post("/create-project", homeHandler.CreateProject)
	})
	// Setting routers - Protected
	r.Route("/account", func(r chi.Router) {
		r.Use(middleware.Auth(jwt))
		r.Get("/", userHandler.AccountPage)
		r.Get("/form", userHandler.EditAccountForm)
		r.Post("/", userHandler.EditAccount)
	})
	// Projects routers - Protected
	r.Route("/project", func(r chi.Router) {
		r.Use(middleware.Auth(jwt))
		r.Get("/{projectNanoID}", projectHandler.ProjectPage)
		r.Post("/{projectNanoID}", projectHandler.AddTasks)
		r.Patch("/{projectNanoID}", projectHandler.EditProject)
	})
	// Tasks routers - Protected
	r.Route("/task", func(r chi.Router) {
		r.Use(middleware.Auth(jwt))
		r.Put("/{id}", taskHandler.EditTask)
		r.Delete("/{id}", taskHandler.DeleteTask)
		r.Patch("/{id}/status", taskHandler.PatchTaskStatus)
		r.Patch("/{id}/due-date", taskHandler.PatchTaskDueDate)
	})
	r.Route("/unsorted-task", func(r chi.Router) {
		r.Use(middleware.Auth(jwt))
		r.Post("/", taskHandler.CreateUnsortedTask)
		r.Patch("/{id}", taskHandler.PatchUnsortedTask)
		r.Delete("/{id}", taskHandler.DeleteUnsortedTask)
		r.Post("/{id}/assign", taskHandler.AssignUnsortedTask)
	})
	// Habits routers - Protected
	r.Route("/habits", func(r chi.Router) {
		r.Use(middleware.Auth(jwt))
		r.Get("/", habitHandler.HabitPage)
		r.Post("/", habitHandler.AddHabit)
		r.Post("/check-in/{group_id}/{habit_id}", habitHandler.HabitCheckIn)
		r.Patch("/group/{group_id}/is-show", habitHandler.PatchHabitsGroupIsShow)
		r.Patch("/{habit_id}", habitHandler.EditHabit)
		r.Delete("/{habit_id}", habitHandler.DeleteHabit)
	})
	// Calendar routers - Protected
	r.Route("/calendar", func(r chi.Router) {
		r.Use(middleware.Auth(jwt))
		r.Get("/", calendarHandler.CalendarPage)
	})
	// Reports routers - Protected
	r.Route("/reports", func(r chi.Router) {
		r.Use(middleware.Auth(jwt))
		r.Get("/", reportHandler.ReportPage)
	})
	// Demo routers
	r.Route("/demo", func(r chi.Router) {
		r.Get("/", demoHandler.DemoRedirect)
		r.Get("/home", demoHandler.DemoHomePage)
		r.Get("/home/create-project-form", demoHandler.DemoCreateProjectForm)
		r.Get("/project/{projectNanoID}", demoHandler.DemoProjectPage)
		r.Get("/calendar", demoHandler.DemoCalendarPage)
		r.Get("/habits", demoHandler.DemoHabitPage)
		r.Get("/reports", demoHandler.DemoReportPage)
	})
	// Misc routers
	r.Get("/about", miscHandler.AboutPage)
	r.Get("/terms", miscHandler.TermsPage)
	r.Get("/help", miscHandler.HelpPage)
	// 404 handlers
	r.NotFound(handlers.NotFoundHandler)

	// Run the server
	PORT := "5000"
	log.Printf(" Server Port %s\n", PORT)
	http.ListenAndServe(":"+PORT, r)
}
