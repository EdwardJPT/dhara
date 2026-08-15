CREATE TABLE IF NOT EXISTS projects (
    project_id     INTEGER PRIMARY KEY,
    public_id      TEXT NOT NULL UNIQUE DEFAULT '',
    user_id        INTEGER NOT NULL,
    project_title  TEXT NOT NULL,
    project_desc   TEXT NOT NULL DEFAULT '',
    priority       BOOLEAN NOT NULL DEFAULT 0,
    start_date     TEXT NOT NULL DEFAULT CURRENT_DATE,
    due_date       TEXT NOT NULL DEFAULT '',
    to_dos_all     INTEGER NOT NULL DEFAULT 0,
    to_dos_done    INTEGER NOT NULL DEFAULT 0,
    is_done        BOOLEAN NOT NULL DEFAULT 0,
    done_date      INTEGER NOT NULL DEFAULT 0,
    created_at     TEXT NOT NULL DEFAULT (DATETIME()),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
