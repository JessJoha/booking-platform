package routes

import (
	"deleteSpace/controller"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		// @Summary Delete a space by ID
		// @Description Deletes a space resource by its unique ID
		// @Tags Spaces
		// @Param id path string true "Space ID"
		// @Success 200 {object} map[string]string "Space deleted successfully"
		// @Failure 400 {object} map[string]string "Invalid ID supplied"
		// @Failure 404 {object} map[string]string "Space not found"
		// @Failure 500 {object} map[string]string "Internal server error"
		// @Router /api/spaces/{id} [delete]
		api.DELETE("/spaces/:id", controller.DeleteSpace)
	}
}
