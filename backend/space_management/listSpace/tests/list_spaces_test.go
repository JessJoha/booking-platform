package tests

import (
	"listSpaces/config"
	"listSpaces/routes"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
)

func setupListRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	routes.SetupRoutes(router)
	return router
}

func TestGetAllSpacesSuccess(t *testing.T) {
	os.Setenv("TESTING", "true")
	config.InitDB()

	router := setupListRouter()

	req, _ := http.NewRequest("GET", "/api/spaces", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", resp.Code)
	}
}
