package tests

import (
	"deleteSpace/config"
	"deleteSpace/routes"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strconv"
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

func TestDeleteSpaceSuccess(t *testing.T) {

	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using default environment variables")
	}
	os.Setenv("TESTING", "true")
	config.InitDB()

	router := setupRouter()

	id := 1

	req, _ := http.NewRequest("DELETE", "/api/spaces/"+strconv.Itoa(id), nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK && resp.Code != http.StatusNotFound {
		t.Errorf("Expected 200 OK or 404 Not Found, got %d", resp.Code)
	}
}

func TestDeleteSpaceNotFound(t *testing.T) {
	if err := godotenv.Load("../.env"); err != nil {
		t.Log("Warning: .env file not found, using default environment variables")
	}
	os.Setenv("TESTING", "true")
	config.InitDB()

	router := setupRouter()
	req, _ := http.NewRequest("DELETE", "/api/spaces/999999", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusNotFound {
		t.Errorf("Expected status 404 Not Found, got %d", resp.Code)
	}
}

func TestDeleteSpaceInvalidID(t *testing.T) {
	if err := godotenv.Load("../.env"); err != nil {
		t.Log("Warning: .env file not found, using default environment variables")
	}
	os.Setenv("TESTING", "true")
	config.InitDB()

	router := setupRouter()
	req, _ := http.NewRequest("DELETE", "/api/spaces/abc", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400 Bad Request, got %d", resp.Code)
	}
}
