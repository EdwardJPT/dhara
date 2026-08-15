package repository

import (
	"database/sql"
	"errors"
	"strings"

	"tasksmanagement/internal/models"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CheckDuplicate(email, username string) (int64, error) {
	query := `SELECT user_id FROM users WHERE email = ? OR username = ?`
	var userId int64
	err := r.db.QueryRow(query, email, username).Scan(&userId)
	if errors.Is(err, sql.ErrNoRows) {
		return 0, nil
	}
	return userId, err
}

func (r *UserRepository) Create(formData models.SignUpRequest, hashedPassword string) error {
	query := `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`
	_, err := r.db.Exec(
		query,
		formData.Username,
		formData.Email,
		hashedPassword,
	)
	if err != nil {
		return err
	}
	return nil
}

func (r *UserRepository) GetByUsername(username string) (*models.AuthenticatedUser, error) {
	query := `
		SELECT user_id, username, email, password
		FROM users
		WHERE username = ?
	`
	var user models.AuthenticatedUser
	err := r.db.QueryRow(query, username).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
	)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) UpdateLastLogin(userId int64) error {
	query := `
		UPDATE users
		SET login_timestamp = DATETIME()
		WHERE user_id = ?
	`
	_, err := r.db.Exec(query, userId)
	return err
}

func (r *UserRepository) GetUserById(userId int64) (*models.UserAccount, error) {
	query := `
		SELECT
			user_id,
			username,
			email,
			created_at,
			login_timestamp
		FROM users
		WHERE user_id = ?
	`
	var user models.UserAccount
	err := r.db.QueryRow(query, userId).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.CreatedAt,
		&user.LoginTimestamp,
	)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) UpdateUser(id int64, username, email, passwordHash string) error {
	query := "UPDATE users SET "
	var args []any
	var sets []string

	// Dynamically build the query based on what was provided
	if username != "" {
		sets = append(sets, "username = ?")
		args = append(args, username)
	}
	if email != "" {
		sets = append(sets, "email = ?")
		args = append(args, email)
	}
	if passwordHash != "" {
		sets = append(sets, "password = ?")
		args = append(args, passwordHash)
	}

	// If nothing was provided, do nothing
	if len(sets) == 0 {
		return nil
	}

	// Join the sets and add the WHERE clause
	query += strings.Join(sets, ", ") + " WHERE user_id = ?"
	args = append(args, id)

	_, err := r.db.Exec(query, args...)
	return err
}

// IsUsernameTaken checks if a username exists, excluding the current user's ID
func (r *UserRepository) IsUsernameTaken(username string, excludeID int64) (bool, error) {
	var exists bool
	// The query returns 1 (true) if a match is found, or 0 (false) if not
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE username = ? AND user_id != ?)`
	err := r.db.QueryRow(query, username, excludeID).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

// IsEmailTaken checks if an email exists, excluding the current user's ID
func (r *UserRepository) IsEmailTaken(email string, excludeID int64) (bool, error) {
	var exists bool
	// The query returns 1 (true) if a match is found, or 0 (false) if not
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE email = ? AND user_id != ?)`
	err := r.db.QueryRow(query, email, excludeID).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}
