package routes

import (
	"listSpaces/controller"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	router.GET("/spaces", controller.GetAllSpaces)
}
