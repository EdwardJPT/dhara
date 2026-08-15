CREATE TABLE IF NOT EXISTS unsorted (
    unsorted_id     INTEGER PRIMARY KEY,
    user_id         INTEGER NOT NULL,
    unsorted_title  TEXT NOT NULL,
    unsorted_desc   TEXT NOT NULL DEFAULT '',
    priority        BOOLEAN NOT NULL DEFAULT 0,
    due_date        TEXT NOT NULL DEFAULT '',
    is_done         BOOLEAN NOT NULL DEFAULT 0,
    done_date       INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (DATETIME()),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
