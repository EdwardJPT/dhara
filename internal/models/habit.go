package models

import (
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// HabitsGroup represents a group of habits
type HabitsGroup struct {
	ID               int64  `json:"habits_group_id"`
	HabitsGroupTitle string `json:"habits_group_title"`
	UserId           int64  `json:"user_id"`
	IsShow           bool   `json:"is_show"`
	CreatedAt        string `json:"created_at"`
}

// Habit represents a single habit belonging to a group
type Habit struct {
	HabitID       int64  `json:"habit_id"`
	HabitsGroupID int64  `json:"habits_group_id"`
	UserID        int64  `json:"user_id"`
	HabitTitle    string `json:"habit_title"`
	HabitIcon     string `json:"habit_icon"`
	Frequency     int    `json:"frequency"`
	IsShow        bool   `json:"is_show"`
	CreatedAt     string `json:"created_at"`
}

type HabitsGroupWithHabits struct {
	HabitsGroupID    int64   `json:"habits_group_id" db:"habits_group_id"`
	HabitsGroupTitle string  `json:"habits_group_title" db:"habits_group_title"`
	IsShow           bool    `json:"is_show" db:"is_show"`
	CreatedAt        string  `json:"created_at" db:"created_at"`
	Habits           []Habit `json:"habits"`
}

// It's the type of what we send to the front end, it doesn't match up with
// the schema of our table
type HabitDoneDate struct {
	HabitDateID int64  `json:"habit_date_id"`
	DoneDate    string `json:"done_date"`
	CreatedAt   string `json:"check_in_created_at"`
}

type HabitWithDoneDates struct {
	Habit     Habit                    `json:"habit"`
	DoneDates map[string]HabitDoneDate `json:"done_dates"`
}

type CreateNewHabitRequest struct {
	HabitTitle       string `json:"habit_title"`
	HabitsGroupID    int64  `json:"habits_group_id"`
	HabitsGroupTitle string `json:"habits_group_title"`
	Frequency        int    `json:"frequency"`
	Emoji            string `json:"emoji"`
}

type HabitCheckInRequest struct {
	HabitID       int64 `json:"habit_id"`
	HabitsGroupID int64 `json:"habits_group_id"`
}

type UpdateHabitsGroupIsShowRequest struct {
	HabitsGroupID int64 `json:"habits_group_id"`
	IsShow        bool  `json:"checked"`
}

type HabitDoneInfo struct {
	HabitID    int64  `db:"habit_id"`
	HabitTitle string `db:"habit_title"`
	HabitIcon  string `db:"habit_icon"`
	DoneDate   string `db:"done_date"`
}

type HabitDoneToday struct {
	HabitID          int    `json:"habit_id"`
	HabitsGroupID    int    `json:"habits_group_id"`
	HabitTitle       string `json:"habit_title"`
	HabitIcon        string `json:"habit_icon"`
	Frequency        int    `json:"frequency"`
	CurrentStreak    int    `json:"current_streak"`
	TotalCompletions int    `json:"total_completions"`
	DoneDate         string `json:"done_date"`
	HabitCreatedDate string `json:"habit_created_date"`
}

// Type for when we want to modify the habit
type HabitWithGroup struct {
	HabitID          int64  `json:"habit_id"`
	HabitTitle       string `json:"habit_title"`
	HabitIcon        string `json:"habit_icon"`
	HabitFrequency   int    `json:"habit_frequency"`
	HabitIsShow      bool   `json:"habit_is_show"`
	HabitsGroupTitle string `json:"habits_group_title"`
}

type EditHabitRequest struct {
	HabitTitle     string `json:"habit_title"`
	HabitIcon      string `json:"habit_icon"`
	HabitFrequency int    `json:"habit_frequency"`
	HabitIsShow    bool   `json:"habit_is_show"`
}

// HabitAllStats is used only for scanning the DB row
type HabitAllStats struct {
	HabitID     int64
	HabitTitle  string
	HabitIcon   string
	ThisWeek    int
	ThisMonth   int
	ThreeMonths int
	SixMonths   int
	Last7Days   int
	Last30Days  int
	Last90Days  int
	Last180Days int
	ThisYear    int
	AllTime     int
}

// HabitPerformance is the clean object sent to the frontend
type HabitPerformance struct {
	HabitID    int64  `json:"habit_id"`
	HabitTitle string `json:"habit_title"`
	HabitIcon  string `json:"habit_icon"`
	Count      int    `json:"count"` // The score specifically for this timeframe
}

// BestWorstReport now uses the clean HabitPerformance struct
type BestWorstReport struct {
	BestHabits  []HabitPerformance `json:"best_habits"`
	WorstHabits []HabitPerformance `json:"worst_habits"`
}

type HabitBestWorstStats map[string]*BestWorstReport

// HabitStats contains the details and calculated stats for a single habit
type HabitStats struct {
	HabitID         int64  `json:"habit_id"`
	HabitTitle      string `json:"habit_title"` // Added for frontend context
	HabitIcon       string `json:"habit_icon"`
	CreatedAt       string `json:"created_at"`
	Frequency       int    `json:"frequency"`
	ThisWeek        int    `json:"this_week"`
	ThisMonth       int    `json:"this_month"`
	Last7Days       int    `json:"last_7_days"`
	Last30Days      int    `json:"last_30_days"`
	Last90Days      int    `json:"last_90_days"`
	Last180Days     int    `json:"last_180_days"`
	CurrentQuarter  int    `json:"current_quarter"`
	CurrentSemester int    `json:"current_semester"`
	ThisYear        int    `json:"this_year"`
	AllTime         int    `json:"all_time"`
}

// GroupWithHabitsStats represents the habit group with its nested habit stats array
type GroupWithHabitsStats struct {
	HabitsGroupID    int64        `json:"habits_group_id"`
	HabitsGroupTitle string       `json:"habits_group_title"`
	Habits           []HabitStats `json:"habits"`
}

// DistributionStats holds the conditional aggregations from SQLite
type DistributionStats struct {
	Bucket            int // Represents either Hour (0-23) or Day (0-6)
	ThisWeek          int
	ThisMonth         int
	ThreeMonths       int
	SixMonths         int
	SevenDays         int
	ThirtyDays        int
	NinetyDays        int
	HundredEightyDays int
	ThisYear          int
	AllTime           int
}

// ProductivityPeaks is the text range format ("9AM-11AM")
type ProductivityPeaks struct {
	PeakHours string `json:"peak_hours"`
	PeakDays  string `json:"peak_days"`
}

// AllPeaksMap maps the ReportsTimeRange strings to their specific peaks
// e.g. {"Week": {PeakHours: "9AM", PeakDays: "Tue"}, "All": {...}}
type AllPeaksMap map[string]ProductivityPeaks

// MonthlyConsistency is the aggregated habit completion data for a specific month
type MonthlyConsistency struct {
	Month                 string  `json:"month"` // Format: YYYY-MM
	TotalValidDays        int     `json:"total_valid_days"`
	TotalDoneDays         int     `json:"total_done_days"`
	ConsistencyPercentage float64 `json:"consistency_percentage"`
}

// DayStats holds the calculated percentage for a specific day of the week
type DayStats struct {
	DayOfWeek       string  `json:"day_of_week"` // "Monday", "Tuesday", etc.
	TotalEligible   int     `json:"total_eligible"`
	TotalCompleted  int     `json:"total_completed"`
	ConsistencyRate float64 `json:"consistency_rate"` // 0.0 to 100.0
}

// AllPeriodsConsistencyResponse is the final payload sent to the frontend.
// It maps your exact JS object values (e.g., "3 Months") to their 7-day data.
type WeeklyConsistency map[string][]DayStats

// DailyRawStat is an internal struct used to bridge the Repository and Service
type DailyRawStat struct {
	Date           time.Time
	DayOfWeekInt   int // 0=Sunday, 1=Monday... (SQLite standard)
	TotalEligible  int
	TotalCompleted int
}
