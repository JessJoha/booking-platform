package routes

import (
	"updateSpace/controller"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		// @Summary Update an existing space by ID
		// @Description Updates a space resource by its unique ID with the provided JSON body
		// @Tags Spaces
		// @Accept json
		// @Produce json
		// @Param id path string true "Space ID"
		// @Param space body object true "Updated space data"
		// @Success 200 {object} map[string]interface{} "Space updated successfully"
		// @Failure 400 {object} map[string]string "Invalid input"
		// @Failure 404 {object} map[string]string "Space not found"
		// @Failure 500 {object} map[string]string "Internal server error"
		// @Router /api/spaces/{id} [put]
		api.PUT("/spaces/:id", controller.UpdateSpace)
	}
}
