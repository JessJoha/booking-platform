package tests

import (
	"deleteSpace/config"
	"deleteSpace/model"
	"deleteSpace/routes"
	"net/http"
	"net/http/httptest"
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

func createTestSpace() uint {
	space := model.Space{
		Name:        "Test Delete",
		Location:    "Test City",
		Type:        "indoor",
		Description: "To be deleted",
		Capacity:    8,
	}
	config.DB.Create(&space)
	return space.ID
}

func TestDeleteSpaceSuccess(t *testing.T) {
	_ = godotenv.Load("../.env")
	config.InitDB()
	router := setupRouter()

	// Crear espacio a eliminar
	id := createTestSpace()

	req, _ := http.NewRequest("DELETE", "/api/spaces/"+strconv.Itoa(int(id)), nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", resp.Code)
	}
}

func TestDeleteSpaceNotFound(t *testing.T) {
	router := setupRouter()
	req, _ := http.NewRequest("DELETE", "/api/spaces/999999", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusNotFound {
		t.Errorf("Expected status 404 Not Found, got %d", resp.Code)
	}
}

func TestDeleteSpaceInvalidID(t *testing.T) {
	router := setupRouter()
	req, _ := http.NewRequest("DELETE", "/api/spaces/abc", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400 Bad Request, got %d", resp.Code)
	}
}
