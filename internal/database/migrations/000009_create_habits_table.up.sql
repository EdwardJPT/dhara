CREATE TABLE IF NOT EXISTS habits (
    habit_id            INTEGER PRIMARY KEY,
    habits_group_id     INTEGER NOT NULL,
    user_id             INTEGER NOT NULL,
    habit_title         TEXT NOT NULL,
    habit_icon          TEXT NOT NULL,
    frequency           INTEGER NOT NULL DEFAULT 1,
    is_show             BOOLEAN NOT NULL DEFAULT 1,
    current_streak      INTEGER NOT NULL DEFAULT 0,
    total_completions   INTEGER NOT NULL DEFAULT 0,
    created_at          TEXT NOT NULL DEFAULT (DATETIME()),
    FOREIGN KEY (habits_group_id) REFERENCES habits_group (habits_group_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
