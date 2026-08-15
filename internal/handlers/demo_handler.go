package handlers

import (
	"encoding/json"
	"html/template"
	"log"
	"math"
	"net/http"
	"sort"
	"time"

	"tasksmanagement/internal/models"
	"tasksmanagement/internal/repository"
	"tasksmanagement/internal/service"

	"github.com/go-chi/chi/v5"
)

type DemoHandler struct {
	projectService *service.ProjectService
	taskService    *service.TaskService
	habitService   *service.HabitService
	taskRepo       *repository.TaskRepository
	unsortedRepo   *repository.UnsortedRepository
	habitRepo      *repository.HabitRepository
	homeTmpl       *template.Template
	projectTmpl    *template.Template
	calendarTmpl   *template.Template
	reportsTmpl    *template.Template
	habitsTmpl     *template.Template
}

func NewDemoHandler(
	projectService *service.ProjectService,
	taskService *service.TaskService,
	habitService *service.HabitService,
	taskRepo *repository.TaskRepository,
	unsortedRepo *repository.UnsortedRepository,
	habitRepo *repository.HabitRepository,
) *DemoHandler {
	homeTmpl := template.New("")
	homeTmpl = template.Must(homeTmpl.ParseGlob("web/templates/home/*.html"))
	homeTmpl = template.Must(homeTmpl.ParseGlob("web/templates/components/*.html"))

	projectTmpl := template.New("")
	projectTmpl = template.Must(projectTmpl.ParseGlob("web/templates/project/*.html"))
	projectTmpl = template.Must(projectTmpl.ParseGlob("web/templates/components/*.html"))

	calendarTmpl := template.New("")
	calendarTmpl = template.Must(calendarTmpl.ParseGlob("web/templates/calendar/*.html"))
	calendarTmpl = template.Must(calendarTmpl.ParseGlob("web/templates/components/*.html"))

	reportsTmpl := template.New("")
	reportsTmpl = template.Must(reportsTmpl.ParseGlob("web/templates/reports/*.html"))
	reportsTmpl = template.Must(reportsTmpl.ParseGlob("web/templates/components/*.html"))

	habitsTmpl := template.New("")
	habitsTmpl = template.Must(habitsTmpl.ParseGlob("web/templates/habits/*.html"))
	habitsTmpl = template.Must(habitsTmpl.ParseGlob("web/templates/components/*.html"))

	return &DemoHandler{
		projectService: projectService,
		taskService:    taskService,
		habitService:   habitService,
		homeTmpl:       homeTmpl,
		projectTmpl:    projectTmpl,
		calendarTmpl:   calendarTmpl,
		reportsTmpl:    reportsTmpl,
		habitsTmpl:     habitsTmpl,
	}
}

