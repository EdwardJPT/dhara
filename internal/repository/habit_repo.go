package repository

import (
	"database/sql"
	"errors"
	"strings"
	"time"

	"tasksmanagement/internal/database"
	"tasksmanagement/internal/models"
)

type HabitRepository struct {
	db *sql.DB
}

func NewHabitRepository(db *sql.DB) *HabitRepository {
	return &HabitRepository{db: db}
}

func (r *HabitRepository) Create(userId int64, req models.CreateNewHabitRequest, groupId int64, tx database.DBTX) error {
	// Declare the conditional variables
	var dbtx database.DBTX = r.db
	var habitsGroupId int64 = req.HabitsGroupID
	// Decide the value of the conditional variables
	if tx != nil && req.HabitsGroupTitle != "" {
		dbtx = tx
		habitsGroupId = groupId
	}
	query := `
		INSERT INTO habits (
			user_id,
			habits_group_id,
			habit_title,
			habit_icon,
			frequency
		) VALUES (?, ?, ?, ?, ?)
	`
	_, err := dbtx.Exec(
		query,
		userId,
		habitsGroupId,
		req.HabitTitle,
		req.Emoji,
		req.Frequency,
	)
	if err != nil {
		return err
	}
	return nil
}

func (r *HabitRepository) CreateGroup(userId int64, req models.CreateNewHabitRequest, tx database.DBTX) (int64, error) {
	query := `
		INSERT INTO habits_group (
			habits_group_title,
			user_id
		) VALUES (?, ?)
	`
	res, err := tx.Exec(query, req.HabitsGroupTitle, userId)
	if err != nil {
		return 0, err
	}
	// Get the rowid for inserting the task
	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}
	return id, nil
}

func (r *HabitRepository) GetUserHabitsGroups(userId int64) ([]models.HabitsGroupWithHabits, error) {
	query := `
		SELECT
			hg.habits_group_id,
			hg.habits_group_title,
			hg.is_show AS group_is_show,
			hg.created_at AS group_created_at,
			h.habit_id,
			h.habit_title,
			h.habit_icon,
			h.frequency,
			h.is_show AS habit_is_show,
			h.created_at AS habit_created_at
		FROM habits_group hg
		LEFT JOIN habits h
			ON hg.habits_group_id = h.habits_group_id AND h.user_id = ?
		WHERE hg.user_id = ?
		ORDER BY hg.habits_group_id, h.habit_id
    `
	rows, err := r.db.Query(query, userId, userId)
	if err != nil {
		return []models.HabitsGroupWithHabits{}, err
	}
	defer rows.Close()

	groupMap := make(map[int64]*models.HabitsGroupWithHabits)
	var resultOrder []int64

	for rows.Next() {
		var groupID int64
		var groupTitle string
		var groupIsShow bool
		var groupCreatedAt string

		// Use sql.Null* types for the right side of the LEFT JOIN
		var habitID sql.NullInt64
		var habitTitle sql.NullString
		var habitIcon sql.NullString
		var habitFreq sql.NullInt32
		var habitIsShow sql.NullBool
		var habitCreatedAt sql.NullString

		err := rows.Scan(
			&groupID,
			&groupTitle,
			&groupIsShow,
			&groupCreatedAt,
			&habitID,
			&habitTitle,
			&habitIcon,
			&habitFreq,
			&habitIsShow,
			&habitCreatedAt,
		)
		if err != nil {
			return []models.HabitsGroupWithHabits{}, err
		}

		// Initialize group if not seen
		if _, exists := groupMap[groupID]; !exists {
			groupMap[groupID] = &models.HabitsGroupWithHabits{
				HabitsGroupID:    groupID,
				HabitsGroupTitle: groupTitle,
				IsShow:           groupIsShow,
				CreatedAt:        groupCreatedAt,
				Habits:           []models.Habit{}, // Defaults to an empty array, not nil
			}
			resultOrder = append(resultOrder, groupID)
		}

		// Only construct and append the habit if the ID is valid (not NULL)
		if habitID.Valid {
			habit := models.Habit{
				HabitID:       habitID.Int64,
				HabitsGroupID: groupID,
				HabitTitle:    habitTitle.String,
				HabitIcon:     habitIcon.String,
				Frequency:     int(habitFreq.Int32),
				IsShow:        habitIsShow.Bool,
				CreatedAt:     habitCreatedAt.String,
			}
			groupMap[groupID].Habits = append(groupMap[groupID].Habits, habit)
		}
	}

	if err := rows.Err(); err != nil {
		return []models.HabitsGroupWithHabits{}, err
	}

	// Reconstruct in original order
	var result []models.HabitsGroupWithHabits
	for _, id := range resultOrder {
		result = append(result, *groupMap[id])
	}

	return result, nil
}

