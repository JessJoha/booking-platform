package routes

import (
	"createSpace/controller"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	router.POST("/spaces", controller.CreateSpace)
}
