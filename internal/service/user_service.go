package service

import (
	"fmt"
	"regexp"
	"time"

	errs "tasksmanagement/internal/errors"
	"tasksmanagement/internal/models"
	"tasksmanagement/internal/repository"

	"github.com/go-chi/jwtauth/v5"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repo *repository.UserRepository
	jwt  *jwtauth.JWTAuth
}

func NewUserService(repo *repository.UserRepository, jwt *jwtauth.JWTAuth) *UserService {
	return &UserService{
		repo: repo,
		jwt:  jwt,
	}
}

func (s *UserService) SignUp(formData models.SignUpRequest) error {
	// Validation
	// Validate email
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(formData.Email) {
		return errs.ErrInvalidEmailFormat
	}

	// Validate password (min 8 chars)
	if len(formData.Password) < 8 {
		return errs.ErrPasswordTooShort
	}

	// Validate password match
	if formData.Password != formData.ConfirmPassword {
		return errs.ErrPasswordsMismatch
	}

	// Check Duplicates
	userId, err := s.repo.CheckDuplicate(formData.Email, formData.Username)
	if userId > 0 {
		return errs.ErrUsernameOrEmailTaken
	}
	if err != nil {
		return err
	}

	// Hash Password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(formData.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// Create User
	return s.repo.Create(formData, string(hashedPassword))
}

func (s *UserService) SignIn(formData models.SignInRequest) (string, error) {
	// Get User
	user, err := s.repo.GetByUsername(formData.Username)
	if err != nil {
		return "", err
	}

	// Compare Password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(formData.Password))
	if err != nil {
		return "", err
	}

	// Generate Token
	expDays := 1
	if formData.Remember {
		expDays = 30
	}

	claims := map[string]any{
		"username": user.Username,
		"user_id":  fmt.Sprintf("%d", user.ID),
		"email":    user.Email,
		"exp":      time.Now().Add(time.Duration(expDays) * 24 * time.Hour).Unix(),
		"iat":      time.Now().Unix(),
	}

	_, tokenString, err := s.jwt.Encode(claims)
	if err != nil {
		return "", err
	}

	// Update Last Login (Async-ish, ignore error)
	_ = s.repo.UpdateLastLogin(user.ID)

	return tokenString, nil
}

func (s *UserService) GetAccount(userId int64) (*models.UserAccount, error) {
	return s.repo.GetUserById(userId)
}

func (s *UserService) UpdateAccount(userId int64, formData models.UpdateAccountRequest) error {
	// Ensure at least one field is being updated
	if formData.Username == "" && formData.Email == "" && formData.Password == "" {
		return errs.ErrNoFieldsToUpdate
	}

	// Validate Username only if it is being changed
	if formData.Username != "" {
		usernameTaken, err := s.repo.IsUsernameTaken(formData.Username, userId)
		if err != nil {
			return err
		}
		if usernameTaken {
			return errs.ErrUsernameTaken
		}
	}

	// Validate Email only if it is being changed
	if formData.Email != "" {
		emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
		if !emailRegex.MatchString(formData.Email) {
			return errs.ErrInvalidEmailFormat
		}
		emailTaken, err := s.repo.IsEmailTaken(formData.Email, userId)
		if err != nil {
			return err
		}
		if emailTaken {
			return errs.ErrEmailTaken
		}
	}

	// Validate and Hash Password only if it is being changed
	var hashedPassword string
	if formData.Password != "" {
		if formData.Password != formData.ConfirmPassword {
			return errs.ErrPasswordsMismatch
		}

		// Hash the password securely
		hash, err := bcrypt.GenerateFromPassword([]byte(formData.Password), bcrypt.DefaultCost)
		if err != nil {
			return errs.ErrPasswordHashingFailed
		}
		hashedPassword = string(hash)
	}

	// Update the database with whatever fields were provided
	return s.repo.UpdateUser(userId, formData.Username, formData.Email, hashedPassword)
}
