package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"occupancyReports/src/config"
	"occupancyReports/src/model"

	"go.mongodb.org/mongo-driver/bson"
)

// ReportHandler handles GET /report
// @Summary Get all occupancy reports
// @Tags Reports
// @Produce json
// @Success 200 {array} model.Occupancy "List of occupancy reports"
// @Failure 500 {object} map[string]string "Failed to fetch reports"
// @Router /report [get]
func ReportHandler(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := config.OccupancyCollection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "Failed to fetch reports", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var reports []model.Occupancy
	if err := cursor.All(ctx, &reports); err != nil {
		http.Error(w, "Failed to decode data", http.StatusInternalServerError)
		return
	}

	log.Printf("📤 Sending %d reports", len(reports))
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reports)
}
