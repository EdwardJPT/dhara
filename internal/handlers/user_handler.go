package handlers

import (
	"database/sql"
	"errors"
	"html/template"
	"log"
	"net/http"
	"strconv"

	errs "tasksmanagement/internal/errors"
	"tasksmanagement/internal/models"
	"tasksmanagement/internal/service"
	"tasksmanagement/internal/utils"

	"github.com/go-chi/jwtauth/v5"
)

type UserHandler struct {
	service   *service.UserService
	templates *template.Template
}

func NewUserHandler(service *service.UserService) *UserHandler {
	tmpl := template.New("")
	tmpl = template.Must(tmpl.ParseGlob("web/templates/index.html"))
	tmpl = template.Must(tmpl.ParseGlob("web/templates/signup.html"))
	tmpl = template.Must(tmpl.ParseGlob("web/templates/account/*.html"))
	tmpl = template.Must(tmpl.ParseGlob("web/templates/components/*.html"))
	return &UserHandler{
		service:   service,
		templates: tmpl,
	}
}

const (
	index  = "index"
	signup = "signup"
)

type authResponse struct {
	Message string
}

func (h *UserHandler) render(w http.ResponseWriter, name string, data any, httpCode int) {
	w.WriteHeader(httpCode)
	if err := h.templates.ExecuteTemplate(w, name, data); err != nil {
		log.Println("Template execute error:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (h *UserHandler) SignInPage(w http.ResponseWriter, r *http.Request) {
	h.render(w, index, authResponse{Message: ""}, http.StatusOK)
}

func (h *UserHandler) SignUpPage(w http.ResponseWriter, r *http.Request) {
	h.render(w, signup, authResponse{Message: ""}, http.StatusOK)
}

func (h *UserHandler) SignIn(w http.ResponseWriter, r *http.Request) {
	// Parse form data
	if err := r.ParseForm(); err != nil {
		h.render(w, index, authResponse{Message: "Invalid request"}, http.StatusBadRequest)
		return
	}

	formData := models.SignInRequest{
		Username: utils.NormalizeIdentifier(r.FormValue("username")),
		Password: r.FormValue("password"),
		Remember: r.FormValue("remember") == "on",
	}

	token, err := h.service.SignIn(formData)
	if err != nil {
		// Log error internally if needed, but show generic message to user
		log.Printf("SignIn failed: %v", err)
		h.render(w, index, authResponse{Message: "Invalid credentials"}, http.StatusUnauthorized)
		return
	}

	// Set the cookie and redirect
	utils.SetTokenCookie(w, token, formData.Remember)
	http.Redirect(w, r, "/home", http.StatusSeeOther)
}

func (h *UserHandler) SignUp(w http.ResponseWriter, r *http.Request) {
	// Parse form data
	if err := r.ParseForm(); err != nil {
		h.render(w, signup, authResponse{Message: "Invalid request"}, http.StatusBadRequest)
		return
	}

	formData := models.SignUpRequest{
		Username:        utils.NormalizeIdentifier(r.FormValue("username")),
		Email:           utils.NormalizeIdentifier(r.FormValue("email")),
		Password:        r.FormValue("password"),
		ConfirmPassword: r.FormValue("confirm_password"),
	}

	err := h.service.SignUp(formData)
	if err != nil {
		h.render(w, signup, authResponse{Message: err.Error()}, http.StatusBadRequest)
		return
	}

	h.render(w, signup, authResponse{Message: "Success creating your account"}, http.StatusOK)
}

func (h *UserHandler) SignOut(w http.ResponseWriter, r *http.Request) {
	utils.ClearTokenCookie(w)
	http.Redirect(w, r, "/", http.StatusSeeOther)
}

func (h *UserHandler) AccountPage(w http.ResponseWriter, r *http.Request) {
	// Get user info from context
	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		log.Println("Parse user_id error:", err)
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	user, err := h.service.GetAccount(userId)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Pass data to template
	data := struct {
		IsDemo   bool
		UserJSON template.JS
	}{
		IsDemo:   false,
		UserJSON: template.JS(toJSON(user)),
	}

	h.render(w, "account", data, http.StatusOK)
}

type editAccountResponse struct {
	Message string
}

func (h *UserHandler) EditAccountForm(w http.ResponseWriter, r *http.Request) {
	h.render(w, "edit_account_form", editAccountResponse{Message: "You're allowed to only change 1 field"}, http.StatusOK)
}

func (h *UserHandler) EditAccount(w http.ResponseWriter, r *http.Request) {
	// Get user info from context
	_, claims, _ := jwtauth.FromContext(r.Context())
	userId, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
	if err != nil {
		log.Println("Parse user_id error:", err)
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Parse form data
	if err := r.ParseForm(); err != nil {
		// if we return http.StatusBadRequest, the htmx won't swap the html we sent
		h.render(w, "edit_account_form", editAccountResponse{Message: "Invalid request"}, http.StatusOK)
		return
	}

	formData := models.UpdateAccountRequest{
		Username:        utils.NormalizeIdentifier(r.FormValue("username")),
		Email:           utils.NormalizeIdentifier(r.FormValue("email")),
		Password:        r.FormValue("password"),
		ConfirmPassword: r.FormValue("confirm-password"),
	}

	err = h.service.UpdateAccount(userId, formData)
	if err != nil {
		log.Printf("Error updating profile: %v", err)

		// Catch all our specific validation errors
		if errors.Is(err, errs.ErrNoFieldsToUpdate) ||
			errors.Is(err, errs.ErrUsernameTaken) ||
			errors.Is(err, errs.ErrInvalidEmailFormat) ||
			errors.Is(err, errs.ErrEmailTaken) ||
			errors.Is(err, errs.ErrPasswordsMismatch) ||
			errors.Is(err, errs.ErrPasswordHashingFailed) {

			// if we return http.StatusBadRequest, the htmx won't swap the html we sent
			h.render(w, "edit_account_form", editAccountResponse{Message: err.Error()}, http.StatusOK)
			return
		}

		http.Error(w, "Failed to update profile", http.StatusInternalServerError)
		return
	}

	w.Header().Set("HX-Redirect", "/account")
	w.WriteHeader(http.StatusOK)
}
