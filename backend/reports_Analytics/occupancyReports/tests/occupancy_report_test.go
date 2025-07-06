package tests

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"occupancyReports/src/config"
	"occupancyReports/src/handlers"
	"occupancyReports/src/model"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
)

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		err = godotenv.Load("../../.env")
		if err != nil {
			panic("Could not load .env file")
		}
	}
	config.ConnectMongoDB()
}
func setupTestRouter() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/report", handlers.ReportHandler).Methods("GET")
	return r
}

func insertTestData() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	config.OccupancyCollection.InsertOne(ctx, model.Occupancy{
		SpaceID:      999,
		Date:         "2025-07-01",
		Reservations: 3,
	})
}

func cleanupTestData() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	config.OccupancyCollection.DeleteMany(ctx, bson.M{"spaceId": 999})
}

func TestGetReport(t *testing.T) {
	_ = godotenv.Load("../../.env")
	config.ConnectMongoDB()
	insertTestData()
	defer cleanupTestData()

	req, _ := http.NewRequest("GET", "/report", nil)
	resp := httptest.NewRecorder()
	router := setupTestRouter()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Errorf("Expected 200 OK, got %d", resp.Code)
	}

	var result []map[string]interface{}
	err := json.Unmarshal(resp.Body.Bytes(), &result)
	if err != nil {
		t.Errorf("Failed to parse response JSON: %v", err)
	}

	if len(result) == 0 {
		t.Errorf("Expected at least one occupancy report, got 0")
	}
}
