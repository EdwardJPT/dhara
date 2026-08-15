package errs

import "errors"

var (
	ErrNoFieldsToUpdate      = errors.New("No fields to update")
	ErrInvalidEmailFormat    = errors.New("Invalid email format")
	ErrUsernameTaken         = errors.New("Username is already taken")
	ErrEmailTaken            = errors.New("Email is already taken")
	ErrUsernameOrEmailTaken  = errors.New("Email or username already taken")
	ErrPasswordTooShort      = errors.New("Password must be at least 8 characters")
	ErrPasswordsMismatch     = errors.New("Passwords do not match")
	ErrPasswordHashingFailed = errors.New("Password hashing failed")
)
