package routes

import (
	"createSpace/controller"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		// @Summary Create a new space
		// @Description Creates a new space with the provided JSON body
		// @Tags Spaces
		// @Accept json
		// @Produce json
		// @Param space body object true "Space data"
		// @Success 201 {object} map[string]interface{} "Created space object"
		// @Failure 400 {object} map[string]string "Invalid input"
		// @Failure 500 {object} map[string]string "Internal server error"
		api.POST("/spaces", controller.CreateSpace)
	}
}