func (h *DemoHandler) generateMockData() ([]models.Project, []models.Task, []models.UnsortedTask) {
	now := time.Now()
	todayStr := now.Format("2006-01-02")

	// Projects
	// 2 priority | 2 non-priority | 1 done
	projects := []models.Project{
		// --- Priority #1 ---
		{
			ID:        1,
			PublicId:  "demo-proj-1",
			UserId:    1,
			Title:     "Product Launch Q3",
			Desc:      "Coordinate all deliverables for the upcoming Q3 product launch.",
			Priority:  true,
			StartDate: now.AddDate(0, 0, -5).Format("2006-01-02"),
			DueDate:   now.AddDate(0, 0, 14).Format("2006-01-02"),
			ToDosAll:  4,
			ToDosDone: 1,
			IsDone:    false,
			DoneDate:  0,
			CreatedAt: now.AddDate(0, 0, -5).Format(time.RFC3339),
		},
		// --- Priority #2 ---
		{
			ID:        2,
			PublicId:  "demo-proj-2",
			UserId:    1,
			Title:     "Website Redesign",
			Desc:      "Overhaul the marketing site with the new brand guidelines.",
			Priority:  true,
			StartDate: now.AddDate(0, 0, -2).Format("2006-01-02"),
			DueDate:   now.AddDate(0, 0, 10).Format("2006-01-02"),
			ToDosAll:  3,
			ToDosDone: 0,
			IsDone:    false,
			DoneDate:  0,
			CreatedAt: now.AddDate(0, 0, -2).Format(time.RFC3339),
		},
		// --- Non-priority #1 ---
		{
			ID:        3,
			PublicId:  "demo-proj-3",
			UserId:    1,
			Title:     "Team Onboarding Docs",
			Desc:      "Write and organise onboarding documentation for new hires.",
			Priority:  false,
			StartDate: now.AddDate(0, 0, -10).Format("2006-01-02"),
			DueDate:   now.AddDate(0, 0, 20).Format("2006-01-02"),
			ToDosAll:  3,
			ToDosDone: 2,
			IsDone:    false,
			DoneDate:  0,
			CreatedAt: now.AddDate(0, 0, -10).Format(time.RFC3339),
		},
		// --- Non-priority #2 ---
		{
			ID:        4,
			PublicId:  "demo-proj-4",
			UserId:    1,
			Title:     "Internal Dashboard",
			Desc:      "Build an analytics dashboard for the ops team.",
			Priority:  false,
			StartDate: now.AddDate(0, 0, -3).Format("2006-01-02"),
			DueDate:   now.AddDate(0, 0, 30).Format("2006-01-02"),
			ToDosAll:  3,
			ToDosDone: 1,
			IsDone:    false,
			DoneDate:  0,
			CreatedAt: now.AddDate(0, 0, -3).Format(time.RFC3339),
		},
		// --- Done ---
		{
			ID:        5,
			PublicId:  "demo-proj-5",
			UserId:    1,
			Title:     "Q2 Retrospective",
			Desc:      "Gather feedback and document lessons learned from Q2.",
			Priority:  false,
			StartDate: now.AddDate(0, -1, -10).Format("2006-01-02"),
			DueDate:   now.AddDate(0, 0, -5).Format("2006-01-02"),
			ToDosAll:  3,
			ToDosDone: 3,
			IsDone:    true,
			DoneDate:  int(now.AddDate(0, 0, -5).Unix()),
			CreatedAt: now.AddDate(0, -1, -10).Format(time.RFC3339),
		},
	}

	// Tasks
	tasks := []models.Task{
		// Project 1 — Product Launch Q3
		{
			ID:        101,
			ProjectId: 1,
			UserId:    1,
			TaskTitle: "Finalise press release",
			TaskDesc:  "Draft and get sign-off on the press release copy.",
			Priority:  true,
			DueDate:   now.AddDate(0, 0, 3).Format("2006-01-02"),
			IsDone:    false,
			DoneDate:  0,
			CreatedAt: now.AddDate(0, 0, -5).Format(time.RFC3339),
		},
		{
			ID:        102,
			ProjectId: 1,
			UserId:    1,
			TaskTitle: "Prepare demo video",
			TaskDesc:  "Record a 2-minute product walkthrough for the launch page.",
			Priority:  true,
			DueDate:   now.AddDate(0, 0, 7).Format("2006-01-02"),
			IsDone:    false,
			DoneDate:  0,
			CreatedAt: now.AddDate(0, 0, -5).Format(time.RFC3339),
		},
		{
			ID:        103,
			ProjectId: 1,
			UserId:    1,
			TaskTitle: "Set up email campaign",
			TaskDesc:  "Configure the launch announcement in the email platform.",
			Priority:  false,
			DueDate:   now.AddDate(0, 0, -3).Format("2006-01-02"),
			IsDone:    false,
			DoneDate:  0,
			CreatedAt: now.AddDate(0, 0, -5).Format(time.RFC3339),
		},
		{
			ID:        104,
			ProjectId: 1,
			UserId:    1,
			TaskTitle: "Align with sales team",
			TaskDesc:  "Brief the sales team on new features and talking points.",
			Priority:  false,
			DueDate:   todayStr,
			IsDone:    true,
			DoneDate:  int(now.AddDate(0, 0, -1).Unix()),
			CreatedAt: now.AddDate(0, 0, -5).Format(time.RFC3339),
		},

		// Project 2 — Website Redesign
		{
			ID:        201,
			ProjectId: 2,
			UserId:    1,
			TaskTitle: "Audit current site",
			TaskDesc:  "Document all existing pages and flag ones to be removed or rewritten.",
			Priority:  true,
			DueDate:   todayStr,
			IsDone:    false,
			DoneDate:  0,
			CreatedAt: now.AddDate(0, 0, -2).Format(time.RFC3339),
		},
		{
			ID:        202,
			ProjectId: 2,
			UserId:    1,
			TaskTitle: "Create wireframes",
			TaskDesc:  "Design low-fidelity wireframes for the homepage and pricing page.",
			Priority:  true,
			DueDate:   now.AddDate(0, 0, 5).Format("2006-01-02"),
			IsDone:    false,
			DoneDate:  0,
			CreatedAt: now.AddDate(0, 0, -2).Format(time.RFC3339),
		},
		{
			ID:        203,
			ProjectId: 2,
			UserId:    1,
			TaskTitle: "Review brand colour palette",
			TaskDesc:  "Confirm typography, colours, and spacing tokens with the design team.",
			Priority:  false,
			DueDate:   now.AddDate(0, 0, 3).Format("2006-01-02"),
			IsDone:    false,
			DoneDate:  0,
			CreatedAt: now.AddDate(0, 0, -2).Format(time.RFC3339),
		},

		// Project 3 — Team Onboarding Docs
		{
			ID:        301,
			ProjectId: 3,
			UserId:    1,
			TaskTitle: "Write engineering setup guide",
			TaskDesc:  "Cover local environment setup, repo access, and CI pipeline.",
			Priority:  false,
			DueDate:   now.AddDate(0, 0, 7).Format("2006-01-02"),
			IsDone:    true,
			DoneDate:  int(now.AddDate(0, 0, -3).Unix()),
			CreatedAt: now.AddDate(0, 0, -10).Format(time.RFC3339),
		},
		{
			ID:        302,
			ProjectId: 3,
			UserId:    1,
			TaskTitle: "Create HR policy summary",
			TaskDesc:  "Summarise leave policy, expense claims, and code of conduct.",
			Priority:  false,
			DueDate:   now.AddDate(0, 0, 10).Format("2006-01-02"),
			IsDone:    true,
			DoneDate:  int(now.AddDate(0, 0, -1).Unix()),
			CreatedAt: now.AddDate(0, 0, -10).Format(time.RFC3339),
		},
		{
			ID:        303,
			ProjectId: 3,
			UserId:    1,
			TaskTitle: "Record intro video",
			TaskDesc:  "Short welcome video from the CEO for the onboarding portal.",
			Priority:  false,
			DueDate:   now.AddDate(0, 0, 20).Format("2006-01-02"),
			IsDone:    false,
			DoneDate:  0,
			CreatedAt: now.AddDate(0, 0, -10).Format(time.RFC3339),
		},

		// Project 4 — Internal Dashboard
		{
			ID:        401,
			ProjectId: 4,
			UserId:    1,
			TaskTitle: "Define KPI requirements",
			TaskDesc:  "Meet with ops to agree on the metrics and data sources needed.",
			Priority:  true,
			DueDate:   todayStr,
			IsDone:    true,
			DoneDate:  int(now.AddDate(0, 0, -2).Unix()),
			CreatedAt: now.AddDate(0, 0, -3).Format(time.RFC3339),
		},
		{
			ID:        402,
			ProjectId: 4,
			UserId:    1,
			TaskTitle: "Set up database connections",
			TaskDesc:  "Connect the dashboard backend to the production read replica.",
			Priority:  false,
			DueDate:   now.AddDate(0, 0, 7).Format("2006-01-02"),
			IsDone:    false,
			DoneDate:  0,
			CreatedAt: now.AddDate(0, 0, -3).Format(time.RFC3339),
		},
		{
			ID:        403,
			ProjectId: 4,
			UserId:    1,
			TaskTitle: "Build chart components",
			TaskDesc:  "Implement bar, line, and pie chart components with live data.",
			Priority:  false,
			DueDate:   now.AddDate(0, 0, 14).Format("2006-01-02"),
			IsDone:    false,
			DoneDate:  0,
			CreatedAt: now.AddDate(0, 0, -3).Format(time.RFC3339),
		},

		// Project 5 — Q2 Retrospective (all done)
		{
			ID:        501,
			ProjectId: 5,
			UserId:    1,
			TaskTitle: "Collect team feedback",
			TaskDesc:  "Send out the retrospective survey and chase responses.",
			Priority:  false,
			DueDate:   now.AddDate(0, -1, 0).Format("2006-01-02"),
			IsDone:    true,
			DoneDate:  int(now.AddDate(0, -1, 0).Unix()),
			CreatedAt: now.AddDate(0, -1, -10).Format(time.RFC3339),
		},
		{
			ID:        502,
			ProjectId: 5,
			UserId:    1,
			TaskTitle: "Summarise findings",
			TaskDesc:  "Compile survey results into a one-page summary doc.",
			Priority:  false,
			DueDate:   now.AddDate(0, 0, -7).Format("2006-01-02"),
			IsDone:    true,
			DoneDate:  int(now.AddDate(0, 0, -7).Unix()),
			CreatedAt: now.AddDate(0, -1, -10).Format(time.RFC3339),
		},
		{
			ID:        503,
			ProjectId: 5,
			UserId:    1,
			TaskTitle: "Present to leadership",
			TaskDesc:  "Walk the leadership team through retro findings and action items.",
			Priority:  false,
			DueDate:   now.AddDate(0, 0, -5).Format("2006-01-02"),
			IsDone:    true,
			DoneDate:  int(now.AddDate(0, 0, -5).Unix()),
			CreatedAt: now.AddDate(0, -1, -10).Format(time.RFC3339),
		},
	}

	// Unsorted tasks
	unsorted := []models.UnsortedTask{
		{
			ID:            1001,
			UserId:        1,
			UnsortedTitle: "Book team lunch venue",
			UnsortedDesc:  "Find a restaurant for the end-of-sprint celebration.",
			Priority:      false,
			DueDate:       now.AddDate(0, 0, 5).Format("2006-01-02"),
			IsDone:        false,
			DoneDate:      0,
			CreatedAt:     now.Format(time.RFC3339),
		},
		{
			ID:            1002,
			UserId:        1,
			UnsortedTitle: "Renew SSL certificate",
			UnsortedDesc:  "Certificate expires in 14 days — renew before auto-expiry.",
			Priority:      true,
			DueDate:       now.AddDate(0, 0, 14).Format("2006-01-02"),
			IsDone:        false,
			DoneDate:      0,
			CreatedAt:     now.Format(time.RFC3339),
		},
		{
			ID:            1003,
			UserId:        1,
			UnsortedTitle: "Reply to vendor quote",
			UnsortedDesc:  "Respond to the software licensing quote from the vendor.",
			Priority:      true,
			DueDate:       todayStr,
			IsDone:        false,
			DoneDate:      0,
			CreatedAt:     now.Format(time.RFC3339),
		},
		{
			ID:            1004,
			UserId:        1,
			UnsortedTitle: "Update README",
			UnsortedDesc:  "Add setup instructions and contribution guidelines.",
			Priority:      false,
			DueDate:       now.AddDate(0, 0, 7).Format("2006-01-02"),
			IsDone:        false,
			DoneDate:      0,
			CreatedAt:     now.Format(time.RFC3339),
		},
		{
			ID:            1005,
			UserId:        1,
			UnsortedTitle: "Back up local configs",
			UnsortedDesc:  "Export and store dotfiles and editor settings.",
			Priority:      false,
			DueDate:       now.AddDate(0, 0, -2).Format("2006-01-02"),
			IsDone:        true,
			DoneDate:      int(now.AddDate(0, 0, -2).Unix()),
			CreatedAt:     now.AddDate(0, 0, -4).Format(time.RFC3339),
		},
	}

	return projects, tasks, unsorted
}

