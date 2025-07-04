package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"occupancyReports/src/config"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ReservationEvent struct {
	SpaceID int    `json:"spaceId"`
	Date    string `json:"date"`
	Action  string `json:"action"`
}

func WebhookHandler(w http.ResponseWriter, r *http.Request) {
	var event ReservationEvent
	err := json.NewDecoder(r.Body).Decode(&event)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	log.Printf("📥 Event received via Webhook: %+v", event)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"spaceId": event.SpaceID, "date": event.Date}

	var increment int
	switch event.Action {
	case "created":
		increment = 1
	case "deleted":
		increment = -1
	case "updated":
		log.Println("ℹUpdate event received – no change to reservation count")
		w.WriteHeader(http.StatusOK)
		return
	default:
		http.Error(w, "Unknown action", http.StatusBadRequest)
		return
	}

	update := bson.M{"$inc": bson.M{"reservations": increment}}
	opts := options.Update().SetUpsert(true)

	result, err := config.OccupancyCollection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		log.Printf("Failed to update MongoDB: %v", err)
		http.Error(w, "Database update failed", http.StatusInternalServerError)
		return
	}

	log.Printf("✅ MongoDB updated: %+v", result)
	w.WriteHeader(http.StatusOK)
}
