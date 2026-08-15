package utils

import (
	"encoding/json"
	"log"
	"net/http"
)

type APIResponse struct {
	Success bool   `json:"success"`
	Status  string `json:"status"` // "succeed" | "failed" | "completed"
	Data    any    `json:"data,omitempty"`
	Message string `json:"message,omitempty"` // For error messages or detailed status
}

func JSONResponse(w http.ResponseWriter, statusCode int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		log.Printf("Failed to encode response: %v", err)
	}
}

func SuccessResponse(w http.ResponseWriter, statusCode int, data any, statusMsg string) {
	if statusMsg == "" {
		statusMsg = "succeed"
	}
	JSONResponse(w, statusCode, APIResponse{
		Success: true,
		Status:  statusMsg,
		Data:    data,
	})
}

func ErrorResponse(w http.ResponseWriter, statusCode int, err error, message string) {
	log.Printf("%s: %v", message, err)
	JSONResponse(w, statusCode, APIResponse{
		Success: false,
		Status:  "failed",
		Message: message,
	})
}
