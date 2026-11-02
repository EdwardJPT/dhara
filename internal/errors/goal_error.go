package errs

import "errors"

var (
	ErrEmptyGoal                 = errors.New("Goal cannot be empty")
	ErrEmptyGoalProjects         = errors.New("Please attach at least one project.")
	ErrInvalidGoalProjects       = errors.New("Please select only your unfinished projects")
	ErrInvalidGoalUpdateProjects = errors.New("Please select only your projects")
	ErrGoalNotFound              = errors.New("Goal not found")
)