func (r *HabitRepository) GetUserHabitsDoneDate(userId int64) ([]models.HabitWithDoneDates, error) {
	query := `
		SELECT 
			h.habit_id,
			h.habits_group_id,
			h.habit_title,
			h.habit_icon,
			h.frequency,
			h.is_show,
			h.created_at,
			COALESCE(d.habit_date_id, 0) AS habit_date_id,
			COALESCE(d.done_date, '') AS done_date,
			COALESCE(d.created_at, '') AS check_in_created_at
		FROM habits h
		LEFT JOIN habits_done_date d
			ON h.habit_id = d.habit_id
			AND d.done_date >= datetime('now', '-7 months')
		WHERE h.user_id = ?
	`
	rows, err := r.db.Query(query, userId)
	if err != nil {
		return []models.HabitWithDoneDates{}, err
	}
	defer rows.Close()

	habitMap := make(map[int64]*models.HabitWithDoneDates)
	var resultOrder []int64

	for rows.Next() {
		var h models.Habit
		var d models.HabitDoneDate

		err := rows.Scan(
			&h.HabitID,
			&h.HabitsGroupID,
			&h.HabitTitle,
			&h.HabitIcon,
			&h.Frequency,
			&h.IsShow,
			&h.CreatedAt,
			&d.HabitDateID,
			&d.DoneDate,
			&d.CreatedAt,
		)
		if err != nil {
			return []models.HabitWithDoneDates{}, err
		}
		// Group by habit_id
		if _, exists := habitMap[h.HabitID]; !exists {
			habitMap[h.HabitID] = &models.HabitWithDoneDates{
				Habit:     h,
				DoneDates: map[string]models.HabitDoneDate{},
			}
			resultOrder = append(resultOrder, h.HabitID)
		}

		habitMap[h.HabitID].DoneDates[d.DoneDate] = d
	}

	if err = rows.Err(); err != nil {
		return []models.HabitWithDoneDates{}, err
	}

	// Reconstruct in original order
	var result []models.HabitWithDoneDates
	for _, id := range resultOrder {
		result = append(result, *habitMap[id])
	}

	return result, nil
}

func (r *HabitRepository) UpdateHabitsGroupTitle(groupId int64, title string, userId int64) (int64, error) {
	query := `
		UPDATE habits_group
		SET habits_group_title = ?
		WHERE habits_group_id = ? AND user_id = ?
	`
	res, err := r.db.Exec(
		query,
		title,
		groupId,
		userId,
	)

	if err != nil {
		return 0, err
	}

	rowsAffected, err := res.RowsAffected()
	if rowsAffected != 1 || err != nil {
		return 0, err
	}

	return rowsAffected, nil
}

func (r *HabitRepository) UpdateHabitsGroupIsShow(habitsGroupIsShowReq models.UpdateHabitsGroupIsShowRequest, userId int64) (int64, error) {
	query := `
		UPDATE habits_group
		SET is_show = ?
		WHERE habits_group_id = ? AND user_id = ?
	`
	res, err := r.db.Exec(
		query,
		habitsGroupIsShowReq.IsShow,
		habitsGroupIsShowReq.HabitsGroupID,
		userId,
	)
	rowsAffected, err := res.RowsAffected()
	if rowsAffected != 1 || err != nil {
		return 0, err
	}
	return rowsAffected, nil
}

func (r *HabitRepository) CountHabitsInGroup(groupId int64, userId int64) (int, error) {
	var count int
	query := `
		SELECT COUNT(*)
		FROM habits
		WHERE habits_group_id = ? AND user_id = ?
	`
	err := r.db.QueryRow(query, groupId, userId).Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (r *HabitRepository) DeleteHabitsGroup(groupId int64, userId int64) (int64, error) {
	query := `
		DELETE FROM habits_group
		WHERE habits_group_id = ? AND user_id = ?
	`
	res, err := r.db.Exec(
		query,
		groupId,
		userId,
	)

	if err != nil {
		return 0, err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return 0, err
	}

	return rowsAffected, nil
}

func (r *HabitRepository) GetHabitFrequency(userId, habitId int64) (int, string, error) {
	query := `SELECT frequency FROM habits WHERE habit_id = ? AND user_id = ?`
	var frequency int
	err := r.db.QueryRow(query, habitId, userId).Scan(&frequency)
	if err != nil {
		return 0, "", err
	}
	query = `
		SELECT COALESCE(
			(
				SELECT done_date
				FROM habits_done_date
				WHERE habit_id = ? AND user_id = ?
				ORDER BY done_date DESC
				LIMIT 1
			),
			''
		) AS latest_done_date;
	`
	var lastCheckIn string
	err = r.db.QueryRow(query, habitId, userId).Scan(&lastCheckIn)
	return frequency, lastCheckIn, err
}

func (r *HabitRepository) HabitCheckIn(userId int64, req models.HabitCheckInRequest, dates []string) ([]int64, []string, error) {
	var values []string
	var args []any

	for _, d := range dates {
		values = append(values, "(?, ?, ?, ?)")
		args = append(args, userId, req.HabitID, req.HabitsGroupID, d)
	}

	query := `
		INSERT INTO habits_done_date (
			user_id,
			habit_id,
			habits_group_id,
			done_date
		) VALUES ` + strings.Join(values, ",") + " RETURNING habit_date_id, done_date"

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return []int64{}, []string{}, err
	}
	defer rows.Close()

	var ids []int64
	var doneDates []string
	for rows.Next() {
		var id int64
		var doneDate string
		err := rows.Scan(&id, &doneDate)
		if err != nil || id <= 0 {
			return []int64{}, []string{}, err
		}
		ids = append(ids, id)
		doneDates = append(doneDates, doneDate)
	}

	if err = rows.Err(); err != nil {
		return []int64{}, []string{}, err
	}

	return ids, doneDates, nil
}

