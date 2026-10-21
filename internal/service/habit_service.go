package service

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"tasksmanagement/internal/database"
	"tasksmanagement/internal/models"
	"tasksmanagement/internal/repository"
)

type HabitService struct {
	repoHabit   *repository.HabitRepository
	transaction *database.Transaction
}

func NewHabitService(db *sql.DB, repoHabit *repository.HabitRepository) *HabitService {
	return &HabitService{
		repoHabit:   repoHabit,
		transaction: database.InitTransactionObject(db),
	}
}

func (s *HabitService) GetUserHabitsGroups(userId int64) ([]models.HabitsGroupWithHabits, error) {
	return s.repoHabit.GetUserHabitsGroups(userId)
}

func (s *HabitService) GetUserHabitsDoneDate(userId int64) ([]models.HabitWithDoneDates, error) {
	return s.repoHabit.GetUserHabitsDoneDate(userId)
}

func (s *HabitService) UpdateHabitsGroupTitle(groupId int64, title string, userId int64) (int64, error) {
	return s.repoHabit.UpdateHabitsGroupTitle(groupId, title, userId)
}

func (s *HabitService) UpdateHabitsGroupIsShow(req models.UpdateHabitsGroupIsShowRequest, userId int64) (int64, error) {
	return s.repoHabit.UpdateHabitsGroupIsShow(req, userId)
}

// Make sure to import "errors" in your service file if you haven't already
func (s *HabitService) DeleteHabitsGroup(groupId int64, userId int64) error {
	// Check if there are any habits tied to this group
	count, err := s.repoHabit.CountHabitsInGroup(groupId, userId)
	if err != nil {
		return err
	}

	// Reject the request if habits exist
	if count > 0 {
		return errors.New("group is not empty")
	}

	rowsAffected, err := s.repoHabit.DeleteHabitsGroup(groupId, userId)
	if err != nil {
		return err
	}
	if rowsAffected != 1 {
		return errors.New("no rows affected, group might not exist")
	}

	return nil
}

func (s *HabitService) CreateHabit(userId int64, req models.CreateNewHabitRequest) error {
	var groupId int64 = 0
	var tx *sql.Tx = nil
	var err error

	// Create new group if needed
	if req.HabitsGroupTitle != "" {
		tx, err = s.transaction.Start()
		if err != nil {
			return err
		}
		defer tx.Rollback()

		groupId, err = s.repoHabit.CreateGroup(userId, req, tx)
		if err != nil {
			return err
		}
	}

	err = s.repoHabit.Create(userId, req, groupId, tx)
	if err != nil {
		return err
	}

	if tx != nil {
		if err := tx.Commit(); err != nil {
			return err
		}
	}

	return nil
}

func daysBetween(t1str, t2str string) int {
	t1, _ := time.Parse("2006-01-02", t1str)
	t2, _ := time.Parse("2006-01-02", t2str)
	t1 = t1.Truncate(24 * time.Hour)
	t2 = t2.Truncate(24 * time.Hour)
	// Calculate duration and convert to days
	hours := t2.Sub(t1).Hours()
	return int(hours / 24)
}

func (s *HabitService) CheckIn(userId int64, req models.HabitCheckInRequest) ([]int64, []string, error) {
	habitFreq, lastCheckIn, err := s.repoHabit.GetHabitFrequency(userId, req.HabitID)
	if err != nil {
		return nil, nil, err
	}

	// Use UTC for all date generation to prevent server local time bugs
	baseTimeUTC := time.Now().UTC()
	nowStr := baseTimeUTC.Format("2006-01-02")

	// daysAgo is negative
	daysAgo := daysBetween(nowStr, lastCheckIn)

	// Adjust daysAgo based on frequency or lack of previous check-ins
	if -daysAgo > habitFreq || lastCheckIn == "" {
		daysAgo = -habitFreq
	}

	var dates []string
	for i := 0; i < habitFreq; i++ {
		// Calculate the target date using the same UTC base time instance
		d := baseTimeUTC.AddDate(0, 0, daysAgo+i+1)
		dates = append(dates, d.Format("2006-01-02"))
	}

	ids, doneDates, err := s.repoHabit.HabitCheckIn(userId, req, dates)
	if err != nil {
		return nil, nil, err
	}
	return ids, doneDates, nil
}

