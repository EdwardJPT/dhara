CREATE TRIGGER IF NOT EXISTS decrement_todos_after_tasks_delete
AFTER DELETE ON tasks
FOR EACH ROW
BEGIN
    UPDATE projects
    SET
        to_dos_all  = to_dos_all - 1,
        to_dos_done = CASE
            WHEN OLD.is_done = 1 THEN to_dos_done - 1
            ELSE to_dos_done
        END
    WHERE project_id = OLD.project_id;
END;

