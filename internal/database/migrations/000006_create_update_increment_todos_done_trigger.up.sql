CREATE TRIGGER IF NOT EXISTS increment_todos_done
AFTER UPDATE OF is_done ON tasks
FOR EACH ROW
WHEN NEW.is_done = 1 AND OLD.is_done = 0
BEGIN
    UPDATE projects
    SET
        to_dos_done = to_dos_done + 1,
        done_date = CASE
            WHEN to_dos_all = to_dos_done + 1 THEN UNIXEPOCH()
            ELSE done_date
        END,
        is_done = CASE
            WHEN to_dos_all = to_dos_done + 1 THEN 1
            ELSE is_done
        END
    WHERE project_id = NEW.project_id AND to_dos_done < to_dos_all;
END;