func (s *HabitService) EditHabit(userId, habitId int64, req models.EditHabitRequest) error {
	return s.repoHabit.EditHabit(userId, habitId, req)
}

func (s *HabitService) DeleteHabit(userId, habitId int64) error {
	return s.repoHabit.DeleteHabit(userId, habitId)
}

func (s *HabitService) GetHabitsDoneToday(userID int64, userOffset string) ([]models.HabitDoneToday, error) {
	return s.repoHabit.GetHabitsDoneToday(userID, userOffset)
}

func (s *HabitService) GetAllBestAndWorst(userID int64, offset, inverseOffset string) (models.HabitBestWorstStats, error) {
	allStats, err := s.repoHabit.GetAllHabitsStatsByUserID(userID, offset, inverseOffset)
	if err != nil {
		return nil, err
	}

	result := make(models.HabitBestWorstStats)

	ranges := []string{
		"Week", "Month", "3 Months", "6 Months",
		"Last 7 days", "Last 30 days", "Last 90 days",
		"Last 180 days", "This Year", "All",
	}

	for _, timeRange := range ranges {
		report := &models.BestWorstReport{
			BestHabits:  make([]models.HabitPerformance, 0),
			WorstHabits: make([]models.HabitPerformance, 0),
		}

		if len(allStats) > 0 {
			highest := -1
			lowest := 999999999

			// Find the highest and lowest scores
			for _, stat := range allStats {
				val := getStatForRange(stat, timeRange)
				if val > highest {
					highest = val
				}
				if val < lowest {
					lowest = val
				}
			}

			// Map only the necessary data to the clean struct
			for _, stat := range allStats {
				val := getStatForRange(stat, timeRange)

				cleanHabit := models.HabitPerformance{
					HabitID:    stat.HabitID,
					HabitTitle: stat.HabitTitle,
					HabitIcon:  stat.HabitIcon,
					Count:      val, // The exact completions for this specific time range
				}

				if val == highest {
					report.BestHabits = append(report.BestHabits, cleanHabit)
				}
				if val == lowest {
					report.WorstHabits = append(report.WorstHabits, cleanHabit)
				}
			}
		}

		result[timeRange] = report
	}

	return result, nil
}

func getStatForRange(stat *models.HabitAllStats, timeRange string) int {
	switch timeRange {
	case "Week":
		return stat.ThisWeek
	case "Month":
		return stat.ThisMonth
	case "3 Months":
		return stat.ThreeMonths
	case "6 Months":
		return stat.SixMonths
	case "Last 7 days":
		return stat.Last7Days
	case "Last 30 days":
		return stat.Last30Days
	case "Last 90 days":
		return stat.Last90Days
	case "Last 180 days":
		return stat.Last180Days
	case "This Year":
		return stat.ThisYear
	case "All":
		return stat.AllTime
	default:
		return 0
	}
}

func (s *HabitService) GetGroupStatsWithHabitsByUserID(userID int64, offset, inverseOffset string) ([]models.GroupWithHabitsStats, error) {
	return s.repoHabit.GetGroupStatsWithHabitsByUserID(userID, offset, inverseOffset)
}

// Helper struct to track maximums
type maxTracker struct {
	MaxCount int
	Bucket   int
}

