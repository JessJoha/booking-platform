package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"updateSpace/config"
	"updateSpace/model"
	"updateSpace/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func setupUpdateRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	routes.SetupRoutes(router)
	return router
}

func insertTestSpace() model.Space {
	testSpace := model.Space{
		Name:        "Old Name",
		Location:    "Old Location",
		Type:        "Old Type",
		Description: "Old Desc",
		Capacity:    5,
	}
	config.DB.Create(&testSpace)
	return testSpace
}

func TestUpdateSpaceSuccess(t *testing.T) {
	_ = godotenv.Load("../.env")
	config.InitDB()
	router := setupUpdateRouter()

	original := insertTestSpace()

	updated := model.Space{
		Name:        "New Name",
		Location:    "New Location",
		Type:        "Synthetic",
		Description: "Updated Desc",
		Capacity:    10,
	}
	payload, _ := json.Marshal(updated)

	req, _ := http.NewRequest("PUT", "/api/spaces/"+strconv.Itoa(int(original.ID)), bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", resp.Code)
	}
}
