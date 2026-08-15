CREATE TABLE IF NOT EXISTS users (
    user_id          INTEGER PRIMARY KEY,
    username         TEXT NOT NULL UNIQUE,
    email            TEXT NOT NULL UNIQUE,
    password         TEXT NOT NULL,
    created_at       TEXT NOT NULL DEFAULT (DATETIME()),
    login_timestamp  TEXT NOT NULL DEFAULT ''
);