func (r *HabitRepository) EditHabit(userId, habitId int64, req models.EditHabitRequest) error {
	query := `
		UPDATE habits
		SET
			habit_title = ?,
			habit_icon = ?,
			frequency = ?,
			is_show = ?
		WHERE habit_id = ? AND user_id = ?
	`

	result, err := r.db.Exec(query,
		req.HabitTitle,
		req.HabitIcon,
		req.HabitFrequency,
		req.HabitIsShow,
		habitId,
		userId,
	)
	if err != nil {
		return err
	}

	// Ensure we actually updated something (prevents returning success if the habit didn't exist or didn't belong to the user)
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("no rows updated - habit not found or unauthorized")
	}

	return nil
}

func (r *HabitRepository) DeleteHabit(userId, habitId int64) error {
	// Begin a transaction since we need to delete from multiple tables safely
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}

	// Delete associated dates first to avoid foreign key constraint failures
	deleteDatesQuery := `
		DELETE FROM habits_done_date
		WHERE habit_id = ? AND user_id = ?
	`
	_, err = tx.Exec(deleteDatesQuery, habitId, userId)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Delete the actual habit
	deleteHabitQuery := `
		DELETE FROM habits
		WHERE habit_id = ? AND user_id = ?
	`
	result, err := tx.Exec(deleteHabitQuery, habitId, userId)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Optional: check if a row was actually deleted (to prevent 404s/silent fails)
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		tx.Rollback()
		return err
	}

	if rowsAffected == 0 {
		tx.Rollback()
		// Could return a custom error here like sql.ErrNoRows if you want to handle 404s in the handler
		return nil
	}

	return tx.Commit()
}

func (r *HabitRepository) GetUserHabitsByDoneDate(userId int64) (map[string][]models.HabitDoneInfo, error) {
	query := `
		SELECT
			h.habit_id,
			h.habit_title,
			h.habit_icon,
			hd.done_date
		FROM habits h
		LEFT JOIN habits_done_date hd
			ON h.habit_id = hd.habit_id
		WHERE h.user_id = ? AND hd.done_date IS NOT NULL
		ORDER BY hd.done_date DESC, h.habit_id ASC
	`
	rows, err := r.db.Query(query, userId)
	if err != nil {
		return map[string][]models.HabitDoneInfo{}, err
	}
	defer rows.Close()

	habitsByDoneDate := make(map[string][]models.HabitDoneInfo)

	for rows.Next() {
		var info models.HabitDoneInfo
		if err := rows.Scan(
			&info.HabitID,
			&info.HabitTitle,
			&info.HabitIcon,
			&info.DoneDate,
		); err != nil {
			return map[string][]models.HabitDoneInfo{}, err
		}

		doneDate := info.DoneDate
		habitsByDoneDate[doneDate] = append(habitsByDoneDate[doneDate], info)
	}

	if err = rows.Err(); err != nil {
		return map[string][]models.HabitDoneInfo{}, err
	}

	return habitsByDoneDate, nil
}

