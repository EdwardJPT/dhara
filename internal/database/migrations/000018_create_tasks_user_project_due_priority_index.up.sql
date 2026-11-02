CREATE INDEX IF NOT EXISTS idx_tasks_user_project_due_priority
ON tasks (user_id, project_id ASC, due_date ASC, priority DESC);
