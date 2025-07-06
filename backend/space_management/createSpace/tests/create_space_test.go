package tests

import (
	"bytes"
	"createSpace/config"
	"createSpace/routes"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	routes.SetupRoutes(router)
	return router
}

func TestCreateSpaceSuccess(t *testing.T) {
	if err := godotenv.Load("../.env"); err != nil {
		t.Log("Warning: .env file not found, using default environment variables")
	}
	os.Setenv("TESTING", "true")

	config.InitDB()

	router := setupRouter()

	payload := []byte(`{
		"name": "Cancha Norte",
		"location": "Quito",
		"type": "cesped",
		"description": "Cancha para futbol 7",
		"capacity": 14
	}`)

	req, _ := http.NewRequest("POST", "/api/spaces", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusCreated {
		t.Errorf("Expected status 201 Created, got %d", resp.Code)
	}
}

func TestCreateSpaceMissingFields(t *testing.T) {
	os.Setenv("TESTING", "true")

	router := setupRouter()

	payload := []byte(`{
		"name": "Cancha incompleta"
	}`)

	req, _ := http.NewRequest("POST", "/api/spaces", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")

	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest && resp.Code != http.StatusInternalServerError {
		t.Errorf("Expected status 400 or 500, got %d", resp.Code)
	}
}