// Convert slices to JSON strings for template injection
func toJSONString(v any) string {
	b, err := json.Marshal(v)
	if err != nil {
		log.Printf("Error marshalling JSON: %v", err)
		return "[]"
	}
	return string(b)
}

func (h *DemoHandler) DemoRedirect(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/demo/home", http.StatusSeeOther)
}

func (h *DemoHandler) DemoHomePage(w http.ResponseWriter, r *http.Request) {
	projects, tasks, unsorteds := h.generateMockData()

	data := struct {
		IsDemo        bool
		ProjectsJSON  template.JS
		TasksJSON     template.JS
		UnsortedsJSON template.JS
	}{
		IsDemo:        true,
		ProjectsJSON:  template.JS(toJSONString(projects)),
		TasksJSON:     template.JS(toJSONString(tasks)),
		UnsortedsJSON: template.JS(toJSONString(unsorteds)),
	}

	err := h.homeTmpl.ExecuteTemplate(w, "home", data)
	if err != nil {
		log.Println("ExecuteTemplate home error:", err)
		http.Error(w, "Failed rendering home page", http.StatusInternalServerError)
	}
}

func (h *DemoHandler) DemoCreateProjectForm(w http.ResponseWriter, r *http.Request) {
	data := struct{ IsDemo bool }{IsDemo: true}
	if err := h.homeTmpl.ExecuteTemplate(w, "create_project", data); err != nil {
		log.Println("ExecuteTemplate home error:", err)
		http.Error(w, "Failed rendering home page", http.StatusInternalServerError)
	}
}

func (h *DemoHandler) DemoProjectPage(w http.ResponseWriter, r *http.Request) {
	// Get project info from url
	projectNanoID := chi.URLParam(r, "projectNanoID")

	projects, allTasks, _ := h.generateMockData()

	var project models.Project
	countPriorityProjects := 0

	projectsLength := len(projects)
	for i := range projectsLength {
		if projects[i].PublicId == projectNanoID {
			project = projects[i]
		}
		if projects[i].Priority {
			countPriorityProjects += 1
		}
	}

	var tasks []models.Task

	tasksLength := len(allTasks)
	for i := range tasksLength {
		if allTasks[i].ProjectId == project.ID {
			tasks = append(tasks, allTasks[i])
		}
	}

	data := struct {
		IsDemo            bool
		ProjectTitle      string
		ProjectJSON       template.JS
		TasksJSON         template.JS
		CountPriorityJSON template.JS
	}{
		IsDemo:            true,
		ProjectTitle:      project.Title,
		ProjectJSON:       template.JS(toJSON(project)),
		TasksJSON:         template.JS(toJSON(tasks)),
		CountPriorityJSON: template.JS(toJSON(countPriorityProjects)),
	}

	err := h.projectTmpl.ExecuteTemplate(w, "project", data)
	if err != nil {
		log.Println("ExecuteTemplate home error:", err)
		http.Error(w, "Failed rendering home page", http.StatusInternalServerError)
	}
}

