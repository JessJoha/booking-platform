package routes

import (
	"deleteSpace/controller"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	router.DELETE("/spaces/:id", controller.DeleteSpace)
}