func (s *HabitService) CalculateAllProductivityPeaks(userID int64, offset, inverseOffset string) (models.AllPeaksMap, error) {
	hourStats, dayStats, err := s.repoHabit.GetAllProductivityDistributions(userID, offset, inverseOffset)
	if err != nil {
		return nil, err
	}

	// Trackers for Hour Peaks
	hPeaks := map[string]*maxTracker{
		"Week":          {MaxCount: -1},
		"Month":         {MaxCount: -1},
		"3 Months":      {MaxCount: -1},
		"6 Months":      {MaxCount: -1},
		"Last 7 days":   {MaxCount: -1},
		"Last 30 days":  {MaxCount: -1},
		"Last 90 days":  {MaxCount: -1},
		"Last 180 days": {MaxCount: -1},
		"This Year":     {MaxCount: -1},
		"All":           {MaxCount: -1},
	}

	// Trackers for Day Peaks
	dPeaks := map[string]*maxTracker{
		"Week":          {MaxCount: -1},
		"Month":         {MaxCount: -1},
		"3 Months":      {MaxCount: -1},
		"6 Months":      {MaxCount: -1},
		"Last 7 days":   {MaxCount: -1},
		"Last 30 days":  {MaxCount: -1},
		"Last 90 days":  {MaxCount: -1},
		"Last 180 days": {MaxCount: -1},
		"This Year":     {MaxCount: -1},
		"All":           {MaxCount: -1},
	}

	// Find max counts for Hours
	for _, h := range hourStats {
		updateMax(hPeaks["Week"], h.Bucket, h.ThisWeek)
		updateMax(hPeaks["Month"], h.Bucket, h.ThisMonth)
		updateMax(hPeaks["3 Months"], h.Bucket, h.ThreeMonths)
		updateMax(hPeaks["6 Months"], h.Bucket, h.SixMonths)
		updateMax(hPeaks["Last 7 days"], h.Bucket, h.SevenDays)
		updateMax(hPeaks["Last 30 days"], h.Bucket, h.ThirtyDays)
		updateMax(hPeaks["Last 90 days"], h.Bucket, h.NinetyDays)
		updateMax(hPeaks["Last 180 days"], h.Bucket, h.HundredEightyDays)
		updateMax(hPeaks["This Year"], h.Bucket, h.ThisYear)
		updateMax(hPeaks["All"], h.Bucket, h.AllTime)
	}

	// Find max counts for Days
	for _, d := range dayStats {
		updateMax(dPeaks["Week"], d.Bucket, d.ThisWeek)
		updateMax(dPeaks["Month"], d.Bucket, d.ThisMonth)
		updateMax(dPeaks["3 Months"], d.Bucket, d.ThreeMonths)
		updateMax(dPeaks["6 Months"], d.Bucket, d.SixMonths)
		updateMax(dPeaks["Last 7 days"], d.Bucket, d.SevenDays)
		updateMax(dPeaks["Last 30 days"], d.Bucket, d.ThirtyDays)
		updateMax(dPeaks["Last 90 days"], d.Bucket, d.NinetyDays)
		updateMax(dPeaks["Last 180 days"], d.Bucket, d.HundredEightyDays)
		updateMax(dPeaks["This Year"], d.Bucket, d.ThisYear)
		updateMax(dPeaks["All"], d.Bucket, d.AllTime)
	}

	// Format ranges into the final Map for the frontend
	finalMap := make(models.AllPeaksMap)
	for key := range hPeaks {
		finalMap[key] = models.ProductivityPeaks{
			PeakHours: formatHourRange(hPeaks[key]),
			PeakDays:  formatDayRange(dPeaks[key]),
		}
	}

	return finalMap, nil
}

// Helpers
func updateMax(tracker *maxTracker, bucket, count int) {
	if count > tracker.MaxCount && count > 0 {
		tracker.MaxCount = count
		tracker.Bucket = bucket
	}
}

func formatHourRange(t *maxTracker) string {
	if t.MaxCount <= 0 {
		return "Not enough data"
	}
	startHour := t.Bucket
	endHour := (startHour + 2) % 24
	return fmt.Sprintf("%s-%s", formatAMPM(startHour), formatAMPM(endHour))
}

func formatDayRange(t *maxTracker) string {
	if t.MaxCount <= 0 {
		return "Not enough data"
	}
	topDay := t.Bucket
	startDay := (topDay - 2 + 7) % 7
	return fmt.Sprintf("%s-%s", dayOfWeekToString(startDay), dayOfWeekToString(topDay))
}

func formatAMPM(hour int) string {
	if hour == 0 {
		return "12AM"
	}
	if hour == 12 {
		return "12PM"
	}
	if hour > 12 {
		return fmt.Sprintf("%dPM", hour-12)
	}
	return fmt.Sprintf("%dAM", hour)
}