func (h *DemoHandler) DemoCalendarPage(w http.ResponseWriter, r *http.Request) {
	// Fetch the generated mock data
	projects, tasks, unsorteds := h.generateMockData()

	// Create a lookup map for projects to avoid nested loops (O(1) lookup)
	projectMap := make(map[int64]models.Project)
	for _, p := range projects {
		projectMap[p.ID] = p
	}

	// Transform and group Tasks by Due Date
	tasksGroupByDueDate := make(map[string][]models.TasksWithProject)
	for _, t := range tasks {
		proj := projectMap[t.ProjectId] // Get the matching project

		twp := models.TasksWithProject{
			TaskID:          int64(t.ID),
			TaskTitle:       t.TaskTitle,
			TaskDesc:        t.TaskDesc,
			TaskPriority:    t.Priority,
			TaskDueDate:     t.DueDate,
			TaskIsDone:      t.IsDone,
			TaskDoneDate:    t.DoneDate,
			ProjectTitle:    proj.Title,
			ProjectPriority: proj.Priority,
			ProjectDueDate:  proj.DueDate,
			ProjectIsDone:   proj.IsDone,
			ProjectDoneDate: proj.DoneDate,
		}

		// In Go, appending to a nil slice in a map automatically creates the slice
		tasksGroupByDueDate[twp.TaskDueDate] = append(tasksGroupByDueDate[twp.TaskDueDate], twp)
	}

	// Group Unsorted Tasks by Due Date
	unsortedsGroupByDueDate := make(map[string][]models.UnsortedTask)
	for _, u := range unsorteds {
		unsortedsGroupByDueDate[u.DueDate] = append(unsortedsGroupByDueDate[u.DueDate], u)
	}

	// Habits, still haven't implement it, even in not demo mode
	habitsGroupByDueDate := make(map[string]any)

	// Pass data to template
	data := struct {
		IsDemo               bool
		DueDateTasksJSON     template.JS
		DueDateUnsortedsJSON template.JS
		DueDateHabitsJSON    template.JS
	}{
		IsDemo:               true,
		DueDateTasksJSON:     template.JS(toJSON(tasksGroupByDueDate)),
		DueDateUnsortedsJSON: template.JS(toJSON(unsortedsGroupByDueDate)),
		DueDateHabitsJSON:    template.JS(toJSON(habitsGroupByDueDate)),
	}

	err := h.calendarTmpl.ExecuteTemplate(w, "calendar", data)
	if err != nil {
		log.Println("Template error:", err)
		http.Error(w, "There's a problem in the server.", http.StatusInternalServerError)
	}
}

func (h *DemoHandler) generateMockHabitData() ([]models.HabitsGroupWithHabits, []models.HabitWithDoneDates) {
	now := time.Now()
	timeFormat := "2006-01-02 15:04:05"

	// Store creation times as time.Time so makeDoneDates can compare against them.
	group1Created := now.AddDate(0, -1, -10) // ~40 days ago
	group2Created := now.AddDate(0, -1, -5)  // ~35 days ago
	group3Created := now.AddDate(0, 0, -20)  // 20 days ago

	// Habits
	allHabits := []models.Habit{
		// Group 1 — Morning Routine
		{HabitID: 1, HabitsGroupID: 1, UserID: 1, HabitTitle: "Wake up at 6 am", HabitIcon: "🌅", Frequency: 1, IsShow: true, CreatedAt: group1Created.Format(timeFormat)},
		{HabitID: 2, HabitsGroupID: 1, UserID: 1, HabitTitle: "Meditate", HabitIcon: "🧘", Frequency: 1, IsShow: true, CreatedAt: group1Created.Format(timeFormat)},
		{HabitID: 3, HabitsGroupID: 1, UserID: 1, HabitTitle: "Cold shower", HabitIcon: "🚿", Frequency: 1, IsShow: true, CreatedAt: group1Created.Format(timeFormat)},
		// Group 2 — Health & Fitness
		{HabitID: 4, HabitsGroupID: 2, UserID: 1, HabitTitle: "Exercise", HabitIcon: "💪", Frequency: 1, IsShow: true, CreatedAt: group2Created.Format(timeFormat)},
		{HabitID: 5, HabitsGroupID: 2, UserID: 1, HabitTitle: "Drink 8 glasses of water", HabitIcon: "💧", Frequency: 1, IsShow: true, CreatedAt: group2Created.Format(timeFormat)},
		{HabitID: 6, HabitsGroupID: 2, UserID: 1, HabitTitle: "No junk food", HabitIcon: "🥗", Frequency: 1, IsShow: true, CreatedAt: group2Created.Format(timeFormat)},
		// Group 3 — Learning & Growth
		{HabitID: 7, HabitsGroupID: 3, UserID: 1, HabitTitle: "Read 30 mins", HabitIcon: "📚", Frequency: 1, IsShow: true, CreatedAt: group3Created.Format(timeFormat)},
		{HabitID: 8, HabitsGroupID: 3, UserID: 1, HabitTitle: "Practice coding", HabitIcon: "💻", Frequency: 1, IsShow: true, CreatedAt: group3Created.Format(timeFormat)},
		{HabitID: 9, HabitsGroupID: 3, UserID: 1, HabitTitle: "Journal", HabitIcon: "✍️", Frequency: 1, IsShow: true, CreatedAt: group3Created.Format(timeFormat)},
	}

	// Groups of Habits
	groups := []models.HabitsGroupWithHabits{
		{HabitsGroupID: 1, HabitsGroupTitle: "Morning Routine", IsShow: true, CreatedAt: group1Created.Format(timeFormat), Habits: allHabits[0:3]},
		{HabitsGroupID: 2, HabitsGroupTitle: "Health & Fitness", IsShow: true, CreatedAt: group2Created.Format(timeFormat), Habits: allHabits[3:6]},
		{HabitsGroupID: 3, HabitsGroupTitle: "Learning & Growth", IsShow: true, CreatedAt: group3Created.Format(timeFormat), Habits: allHabits[6:9]},
	}

	// Done Dates
	// createdAt is passed in so we can guard against done dates preceding habit
	// creation.
	makeDoneDates := func(habitID int64, daysAgo []int, createdAt time.Time) map[string]models.HabitDoneDate {
		m := make(map[string]models.HabitDoneDate)
		counter := 1
		for _, d := range daysAgo {
			ts := now.AddDate(0, 0, -d)
			if ts.Before(createdAt) {
				continue // skip — habit didn't exist yet
			}
			dateStr := ts.Format("2006-01-02")
			m[dateStr] = models.HabitDoneDate{
				HabitDateID: habitID*1000 + int64(counter),
				DoneDate:    dateStr,
				CreatedAt:   ts.Format(timeFormat),
			}
			counter++
		}
		return m
	}

	h1 := []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 18, 20, 23, 26, 29}
	h2 := []int{0, 1, 3, 4, 5, 8, 9, 12, 14, 17, 20, 23, 27}
	h3 := []int{2, 6, 11, 17, 23, 29}
	h4 := []int{0, 1, 2, 3, 5, 6, 7, 8, 9, 12, 13, 14, 17, 19, 22, 26}
	h5 := []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 24, 26, 28}
	h6 := []int{0, 2, 3, 6, 7, 10, 11, 15, 18, 22, 25}
	h7 := []int{0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 15, 17, 19, 22}
	h8 := []int{0, 1, 4, 5, 8, 12, 15, 18, 21}
	h9 := []int{3, 8, 14, 20, 27}

	habitsWithDates := []models.HabitWithDoneDates{
		{Habit: allHabits[0], DoneDates: makeDoneDates(1, h1, group1Created)},
		{Habit: allHabits[1], DoneDates: makeDoneDates(2, h2, group1Created)},
		{Habit: allHabits[2], DoneDates: makeDoneDates(3, h3, group1Created)},
		{Habit: allHabits[3], DoneDates: makeDoneDates(4, h4, group2Created)},
		{Habit: allHabits[4], DoneDates: makeDoneDates(5, h5, group2Created)},
		{Habit: allHabits[5], DoneDates: makeDoneDates(6, h6, group2Created)},
		{Habit: allHabits[6], DoneDates: makeDoneDates(7, h7, group3Created)},
		{Habit: allHabits[7], DoneDates: makeDoneDates(8, h8, group3Created)},
		{Habit: allHabits[8], DoneDates: makeDoneDates(9, h9, group3Created)},
	}

	return groups, habitsWithDates
}

