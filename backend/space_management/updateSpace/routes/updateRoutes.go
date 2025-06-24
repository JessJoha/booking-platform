package routes

import (
	"updateSpace/controller"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.PUT("/spaces/:id", controller.UpdateSpace)
	}
}
