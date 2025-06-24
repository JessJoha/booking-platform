package routes

import (
	"deleteSpace/controller"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.DELETE("/spaces/:id", controller.DeleteSpace)

	}
}
