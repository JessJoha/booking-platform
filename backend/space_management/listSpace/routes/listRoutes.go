package routes

import (
	"listSpaces/controller"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		// @Summary Get all available spaces
		// @Description Returns a list of all available spaces
		// @Tags Spaces
		// @Produce json
		// @Success 200 {array} map[string]interface{} "List of spaces"
		// @Failure 500 {object} map[string]string "Internal server error"
		// @Router /api/spaces [get]
		api.GET("/spaces", controller.GetAllSpaces)
	}
}
