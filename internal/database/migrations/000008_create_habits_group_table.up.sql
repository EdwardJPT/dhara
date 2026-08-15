CREATE TABLE IF NOT EXISTS habits_group (
    habits_group_id     INTEGER PRIMARY KEY,
    habits_group_title  TEXT NOT NULL,
    user_id             INTEGER NOT NULL,
    is_show             BOOLEAN NOT NULL DEFAULT 1,
    created_at          TEXT NOT NULL DEFAULT (DATETIME()),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
