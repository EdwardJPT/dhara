CREATE TABLE IF NOT EXISTS habits_done_date (
    habit_date_id    INTEGER PRIMARY KEY,
    habit_id         INTEGER NOT NULL,
    habits_group_id  INTEGER NOT NULL,
    user_id          INTEGER NOT NULL,
    done_date        TEXT NOT NULL DEFAULT (DATE()),
    created_at       TEXT NOT NULL DEFAULT (DATETIME()),
    FOREIGN KEY (habit_id) REFERENCES habits (habit_id),
    FOREIGN KEY (habits_group_id) REFERENCES habits_group (habits_group_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
