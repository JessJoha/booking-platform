package routes

import (
	"createSpace/controller"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.POST("/spaces", controller.CreateSpace)
	}
}