// DemoHabitPage serves the habits page with mock data, mirroring HabitHandler.HabitPage.
func (h *DemoHandler) DemoHabitPage(w http.ResponseWriter, r *http.Request) {
	habitsGroups, habitsDate := h.generateMockHabitData()

	data := struct {
		IsDemo         bool
		HabitsJSON     template.JS
		HabitsDateJSON template.JS
	}{
		IsDemo:         true,
		HabitsJSON:     template.JS(toJSON(habitsGroups)),
		HabitsDateJSON: template.JS(toJSON(habitsDate)),
	}
	if err := h.habitsTmpl.ExecuteTemplate(w, "habits", data); err != nil {
		log.Println("Template error:", err)
		http.Error(w, "There's a problem in the server.", http.StatusInternalServerError)
	}
}

func CalculateTaskStats(tasks []models.Task) *models.TaskStats {
	stats := &models.TaskStats{}
	now := time.Now()

	// Truncate "now" to midnight today to match SQLite's date('now') behavior
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	// Define Calendar Boundaries
	// This Week: SQLite %w treats Sunday as 0. Go time.Weekday() also treats Sunday as 0.
	startOfWeek := today.AddDate(0, 0, -int(today.Weekday()))
	endOfWeek := startOfWeek.AddDate(0, 0, 7)

	// This Month
	startOfMonth := time.Date(today.Year(), today.Month(), 1, 0, 0, 0, 0, today.Location())
	endOfMonth := startOfMonth.AddDate(0, 1, 0)

	// Current Quarter
	qMonth := time.Month(((int(today.Month())-1)/3)*3 + 1)
	startOfQuarter := time.Date(today.Year(), qMonth, 1, 0, 0, 0, 0, today.Location())
	endOfQuarter := startOfQuarter.AddDate(0, 3, 0)

	// Current Semester
	sMonth := time.Month(((int(today.Month())-1)/6)*6 + 1)
	startOfSemester := time.Date(today.Year(), sMonth, 1, 0, 0, 0, 0, today.Location())
	endOfSemester := startOfSemester.AddDate(0, 6, 0)

	// This Year
	startOfYear := time.Date(today.Year(), 1, 1, 0, 0, 0, 0, today.Location())
	endOfYear := startOfYear.AddDate(1, 0, 0)

	// Define Rolling Timeframe Boundaries
	// SQL uses `< date('now', '+1 day')` which means up to the end of today
	endRolling := today.AddDate(0, 0, 1)
	startLast7 := today.AddDate(0, 0, -7)
	startLast30 := today.AddDate(0, 0, -30)
	startLast90 := today.AddDate(0, 0, -90)
	startLast180 := today.AddDate(0, 0, -180)

	// Helper to check if the due date falls inside the bounds
	inRange := func(t time.Time, start, end time.Time) bool {
		return !t.Before(start) && t.Before(end)
	}

	// Calculate the stats based strictly on DueDate
	for _, t := range tasks {
		// Mimic the SQL: WHERE due_date != ''
		if t.DueDate == "" {
			continue
		}

		dueDate, err := time.Parse("2006-01-02", t.DueDate)
		if err != nil {
			continue
		}

		// All Time
		stats.AllTimeTotal++
		if t.IsDone {
			stats.AllTimeDone++
		}

		// This Week
		if inRange(dueDate, startOfWeek, endOfWeek) {
			stats.ThisWeekTotal++
			if t.IsDone {
				stats.ThisWeekDone++
			}
		}

		// This Month
		if inRange(dueDate, startOfMonth, endOfMonth) {
			stats.ThisMonthTotal++
			if t.IsDone {
				stats.ThisMonthDone++
			}
		}

		// Current Quarter
		if inRange(dueDate, startOfQuarter, endOfQuarter) {
			stats.CurrentQuarterTotal++
			if t.IsDone {
				stats.CurrentQuarterDone++
			}
		}

		// Current Semester
		if inRange(dueDate, startOfSemester, endOfSemester) {
			stats.CurrentSemesterTotal++
			if t.IsDone {
				stats.CurrentSemesterDone++
			}
		}

		// This Year
		if inRange(dueDate, startOfYear, endOfYear) {
			stats.ThisYearTotal++
			if t.IsDone {
				stats.ThisYearDone++
			}
		}

		// Last 7 Days
		if inRange(dueDate, startLast7, endRolling) {
			stats.Last7DaysTotal++
			if t.IsDone {
				stats.Last7DaysDone++
			}
		}

		// Last 30 Days
		if inRange(dueDate, startLast30, endRolling) {
			stats.Last30DaysTotal++
			if t.IsDone {
				stats.Last30DaysDone++
			}
		}

		// Last 90 Days
		if inRange(dueDate, startLast90, endRolling) {
			stats.Last90DaysTotal++
			if t.IsDone {
				stats.Last90DaysDone++
			}
		}

		// Last 180 Days
		if inRange(dueDate, startLast180, endRolling) {
			stats.Last180DaysTotal++
			if t.IsDone {
				stats.Last180DaysDone++
			}
		}
	}

	return stats
}

