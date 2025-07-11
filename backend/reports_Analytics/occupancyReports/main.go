package main

import (
	"log"
	"net/http"
	"os"

	"occupancyReports/src/config"
	"occupancyReports/src/handlers"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"

	_ "occupancyReports/docs"

	gorillaHandlers "github.com/gorilla/handlers"
	httpSwagger "github.com/swaggo/http-swagger"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	log.Println("Starting occupancyReports service with Webhook...")

	config.ConnectMongoDB()

	r := mux.NewRouter()

	r.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

	r.HandleFunc("/webhook/occupancy", handlers.WebhookHandler).Methods("POST")
	r.HandleFunc("/report", handlers.ReportHandler).Methods("GET")
	r.HandleFunc("/occupancy", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	port := os.Getenv("PORT")
	if port == "" {
		port = "6000"
	}

	log.Printf("Listening on port %s", port)

	corsAllowed := gorillaHandlers.CORS(
		gorillaHandlers.AllowedOrigins([]string{"*"}),
		gorillaHandlers.AllowedMethods([]string{"GET", "POST"}),
		gorillaHandlers.AllowedHeaders([]string{"Content-Type"}),
	)

	http.ListenAndServe(":"+port, corsAllowed(r))
}
