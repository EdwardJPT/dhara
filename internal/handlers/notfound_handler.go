package handlers

import (
	"html/template"
	"log"
	"net/http"
)

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	// the html files
	files := []string{"./web/templates/404.html"}
	tmpl, err := template.ParseFiles(files...)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, "There's a problem in the server.", http.StatusInternalServerError)
	}
	err = tmpl.ExecuteTemplate(w, "404", nil)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, "There's a problem in the server.", http.StatusInternalServerError)
	}
}
