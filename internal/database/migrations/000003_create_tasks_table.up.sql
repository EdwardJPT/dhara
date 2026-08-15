CREATE TABLE IF NOT EXISTS tasks (
    task_id     INTEGER PRIMARY KEY,
    project_id  INTEGER NOT NULL,
    user_id     INTEGER NOT NULL,
    task_title  TEXT NOT NULL,
    task_desc   TEXT NOT NULL DEFAULT '',
    priority    BOOLEAN NOT NULL DEFAULT 0,
    due_date    TEXT NOT NULL DEFAULT '',
    is_done     BOOLEAN NOT NULL DEFAULT 0,
    done_date   INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (DATETIME()),
    FOREIGN KEY (project_id) REFERENCES projects (project_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