// --- Timeframe Helper ---
type Period struct {
	Start time.Time
	End   time.Time
}

func getHabitPeriods(now time.Time) map[string]Period {
	loc := now.Location()

	// Emulate SQL's date('now') by truncating to exactly midnight today
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)
	tomorrow := today.AddDate(0, 0, 1)

	// SQL: strftime('%w', 'now') -> 0 (Sunday) to 6 (Saturday)
	w := int(today.Weekday())

	// THIS WEEK: >= date('now', '-' || w || ' days') AND < date('now', '+' || (7-w) || ' days')
	startOfWeek := today.AddDate(0, 0, -w)
	endOfWeek := today.AddDate(0, 0, 7-w)

	// THIS MONTH
	startOfMonth := time.Date(today.Year(), today.Month(), 1, 0, 0, 0, 0, loc)
	endOfMonth := startOfMonth.AddDate(0, 1, 0)

	// ROLLING DAYS: >= date('now', '-X days') AND < date('now', '+1 day')
	startLast7 := today.AddDate(0, 0, -7)
	startLast30 := today.AddDate(0, 0, -30)
	startLast90 := today.AddDate(0, 0, -90)
	startLast180 := today.AddDate(0, 0, -180)

	// QUARTER
	currentMonth := int(today.Month())
	qStartMonth := time.Month(((currentMonth-1)/3)*3 + 1)
	startOfQuarter := time.Date(today.Year(), qStartMonth, 1, 0, 0, 0, 0, loc)
	endOfQuarter := startOfQuarter.AddDate(0, 3, 0)

	// SEMESTER
	sStartMonth := time.Month(((currentMonth-1)/6)*6 + 1)
	startOfSemester := time.Date(today.Year(), sStartMonth, 1, 0, 0, 0, 0, loc)
	endOfSemester := startOfSemester.AddDate(0, 6, 0)

	// THIS YEAR
	startOfYear := time.Date(today.Year(), 1, 1, 0, 0, 0, 0, loc)
	endOfYear := startOfYear.AddDate(1, 0, 0)

	return map[string]Period{
		"Week":          {Start: startOfWeek, End: endOfWeek},
		"Month":         {Start: startOfMonth, End: endOfMonth},
		"Last 7 days":   {Start: startLast7, End: tomorrow},
		"Last 30 days":  {Start: startLast30, End: tomorrow},
		"Last 90 days":  {Start: startLast90, End: tomorrow},
		"Last 180 days": {Start: startLast180, End: tomorrow},
		"3 Months":      {Start: startOfQuarter, End: endOfQuarter},
		"6 Months":      {Start: startOfSemester, End: endOfSemester},
		"This Year":     {Start: startOfYear, End: endOfYear},
		"All":           {Start: time.Time{}, End: tomorrow},
	}
}

func inPeriod(t time.Time, p Period) bool {
	return !t.Before(p.Start) && t.Before(p.End)
}

func CalcHabitsDoneToday(habits []models.HabitWithDoneDates) []models.HabitDoneToday {
	var result []models.HabitDoneToday
	now := time.Now()
	todayStr := now.Format("2006-01-02")
	yesterdayStr := now.AddDate(0, 0, -1).Format("2006-01-02")

	for _, h := range habits {
		if doneData, ok := h.DoneDates[todayStr]; ok {
			// Calculate Streak
			streak := 0
			currDate := now

			// Check if streak is alive (done today or yesterday)
			if _, doneToday := h.DoneDates[todayStr]; !doneToday {
				if _, doneYest := h.DoneDates[yesterdayStr]; !doneYest {
					goto finalizeHabit // Streak broken
				}
				currDate = now.AddDate(0, 0, -1)
			}

			// Count backwards continuously
			for {
				if _, done := h.DoneDates[currDate.Format("2006-01-02")]; done {
					streak++
					currDate = currDate.AddDate(0, 0, -1)
				} else {
					break
				}
			}

		finalizeHabit:
			result = append(result, models.HabitDoneToday{
				HabitID:          int(h.Habit.HabitID),
				HabitsGroupID:    int(h.Habit.HabitsGroupID),
				HabitTitle:       h.Habit.HabitTitle,
				HabitIcon:        h.Habit.HabitIcon,
				Frequency:        h.Habit.Frequency,
				CurrentStreak:    streak,
				TotalCompletions: len(h.DoneDates),
				DoneDate:         doneData.DoneDate,
				HabitCreatedDate: h.Habit.CreatedAt,
			})
		}
	}
	return result
}

