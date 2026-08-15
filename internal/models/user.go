package models

// User object based on the database schema
type User struct {
	ID             int64  `json:"user_id"`
	Username       string `json:"username"`
	Email          string `json:"email"`
	Password       string `json:"password"`
	CreatedAt      string `json:"created_at"`
	LoginTimestamp string `json:"login_timestamp"`
}

type SignInRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Remember bool   `json:"remember"`
}

type SignUpRequest struct {
	Username        string `json:"username"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirm_password"`
}

type AuthenticatedUser struct {
	ID       int64  `json:"user_id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserAccount struct {
	ID             int64  `json:"user_id"`
	Username       string `json:"username"`
	Email          string `json:"email"`
	CreatedAt      string `json:"created_at"`
	LoginTimestamp string `json:"login_timestamp"`
}

type UpdateAccountRequest struct {
	Username        string `json:"username"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirm_password"`
}