func (r *HabitRepository) GetHabitsDoneToday(userID int64, tzOffset string) ([]models.HabitDoneToday, error) {
	// We pass the tzOffset (e.g., "+07:00") directly to SQLite's date modifier
	query := `
		SELECT 
			h.habit_id,
			h.habits_group_id,
			h.habit_title,
			h.habit_icon,
			h.frequency,
			h.current_streak,
			h.total_completions,
			hdd.done_date,
			MAX(
				DATE(h.created_at), DATE('now', '-6 months')
			) AS habit_created_date
		FROM habits h
		INNER JOIN habits_done_date hdd 
			ON h.habit_id = hdd.habit_id
		WHERE h.user_id = ?
		  -- Check if the done_date matches 'today' in the user's timezone
				AND date(hdd.done_date) = date('now', ?);
	`
	rows, err := r.db.Query(query, userID, tzOffset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var habits []models.HabitDoneToday

	for rows.Next() {
		var h models.HabitDoneToday
		err := rows.Scan(
			&h.HabitID,
			&h.HabitsGroupID,
			&h.HabitTitle,
			&h.HabitIcon,
			&h.Frequency,
			&h.CurrentStreak,
			&h.TotalCompletions,
			&h.DoneDate,
			&h.HabitCreatedDate,
		)
		if err != nil {
			return []models.HabitDoneToday{}, err
		}
		habits = append(habits, h)
	}

	if err := rows.Err(); err != nil {
		return []models.HabitDoneToday{}, err
	}

	// Return an empty slice instead of nil if no habits are found
	if habits == nil {
		habits = []models.HabitDoneToday{}
	}

	return habits, nil
}

func (r *HabitRepository) GetAllHabitsStatsByUserID(userID int64, offset, inverseOffset string) ([]*models.HabitAllStats, error) {
	queryTemplate := `
		SELECT
			h.habit_id,
			h.habit_title,
			h.habit_icon,

			-- ====== THIS WEEK ======
			COALESCE(SUM(
				CASE WHEN hdd.done_date >= date(date('now', '@USER_OFFSET', '-' || strftime('%w', 'now', '@USER_OFFSET') || ' days'), '@INVERSE_OFFSET')
					  AND hdd.done_date < date(date('now', '@USER_OFFSET', '+' || (7 - strftime('%w', 'now', '@USER_OFFSET')) || ' days'), '@INVERSE_OFFSET')
				THEN 1 ELSE 0 END
			), 0) AS this_week,

			-- ====== THIS MONTH ======
			COALESCE(SUM(
				CASE WHEN strftime('%Y-%m', hdd.done_date, '@USER_OFFSET') = strftime('%Y-%m', 'now', '@USER_OFFSET')
				THEN 1 ELSE 0 END
			), 0) AS this_month,

			-- ====== THIS QUARTER (3 MONTHS) ======
			COALESCE(SUM(
				CASE WHEN strftime('%Y', hdd.done_date, '@USER_OFFSET') = strftime('%Y', 'now', '@USER_OFFSET')
					  AND (strftime('%m', hdd.done_date, '@USER_OFFSET') + 2) / 3 = (strftime('%m', 'now', '@USER_OFFSET') + 2) / 3
				THEN 1 ELSE 0 END
			), 0) AS three_months,

			-- ====== THIS SEMESTER (6 MONTHS) ======
			COALESCE(SUM(
				CASE WHEN strftime('%Y', hdd.done_date, '@USER_OFFSET') = strftime('%Y', 'now', '@USER_OFFSET')
					  AND (strftime('%m', hdd.done_date, '@USER_OFFSET') + 5) / 6 = (strftime('%m', 'now', '@USER_OFFSET') + 5) / 6
				THEN 1 ELSE 0 END
			), 0) AS six_months,

			-- ====== LAST 7 DAYS ======
			COALESCE(SUM(
				CASE WHEN hdd.done_date >= date(date('now', '@USER_OFFSET', '-7 days'), '@INVERSE_OFFSET')
					  AND hdd.done_date <= date(date('now', '@USER_OFFSET'), '@INVERSE_OFFSET')
				THEN 1 ELSE 0 END
			), 0) AS last_7_days,

			-- ====== LAST 30 DAYS ======
			COALESCE(SUM(
				CASE WHEN hdd.done_date >= date(date('now', '@USER_OFFSET', '-30 days'), '@INVERSE_OFFSET')
					  AND hdd.done_date <= date(date('now', '@USER_OFFSET'), '@INVERSE_OFFSET')
				THEN 1 ELSE 0 END
			), 0) AS last_30_days,

			-- ====== LAST 90 DAYS ======
			COALESCE(SUM(
				CASE WHEN hdd.done_date >= date(date('now', '@USER_OFFSET', '-90 days'), '@INVERSE_OFFSET')
					  AND hdd.done_date <= date(date('now', '@USER_OFFSET'), '@INVERSE_OFFSET')
				THEN 1 ELSE 0 END
			), 0) AS last_90_days,

			-- ====== LAST 180 DAYS ======
			COALESCE(SUM(
				CASE WHEN hdd.done_date >= date(date('now', '@USER_OFFSET', '-180 days'), '@INVERSE_OFFSET')
					  AND hdd.done_date <= date(date('now', '@USER_OFFSET'), '@INVERSE_OFFSET')
				THEN 1 ELSE 0 END
			), 0) AS last_180_days,

			-- ====== THIS YEAR ======
			COALESCE(SUM(
				CASE WHEN strftime('%Y', hdd.done_date, '@USER_OFFSET') = strftime('%Y', 'now', '@USER_OFFSET')
				THEN 1 ELSE 0 END
			), 0) AS this_year,

			-- ====== ALL TIME ======
			COUNT(hdd.habit_date_id) AS all_time

		FROM habits h
		LEFT JOIN habits_done_date hdd ON h.habit_id = hdd.habit_id
		WHERE h.user_id = ?
		GROUP BY h.habit_id;
	`

	// Inject offsets safely
	query := strings.ReplaceAll(queryTemplate, "@USER_OFFSET", offset)
	query = strings.ReplaceAll(query, "@INVERSE_OFFSET", inverseOffset)

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var statsList []*models.HabitAllStats

	for rows.Next() {
		stats := &models.HabitAllStats{}
		err := rows.Scan(
			&stats.HabitID,
			&stats.HabitTitle,
			&stats.HabitIcon,
			&stats.ThisWeek,
			&stats.ThisMonth,
			&stats.ThreeMonths,
			&stats.SixMonths,
			&stats.Last7Days,
			&stats.Last30Days,
			&stats.Last90Days,
			&stats.Last180Days,
			&stats.ThisYear,
			&stats.AllTime,
		)
		if err != nil {
			return nil, err
		}
		statsList = append(statsList, stats)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return statsList, nil
}

func (r *HabitRepository) GetGroupStatsWithHabitsByUserID(userID int64, offset, inverseOffset string) ([]models.GroupWithHabitsStats, error) {
	queryTemplate := `
		SELECT
			hg.habits_group_id,
			hg.habits_group_title,

			h.habit_id,
			h.habit_title,
			h.created_at,
			h.frequency,

			-- ====== THIS WEEK ======
			COALESCE(SUM(
				CASE WHEN hdd.done_date >= datetime(date('now', '@USER_OFFSET', '-' || strftime('%w', 'now', '@USER_OFFSET') || ' days'), '@INVERSE_OFFSET')
					  AND hdd.done_date < datetime(date('now', '@USER_OFFSET', '+' || (7 - strftime('%w', 'now', '@USER_OFFSET')) || ' days'), '@INVERSE_OFFSET')
					 THEN 1 ELSE 0 END
			), 0) AS this_week,

			-- ====== THIS MONTH ======
			COALESCE(SUM(
				CASE WHEN strftime('%Y-%m', hdd.done_date, '@USER_OFFSET') = strftime('%Y-%m', 'now', '@USER_OFFSET')
					 THEN 1 ELSE 0 END
			), 0) AS this_month,

			-- ====== LAST 7 DAYS ======
			COALESCE(SUM(
				CASE WHEN hdd.done_date >= datetime(date('now', '@USER_OFFSET', '-7 days'), '@INVERSE_OFFSET')
					  AND hdd.done_date < datetime(date('now', '@USER_OFFSET', '+1 day'), '@INVERSE_OFFSET')
					 THEN 1 ELSE 0 END
			), 0) AS last_7_days,

			-- ====== LAST 30 DAYS ======
			COALESCE(SUM(
				CASE WHEN hdd.done_date >= datetime(date('now', '@USER_OFFSET', '-30 days'), '@INVERSE_OFFSET')
					  AND hdd.done_date < datetime(date('now', '@USER_OFFSET', '+1 day'), '@INVERSE_OFFSET')
					 THEN 1 ELSE 0 END
			), 0) AS last_30_days,

			-- ====== LAST 90 DAYS ======
			COALESCE(SUM(
				CASE WHEN hdd.done_date >= datetime(date('now', '@USER_OFFSET', '-90 days'), '@INVERSE_OFFSET')
					  AND hdd.done_date < datetime(date('now', '@USER_OFFSET', '+1 day'), '@INVERSE_OFFSET')
					 THEN 1 ELSE 0 END
			), 0) AS last_90_days,

			-- ====== LAST 180 DAYS ======
			COALESCE(SUM(
				CASE WHEN hdd.done_date >= datetime(date('now', '@USER_OFFSET', '-180 days'), '@INVERSE_OFFSET')
					  AND hdd.done_date < datetime(date('now', '@USER_OFFSET', '+1 day'), '@INVERSE_OFFSET')
					 THEN 1 ELSE 0 END
			), 0) AS last_180_days,

			-- ====== THIS QUARTER ======
			COALESCE(SUM(
				CASE WHEN strftime('%Y', hdd.done_date, '@USER_OFFSET') = strftime('%Y', 'now', '@USER_OFFSET')
					  AND (strftime('%m', hdd.done_date, '@USER_OFFSET') + 2) / 3 = (strftime('%m', 'now', '@USER_OFFSET') + 2) / 3
					 THEN 1 ELSE 0 END
			), 0) AS current_quarter,

			-- ====== THIS SEMESTER (HALF-YEAR) ======
			COALESCE(SUM(
				CASE WHEN strftime('%Y', hdd.done_date, '@USER_OFFSET') = strftime('%Y', 'now', '@USER_OFFSET')
					  AND (strftime('%m', hdd.done_date, '@USER_OFFSET') + 5) / 6 = (strftime('%m', 'now', '@USER_OFFSET') + 5) / 6
					 THEN 1 ELSE 0 END
			), 0) AS current_semester,

			-- ====== THIS YEAR ======
			COALESCE(SUM(
				CASE WHEN strftime('%Y', hdd.done_date, '@USER_OFFSET') = strftime('%Y', 'now', '@USER_OFFSET')
					 THEN 1 ELSE 0 END
			), 0) AS this_year,

			-- ====== ALL TIME ======
			COUNT(hdd.habit_date_id) AS all_time

		FROM habits_group hg
		-- Join habits, being careful to only link habits belonging to this user
		LEFT JOIN habits h
			ON hg.habits_group_id = h.habits_group_id
			AND h.user_id = ?
		-- Join done dates, calculating stats purely on this specific habit
		LEFT JOIN habits_done_date hdd
			ON h.habit_id = hdd.habit_id
			AND hdd.user_id = ?
		WHERE hg.user_id = ?
		GROUP BY
			hg.habits_group_id, hg.habits_group_title,
			h.habit_id, h.habit_title, h.created_at, h.frequency
		ORDER BY
			hg.habits_group_id ASC, h.habit_id ASC;
	`

	// Inject the dynamic timezone offsets
	query := strings.ReplaceAll(queryTemplate, "@USER_OFFSET", offset)
	query = strings.ReplaceAll(query, "@INVERSE_OFFSET", inverseOffset)

	// Note: userID is passed 3 times matching the 3 `?` in the query
	rows, err := r.db.Query(query, userID, userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// We use a map to group the nested arrays by Group ID
	groupsMap := make(map[int64]*models.GroupWithHabitsStats)
	var order []int64 // To preserve SQL sort order

	for rows.Next() {
		var groupID int64
		var groupTitle string

		// Use Null-types because LEFT JOIN 'habits' could return nulls if a group is empty
		var habitID sql.NullInt64
		var habitTitle sql.NullString
		var createdAt sql.NullString
		var frequency sql.NullInt64

		// Stats can safely be NullInt64 because COALESCE still yields 0 only if a group/habit exists
		var tw, tm, l7, l30, l90, l180, cq, cs, ty, at sql.NullInt64

		err := rows.Scan(
			&groupID, &groupTitle,
			&habitID, &habitTitle, &createdAt, &frequency,
			&tw, &tm, &l7, &l30, &l90, &l180, &cq, &cs, &ty, &at,
		)
		if err != nil {
			return nil, err
		}

		// Initialize the parent group if we haven't seen it yet
		if _, exists := groupsMap[groupID]; !exists {
			groupsMap[groupID] = &models.GroupWithHabitsStats{
				HabitsGroupID:    groupID,
				HabitsGroupTitle: groupTitle,
				Habits:           []models.HabitStats{}, // Start with an empty array
			}
			order = append(order, groupID)
		}

		// If a habit actually exists for this group row, build and append it
		if habitID.Valid {
			habitStat := models.HabitStats{
				HabitID:         habitID.Int64,
				HabitTitle:      habitTitle.String,
				CreatedAt:       createdAt.String,
				Frequency:       int(frequency.Int64),
				ThisWeek:        int(tw.Int64),
				ThisMonth:       int(tm.Int64),
				Last7Days:       int(l7.Int64),
				Last30Days:      int(l30.Int64),
				Last90Days:      int(l90.Int64),
				Last180Days:     int(l180.Int64),
				CurrentQuarter:  int(cq.Int64),
				CurrentSemester: int(cs.Int64),
				ThisYear:        int(ty.Int64),
				AllTime:         int(at.Int64),
			}
			groupsMap[groupID].Habits = append(groupsMap[groupID].Habits, habitStat)
		}
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	// Assemble map back into a slice following the original SQL order
	var finalResult []models.GroupWithHabitsStats
	for _, id := range order {
		finalResult = append(finalResult, *groupsMap[id])
	}

	return finalResult, nil
}

func (r *HabitRepository) GetAllProductivityDistributions(userID int64, offset, inverseOffset string) ([]models.DistributionStats, []models.DistributionStats, error) {
	// The core SELECT fields are identical for both Hour and Day, only the GROUP BY bucket changes.
	coreSelect := `
		-- Week
		COALESCE(SUM(CASE WHEN created_at >= datetime(date('now', '@USER_OFFSET', '-' || strftime('%w', 'now', '@USER_OFFSET') || ' days'), '@INVERSE_OFFSET')
					  AND created_at < datetime(date('now', '@USER_OFFSET', '+' || (7 - strftime('%w', 'now', '@USER_OFFSET')) || ' days'), '@INVERSE_OFFSET')
					 THEN 1 ELSE 0 END), 0) AS this_week,
		-- Month
		COALESCE(SUM(CASE WHEN strftime('%Y-%m', created_at, '@USER_OFFSET') = strftime('%Y-%m', 'now', '@USER_OFFSET') THEN 1 ELSE 0 END), 0) AS this_month,
		-- 3 Months
		COALESCE(SUM(CASE WHEN created_at >= datetime(date('now', '@USER_OFFSET', '-3 months'), '@INVERSE_OFFSET') THEN 1 ELSE 0 END), 0) AS three_months,
		-- 6 Months
		COALESCE(SUM(CASE WHEN created_at >= datetime(date('now', '@USER_OFFSET', '-6 months'), '@INVERSE_OFFSET') THEN 1 ELSE 0 END), 0) AS six_months,
		-- 7 Days
		COALESCE(SUM(CASE WHEN created_at >= datetime(date('now', '@USER_OFFSET', '-7 days'), '@INVERSE_OFFSET') THEN 1 ELSE 0 END), 0) AS seven_days,
		-- 30 Days
		COALESCE(SUM(CASE WHEN created_at >= datetime(date('now', '@USER_OFFSET', '-30 days'), '@INVERSE_OFFSET') THEN 1 ELSE 0 END), 0) AS thirty_days,
		-- 90 Days
		COALESCE(SUM(CASE WHEN created_at >= datetime(date('now', '@USER_OFFSET', '-90 days'), '@INVERSE_OFFSET') THEN 1 ELSE 0 END), 0) AS ninety_days,
		-- 180 Days
		COALESCE(SUM(CASE WHEN created_at >= datetime(date('now', '@USER_OFFSET', '-180 days'), '@INVERSE_OFFSET') THEN 1 ELSE 0 END), 0) AS one_eighty_days,
		-- This Year
		COALESCE(SUM(CASE WHEN strftime('%Y', created_at, '@USER_OFFSET') = strftime('%Y', 'now', '@USER_OFFSET') THEN 1 ELSE 0 END), 0) AS this_year,
		-- All Time
		COUNT(habit_date_id) AS all_time
	`

	// --- QUERY 1: HOURS ---
	hourQuery := `SELECT CAST(strftime('%H', created_at, '@USER_OFFSET') AS INTEGER) AS bucket, ` + coreSelect + `
				  FROM habits_done_date WHERE user_id = ? GROUP BY bucket`
	hourQuery = strings.ReplaceAll(hourQuery, "@USER_OFFSET", offset)
	hourQuery = strings.ReplaceAll(hourQuery, "@INVERSE_OFFSET", inverseOffset)

	hourRows, err := r.db.Query(hourQuery, userID)
	if err != nil {
		return nil, nil, err
	}
	defer hourRows.Close()

	var hourStats []models.DistributionStats
	for hourRows.Next() {
		var s models.DistributionStats
		if err := hourRows.Scan(&s.Bucket, &s.ThisWeek, &s.ThisMonth, &s.ThreeMonths, &s.SixMonths, &s.SevenDays, &s.ThirtyDays, &s.NinetyDays, &s.HundredEightyDays, &s.ThisYear, &s.AllTime); err != nil {
			return nil, nil, err
		}
		hourStats = append(hourStats, s)
	}

	if err = hourRows.Err(); err != nil {
		return nil, nil, err
	}

	// --- QUERY 2: DAYS ---
	dayQuery := `SELECT CAST(strftime('%w', created_at, '@USER_OFFSET') AS INTEGER) AS bucket, ` + coreSelect + `
				 FROM habits_done_date WHERE user_id = ? GROUP BY bucket`
	dayQuery = strings.ReplaceAll(dayQuery, "@USER_OFFSET", offset)
	dayQuery = strings.ReplaceAll(dayQuery, "@INVERSE_OFFSET", inverseOffset)

	dayRows, err := r.db.Query(dayQuery, userID)
	if err != nil {
		return nil, nil, err
	}
	defer dayRows.Close()

	var dayStats []models.DistributionStats
	for dayRows.Next() {
		var s models.DistributionStats
		if err := dayRows.Scan(&s.Bucket, &s.ThisWeek, &s.ThisMonth, &s.ThreeMonths, &s.SixMonths, &s.SevenDays, &s.ThirtyDays, &s.NinetyDays, &s.HundredEightyDays, &s.ThisYear, &s.AllTime); err != nil {
			return nil, nil, err
		}
		dayStats = append(dayStats, s)
	}

	if err = dayRows.Err(); err != nil {
		return nil, nil, err
	}

	return hourStats, dayStats, nil
}

func (r *HabitRepository) GetLast6MonthsConsistency(userID int64) ([]models.MonthlyConsistency, error) {
	// The query uses 2 parameters: userID for the habits table, and userID for the completions table.
	query := `
		WITH RECURSIVE
		months AS (
			-- Generate the first day of the month for the last 6 months
			SELECT date('now', 'start of month', '-5 months') AS month_start
			UNION ALL
			SELECT date(month_start, '+1 month')
			FROM months
			WHERE month_start < date('now', 'start of month')
		),
		month_habit AS (
			SELECT
				m.month_start,
				h.habit_id,
				-- Calculate exact valid days:
				-- End bound: MIN(today, end of the month)
				-- Start bound: MAX(start of month, habit creation date)
				MAX(0, CAST(
					julianday(MIN(date('now'), date(m.month_start, '+1 month', '-1 day'))) -
					julianday(MAX(m.month_start, date(h.created_at))) + 1
				AS INTEGER)) AS valid_days
			FROM months m
			-- Only include habits that existed before the month ended
			JOIN habits h ON date(h.created_at) <= date(m.month_start, '+1 month', '-1 day')
			WHERE h.user_id = ?
		),
		completions AS (
			SELECT
				habit_id,
				date(done_date, 'start of month') AS month_start,
				COUNT(DISTINCT done_date) AS done_days
			FROM habits_done_date
			WHERE user_id = ? AND done_date >= date('now', 'start of month', '-5 months')
			GROUP BY habit_id, month_start
		)
		SELECT 
			strftime('%Y-%m', mh.month_start) AS month,
			SUM(mh.valid_days) AS total_valid_days,
			SUM(COALESCE(c.done_days, 0)) AS total_done_days,
			ROUND(CAST(SUM(COALESCE(c.done_days, 0)) AS FLOAT) / MAX(1, SUM(mh.valid_days)) * 100, 2) AS consistency_percentage
		FROM month_habit mh
		LEFT JOIN completions c ON mh.habit_id = c.habit_id AND mh.month_start = c.month_start
		WHERE mh.valid_days > 0
		GROUP BY mh.month_start
		ORDER BY mh.month_start DESC;
	`

	rows, err := r.db.Query(query, userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []models.MonthlyConsistency
	for rows.Next() {
		var res models.MonthlyConsistency
		if err := rows.Scan(&res.Month, &res.TotalValidDays, &res.TotalDoneDays, &res.ConsistencyPercentage); err != nil {
			return nil, err
		}
		results = append(results, res)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return results, nil
}

func (r *HabitRepository) GetAllTimeDailyStats(userID int64) ([]models.DailyRawStat, error) {
	// This query calculates daily stats from the user's oldest habit up to today.
	// It handles staggered start dates via `date(eh.created_at) <= ds.dt`.
	query := `
		WITH RECURSIVE
		user_bounds AS (
			SELECT COALESCE(MIN(date(created_at)), date('now', 'localtime')) as start_date,
				   date('now', 'localtime') as end_date
			FROM habits
			WHERE user_id = ?
		),
		date_series(dt) AS (
			SELECT start_date FROM user_bounds
			UNION ALL
			SELECT date(dt, '+1 day') FROM date_series
			WHERE dt < (SELECT end_date FROM user_bounds)
		)
		SELECT
			ds.dt,
			CAST(strftime('%w', ds.dt) AS INTEGER) AS day_of_week,
			COUNT(DISTINCT eh.habit_id) AS total_eligible,
			COUNT(DISTINCT ch.habit_id) AS total_completed
		FROM date_series ds
		LEFT JOIN habits eh
			ON eh.user_id = ? AND date(eh.created_at) <= ds.dt
		LEFT JOIN habits_done_date ch
			ON ch.user_id = ? AND ch.habit_id = eh.habit_id AND ch.done_date = ds.dt
		GROUP BY ds.dt
		ORDER BY ds.dt ASC;
	`

	// Pass userID 3 times for the 3 placeholders in the query
	rows, err := r.db.Query(query, userID, userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []models.DailyRawStat
	for rows.Next() {
		var d models.DailyRawStat
		var dateStr string

		if err := rows.Scan(&dateStr, &d.DayOfWeekInt, &d.TotalEligible, &d.TotalCompleted); err != nil {
			return nil, err
		}

		parsedDate, err := time.Parse("2006-01-02", dateStr)
		if err == nil {
			d.Date = parsedDate
			results = append(results, d)
		}
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return results, nil
}
