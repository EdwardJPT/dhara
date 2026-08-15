CREATE TRIGGER IF NOT EXISTS update_habits_stats_after_insert_habits_done_date
AFTER INSERT ON habits_done_date
BEGIN
    UPDATE habits
    SET
        total_completions = total_completions + 1,
        current_streak = CASE
            -- Check if a previous log exists within the last 'frequency' days
            WHEN EXISTS (
                SELECT 1
                FROM habits_done_date
                WHERE habit_id = NEW.habit_id
                  AND date(done_date) >= date(NEW.done_date, '-' || frequency || ' days')
                  AND date(done_date) < date(NEW.done_date)
            )
            -- we increase the streak just 1, because this trigger is run by every insert
            -- and the mechanism we update habit with freq more than 1 is by inserting
            -- to habits_done_date freq times
            THEN current_streak + 1
            -- If no log exists within the frequency window, reset to baseline frequency
            ELSE 1
        END
    WHERE habit_id = NEW.habit_id;
END;
