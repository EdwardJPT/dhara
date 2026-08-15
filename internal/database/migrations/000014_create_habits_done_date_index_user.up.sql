CREATE INDEX IF NOT EXISTS idx_habits_done_date_user_id_composite
ON habits_done_date (user_id, habit_id, done_date);

CREATE INDEX IF NOT EXISTS idx_habits_done_date_habit_id_composite
ON habits_done_date (habit_id, done_date, created_at);

CREATE INDEX IF NOT EXISTS idx_habits_done_date_user_id_created_at
ON habits_done_date (user_id, created_at);
