package handlers

import (
	"html/template"
	"log"
	"net/http"
)

type MiscHandler struct{ templates *template.Template }

func NewMiscHandler() *MiscHandler {
	tmpl := template.New("")
	tmpl = template.Must(tmpl.ParseGlob("web/templates/about.html"))
	tmpl = template.Must(tmpl.ParseGlob("web/templates/terms.html"))
	tmpl = template.Must(tmpl.ParseGlob("web/templates/help.html"))
	tmpl = template.Must(tmpl.ParseGlob("web/templates/components/*.html"))
	return &MiscHandler{templates: tmpl}
}

func (h *MiscHandler) AboutPage(w http.ResponseWriter, r *http.Request) {
	if err := h.templates.ExecuteTemplate(w, "about", ""); err != nil {
		log.Println("Template execute error:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (h *MiscHandler) TermsPage(w http.ResponseWriter, r *http.Request) {
	if err := h.templates.ExecuteTemplate(w, "terms", ""); err != nil {
		log.Println("Template execute error:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (h *MiscHandler) HelpPage(w http.ResponseWriter, r *http.Request) {
	if err := h.templates.ExecuteTemplate(w, "help", ""); err != nil {
		log.Println("Template execute error:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}
