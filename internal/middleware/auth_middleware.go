package middleware

import (
	"net/http"
	"tasksmanagement/internal/utils"

	"github.com/go-chi/jwtauth/v5"
)

// Middleware that would redirect authenticated users to /home
func AuthenticatedRedirector(jwt *jwtauth.JWTAuth) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get token from cookie
			cookie, err := r.Cookie("bearer")
			if err != nil {
				next.ServeHTTP(w, r)
				return
			}
			// Verify token
			_, err = jwt.Decode(cookie.Value)
			// Valid token -> redirect to /home
			if err == nil {
				http.Redirect(w, r, "/home", http.StatusSeeOther)
				return
			}
			utils.ClearTokenCookie(w)
			next.ServeHTTP(w, r)
		})
	}
}

func Auth(jwt *jwtauth.JWTAuth) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get token from cookie
			cookie, err := r.Cookie("bearer")
			if err != nil {
				// No cookie → redirect to login
				http.Redirect(w, r, "/", http.StatusSeeOther)
				return
			}
			// Verify token
			claims, err := jwt.Decode(cookie.Value)
			if err != nil {
				// Invalid token → clear cookie and redirect
				utils.ClearTokenCookie(w)
				http.Redirect(w, r, "/", http.StatusSeeOther)
				return
			}
			// Add claims to context
			ctx := jwtauth.NewContext(r.Context(), claims, nil)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
