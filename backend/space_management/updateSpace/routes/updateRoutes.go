package routes

import (
	"updateSpace/controller"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	router.PUT("/spaces/:id", controller.UpdateSpace)
}
