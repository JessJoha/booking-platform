package tests

import (
	"deleteSpace/config"
	"deleteSpace/routes"
	"net/http"
	"net/http/httptest"
	"os"
	"strconv"
	"testing"

	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	routes.SetupRoutes(router)
	return router
}

func TestDeleteSpaceSuccess(t *testing.T) {
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
