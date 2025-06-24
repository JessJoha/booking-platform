package routes

import (
	"listSpaces/controller"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.GET("/spaces", controller.GetAllSpaces)
	}
}