func dayOfWeekToString(day int) string {
	days := []string{"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}
	if day < 0 || day > 6 {
		return "Unknown"
	}
	return days[day]
}

func (s *HabitService) GetMonthlyConsistency(userID int64) ([]models.MonthlyConsistency, error) {
	if userID <= 0 {
		return nil, fmt.Errorf("invalid user ID")
	}

	data, err := s.repoHabit.GetLast6MonthsConsistency(userID)
	if err != nil {
		return nil, fmt.Errorf("service failed to get consistency: %w", err)
	}

	// If no data exists yet, return an empty array rather than nil for cleaner JSON mapping
	if data == nil {
		return []models.MonthlyConsistency{}, nil
	}

	return data, nil
}

func (s *HabitService) CalculateAllPeriodsConsistency(userID int64) (models.WeeklyConsistency, error) {
	// Fetch the raw daily stats from the dawn of time to today
	rawStats, err := s.repoHabit.GetAllTimeDailyStats(userID)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	// Define the exact start date for every period based on your requirements
	periodsBoundaries := map[string]time.Time{
		"Week":          getStartOfWeek(today),
		"Month":         time.Date(today.Year(), today.Month(), 1, 0, 0, 0, 0, today.Location()),
		"3 Months":      getStartOfQuarter(today),  // Jan 1, Apr 1, Jul 1, Oct 1
		"6 Months":      getStartOfSemester(today), // Jan 1, Jul 1
		"Last 7 days":   today.AddDate(0, 0, -6),
		"Last 30 days":  today.AddDate(0, 0, -29),
		"Last 90 days":  today.AddDate(0, 0, -89),
		"Last 180 days": today.AddDate(0, 0, -179),
		"This Year":     time.Date(today.Year(), time.January, 1, 0, 0, 0, 0, today.Location()),
		"All":           {}, // The zero-value acts as "beginning of time"
	}

	// Initialize the response payload
	response := make(models.WeeklyConsistency)
	dayNames := []string{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}

	// Set up the 7-day array structure for each period
	for periodName := range periodsBoundaries {
		emptyWeek := make([]models.DayStats, 7)
		for i, name := range dayNames {
			emptyWeek[i] = models.DayStats{DayOfWeek: name}
		}
		response[periodName] = emptyWeek
	}

	// Iterate through the DB results ONCE and distribute the data into the correct periods
	for _, dailyData := range rawStats {
		// Convert SQLite 0 (Sunday) to our array index 6. Mon=0, Tue=1, etc.
		dayIndex := dailyData.DayOfWeekInt - 1
		if dailyData.DayOfWeekInt == 0 {
			dayIndex = 6
		}

		// Check this day against all 10 periods
		for periodName, startDate := range periodsBoundaries {
			// If the date falls within the period boundary, add its stats to that period's bucket
			if !dailyData.Date.Before(startDate) {
				response[periodName][dayIndex].TotalEligible += dailyData.TotalEligible
				response[periodName][dayIndex].TotalCompleted += dailyData.TotalCompleted
			}
		}
	}

	// Calculate final percentages for every day in every period
	for periodName, weekData := range response {
		for i := range weekData {
			if weekData[i].TotalEligible > 0 {
				rate := (float64(weekData[i].TotalCompleted) / float64(weekData[i].TotalEligible)) * 100.0
				response[periodName][i].ConsistencyRate = rate
			}
		}
	}

	return response, nil
}

// --- Helper Functions for Date Math ---

func getStartOfWeek(t time.Time) time.Time {
	weekday := int(t.Weekday())
	if weekday == 0 {
		weekday = 7 // Adjust Sunday from 0 to 7 to find Monday
	}
	return t.AddDate(0, 0, -weekday+1)
}

func getStartOfQuarter(t time.Time) time.Time {
	// Math trick to find the start month of current quarter (1, 4, 7, 10)
	quarterStartMonth := time.Month(((int(t.Month()) - 1) / 3 * 3) + 1)
	return time.Date(t.Year(), quarterStartMonth, 1, 0, 0, 0, 0, t.Location())
}

func getStartOfSemester(t time.Time) time.Time {
	startMonth := time.January
	if t.Month() >= time.July {
		startMonth = time.July
	}
	return time.Date(t.Year(), startMonth, 1, 0, 0, 0, 0, t.Location())
}
