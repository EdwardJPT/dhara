CREATE TRIGGER IF NOT EXISTS increment_todos_all
AFTER INSERT ON tasks
FOR EACH ROW
BEGIN
	UPDATE projects
	SET
		to_dos_all = to_dos_all + 1,
        is_done = 0,
        done_date = 0,
		to_dos_done = CASE
			WHEN NEW.is_done = 1 THEN to_dos_done + 1
			ELSE to_dos_done
		END
	WHERE project_id = NEW.project_id;
END;
