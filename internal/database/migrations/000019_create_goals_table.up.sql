CREATE TABLE IF NOT EXISTS goals (
    goal_id      INTEGER PRIMARY KEY,
    user_id      INTEGER NOT NULL,
    goal_title   TEXT NOT NULL,
    project_ids  TEXT NOT NULL DEFAULT '[]',
    created_at   TEXT NOT NULL DEFAULT (DATETIME()),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
