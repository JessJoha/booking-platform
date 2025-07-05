package tests

import (
	"listSpaces/config"
	"listSpaces/model"
	"listSpaces/routes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func setupListRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	routes.SetupRoutes(router)
	return router
}

func insertSampleSpace() {
	sample := model.Space{
		Name:        "Cancha Ejemplo",
		Location:    "Quito",
		Type:        "césped",
		Description: "Espacio de prueba",
		Capacity:    10,
	}
	config.DB.Create(&sample)
}

func TestGetAllSpacesSuccess(t *testing.T) {
	_ = godotenv.Load("../.env")
	config.InitDB()
	router := setupListRouter()

	insertSampleSpace()

	req, _ := http.NewRequest("GET", "/api/spaces", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", resp.Code)
	}
}
