CREATE TRIGGER IF NOT EXISTS decrement_todos_done
AFTER UPDATE OF is_done ON tasks
FOR EACH ROW
WHEN NEW.is_done = 0 AND OLD.is_done = 1
BEGIN
    UPDATE projects
    SET
        to_dos_done = to_dos_done - 1,
        done_date = 0,
        is_done = false
    WHERE project_id = NEW.project_id AND to_dos_done > 0;
END;