func CalcHabitsGroupStats(groups []models.HabitsGroupWithHabits, habits []models.HabitWithDoneDates) []models.GroupWithHabitsStats {
	var result []models.GroupWithHabitsStats
	// Establish the current time and location bounds (just like SQL 'now' and '@USER_OFFSET')
	now := time.Now()
	loc := now.Location()

	// Truncate 'today' to exactly midnight (00:00:00) in the current timezone
	// This acts exactly like SQL's date('now')
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)
	tomorrow := today.AddDate(0, 0, 1)

	// SQL Logic Equivalents

	// THIS WEEK: Sunday (0) to Saturday (6)
	w := int(today.Weekday())
	startOfWeek := today.AddDate(0, 0, -w)
	endOfWeek := today.AddDate(0, 0, 7-w)
	isThisWeek := func(t time.Time) bool {
		return !t.Before(startOfWeek) && t.Before(endOfWeek)
	}

	// THIS MONTH: Same Year-Month
	isThisMonth := func(t time.Time) bool {
		return t.Year() == today.Year() && t.Month() == today.Month()
	}

	// ROLLING DAYS: >= (today - X days) AND < tomorrow
	isLastXDays := func(t time.Time, days int) bool {
		start := today.AddDate(0, 0, -days)
		return !t.Before(start) && t.Before(tomorrow)
	}

	// THIS QUARTER: Matches SQL (strftime('%m') + 2) / 3
	isCurrentQuarter := func(t time.Time) bool {
		if t.Year() != today.Year() {
			return false
		}
		return (int(t.Month())+2)/3 == (int(today.Month())+2)/3
	}

	// THIS SEMESTER: Matches SQL (strftime('%m') + 5) / 6
	isCurrentSemester := func(t time.Time) bool {
		if t.Year() != today.Year() {
			return false
		}
		return (int(t.Month())+5)/6 == (int(today.Month())+5)/6
	}

	// THIS YEAR: Same Year
	isThisYear := func(t time.Time) bool {
		return t.Year() == today.Year()
	}

	// Map habits for O(1) lookup
	habitMap := make(map[int64]models.HabitWithDoneDates)
	for _, h := range habits {
		habitMap[h.Habit.HabitID] = h
	}

	for _, g := range groups {
		var groupStats models.GroupWithHabitsStats
		groupStats.HabitsGroupID = int64(g.HabitsGroupID)
		groupStats.HabitsGroupTitle = g.HabitsGroupTitle

		for _, h := range g.Habits {
			stats := models.HabitStats{
				HabitID:    h.HabitID,
				HabitTitle: h.HabitTitle,
				HabitIcon:  h.HabitIcon,
				CreatedAt:  h.CreatedAt,
				Frequency:  h.Frequency,
			}

			if hd, ok := habitMap[h.HabitID]; ok {
				for dateStr := range hd.DoneDates {
					// ParseInLocation forces the date string into your local timezone at 00:00:00.
					// time.Parse would default to UTC, breaking the boundary math.
					t, err := time.ParseInLocation("2006-01-02", dateStr, loc)
					if err != nil {
						continue
					}

					// Calculate stats identically to SQL's CASE WHEN ... THEN 1 ELSE 0 END
					if isThisWeek(t) {
						stats.ThisWeek++
					}
					if isThisMonth(t) {
						stats.ThisMonth++
					}
					if isLastXDays(t, 7) {
						stats.Last7Days++
					}
					if isLastXDays(t, 30) {
						stats.Last30Days++
					}
					if isLastXDays(t, 90) {
						stats.Last90Days++
					}
					if isLastXDays(t, 180) {
						stats.Last180Days++
					}
					if isCurrentQuarter(t) {
						stats.CurrentQuarter++
					}
					if isCurrentSemester(t) {
						stats.CurrentSemester++
					}
					if isThisYear(t) {
						stats.ThisYear++
					}
					// All time triggers for any valid date record
					stats.AllTime++
				}
			}
			groupStats.Habits = append(groupStats.Habits, stats)
		}
		result = append(result, groupStats)
	}
	return result
}

func CalcHabitBestWorstStats(groupsStats []models.GroupWithHabitsStats) models.HabitBestWorstStats {
	result := make(models.HabitBestWorstStats)

	// Use the exact frontend keys
	periods := []string{"Week", "Month", "Last 7 days", "Last 30 days", "Last 90 days", "Last 180 days", "3 Months", "6 Months", "This Year", "All"}

	for _, periodName := range periods {
		var allPerformances []models.HabitPerformance

		for _, g := range groupsStats {
			for _, h := range g.Habits {
				count := 0

				// Map the frontend keys to the struct fields
				switch periodName {
				case "Week":
					count = h.ThisWeek
				case "Month":
					count = h.ThisMonth
				case "Last 7 days":
					count = h.Last7Days
				case "Last 30 days":
					count = h.Last30Days
				case "Last 90 days":
					count = h.Last90Days
				case "Last 180 days":
					count = h.Last180Days
				case "3 Months":
					count = h.CurrentQuarter
				case "6 Months":
					count = h.CurrentSemester
				case "This Year":
					count = h.ThisYear
				case "All":
					count = h.AllTime
				}

				allPerformances = append(allPerformances, models.HabitPerformance{
					HabitID:    h.HabitID,
					HabitTitle: h.HabitTitle,
					HabitIcon:  h.HabitIcon,
					Count:      count,
				})
			}
		}

		// Sort by count descending
		sort.Slice(allPerformances, func(i, j int) bool {
			return allPerformances[i].Count > allPerformances[j].Count
		})

		report := &models.BestWorstReport{
			BestHabits:  []models.HabitPerformance{},
			WorstHabits: []models.HabitPerformance{},
		}

		limit := 3
		if len(allPerformances) < limit {
			limit = len(allPerformances)
		}

		for i := 0; i < limit; i++ {
			report.BestHabits = append(report.BestHabits, allPerformances[i])
		}
		for i := len(allPerformances) - 1; i >= len(allPerformances)-limit && i >= 0; i-- {
			report.WorstHabits = append(report.WorstHabits, allPerformances[i])
		}

		result[periodName] = report
	}
	return result
}

func CalcHabitProductivityPeaks(habits []models.HabitWithDoneDates) models.AllPeaksMap {
	result := make(models.AllPeaksMap)
	now := time.Now()
	periods := getHabitPeriods(now)

	for periodName, period := range periods {
		dayCounts := make(map[time.Weekday]int)

		for _, h := range habits {
			for dateStr := range h.DoneDates {
				t, _ := time.Parse("2006-01-02", dateStr)
				if inPeriod(t, period) {
					dayCounts[t.Weekday()]++
				}
			}
		}

		bestDay := "None"
		maxCount := 0
		for day, count := range dayCounts {
			if count > maxCount {
				maxCount = count
				bestDay = day.String()
			}
		}

		// Since mock generation lacks exact hours, use a believable static peak hour block
		// if there's data, else empty.
		peakHours := "08:00 - 10:00"
		if maxCount == 0 {
			peakHours = "None"
		}

		result[periodName] = models.ProductivityPeaks{
			PeakDays:  bestDay,
			PeakHours: peakHours,
		}
	}
	return result
}

func CalcMonthlyConsistency(habits []models.HabitWithDoneDates) []models.MonthlyConsistency {
	var result []models.MonthlyConsistency
	now := time.Now()

	// Calculate for the last 6 months
	for i := 5; i >= 0; i-- {
		targetMonth := now.AddDate(0, -i, 0)
		startOfMonth := time.Date(targetMonth.Year(), targetMonth.Month(), 1, 0, 0, 0, 0, now.Location())
		endOfMonth := startOfMonth.AddDate(0, 1, 0)
		if endOfMonth.After(now) {
			endOfMonth = now.AddDate(0, 0, 1) // Cap at today
		}

		validDays := 0
		doneDays := 0

		for _, h := range habits {
			createdAt, _ := time.Parse("2006-01-02 15:04:05", h.Habit.CreatedAt)

			// Iterate day by day for this month
			for d := startOfMonth; d.Before(endOfMonth); d = d.AddDate(0, 0, 1) {
				if !d.Before(createdAt) {
					validDays++
					if _, ok := h.DoneDates[d.Format("2006-01-02")]; ok {
						doneDays++
					}
				}
			}
		}

		percentage := 0.0
		if validDays > 0 {
			percentage = (float64(doneDays) / float64(validDays)) * 100.0
		}

		result = append(result, models.MonthlyConsistency{
			Month:                 targetMonth.Format("2006-01"),
			TotalValidDays:        validDays,
			TotalDoneDays:         doneDays,
			ConsistencyPercentage: math.Round(percentage*100) / 100, // Round to 2 decimals
		})
	}
	return result
}

func CalcWeeklyConsistency(habits []models.HabitWithDoneDates) models.WeeklyConsistency {
	result := make(models.WeeklyConsistency)
	now := time.Now()
	periods := getHabitPeriods(now)

	weekdays := []time.Weekday{time.Monday, time.Tuesday, time.Wednesday, time.Thursday, time.Friday, time.Saturday, time.Sunday}

	for periodName, period := range periods {
		// Stop counting at today
		end := period.End
		if end.After(now.AddDate(0, 0, 1)) {
			end = now.AddDate(0, 0, 1)
		}

		statsMap := make(map[time.Weekday]*models.DayStats)
		for _, wd := range weekdays {
			statsMap[wd] = &models.DayStats{DayOfWeek: wd.String()}
		}

		for _, h := range habits {
			createdAt, _ := time.Parse("2006-01-02 15:04:05", h.Habit.CreatedAt)

			// Iterate day by day in this period
			for d := period.Start; d.Before(end); d = d.AddDate(0, 0, 1) {
				// Prevent checking dates before epoch / zero dates
				if d.Year() < 2000 {
					continue
				}

				if !d.Before(createdAt) {
					statsMap[d.Weekday()].TotalEligible++
					if _, ok := h.DoneDates[d.Format("2006-01-02")]; ok {
						statsMap[d.Weekday()].TotalCompleted++
					}
				}
			}
		}

		var periodStats []models.DayStats
		for _, wd := range weekdays {
			st := statsMap[wd]
			if st.TotalEligible > 0 {
				st.ConsistencyRate = (float64(st.TotalCompleted) / float64(st.TotalEligible)) * 100.0
				st.ConsistencyRate = math.Round(st.ConsistencyRate*100) / 100
			}
			periodStats = append(periodStats, *st)
		}
		result[periodName] = periodStats
	}
	return result
}

func (h *DemoHandler) DemoReportPage(w http.ResponseWriter, r *http.Request) {
	// Generate mock data
	projects, tasks, _ := h.generateMockData()
	habitGroups, habitsWithDates := h.generateMockHabitData() // Call the habit generator!

	// Process Task Stats
	taskStats := CalculateTaskStats(tasks)

	// Process Habit Stats
	habitsDoneToday := CalcHabitsDoneToday(habitsWithDates)
	habitsGroupStats := CalcHabitsGroupStats(habitGroups, habitsWithDates)

	// Best/Worst requires GroupStats to run first
	habitsBestWorstStats := CalcHabitBestWorstStats(habitsGroupStats)

	habitsProductivityPeaks := CalcHabitProductivityPeaks(habitsWithDates)
	habitsMonthlyConsistency := CalcMonthlyConsistency(habitsWithDates)
	habitsWeeklyConsistency := CalcWeeklyConsistency(habitsWithDates)

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
		IsDemo:                       true,
		Username:                     "Demo User",
		ProjectsJSON:                 template.JS(toJSONString(projects)),
		TasksJSON:                    template.JS(toJSONString(tasks)),
		TaskStatsJSON:                template.JS(toJSONString(taskStats)),
		HabitsDoneTodayJSON:          template.JS(toJSONString(habitsDoneToday)),
		HabitsGroupStatsJSON:         template.JS(toJSONString(habitsGroupStats)),
		HabitsBestWorstStatsJSON:     template.JS(toJSONString(habitsBestWorstStats)),
		HabitsProductivityPeaksJSON:  template.JS(toJSONString(habitsProductivityPeaks)),
		HabitsMonthlyConsistencyJSON: template.JS(toJSONString(habitsMonthlyConsistency)),
		HabitsWeeklyConsistencyJSON:  template.JS(toJSONString(habitsWeeklyConsistency)),
	}

	err := h.reportsTmpl.ExecuteTemplate(w, "reports", data)
	if err != nil {
		log.Println("ExecuteTemplate reports error:", err)
		http.Error(w, "Failed rendering reports page", http.StatusInternalServerError)
	}
}
