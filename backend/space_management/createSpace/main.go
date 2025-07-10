package main

import (
	"createSpace/config"
	"createSpace/routes"
	"fmt"
	"os"

	_ "createSpace/docs"

	"github.com/gin-gonic/gin"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	config.InitDB()

	router := gin.Default()
	routes.SetupRoutes(router)

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "createSpace is running",
		})
	})
	router.GET("/space", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "createSpace is running",
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3008"
	}

	router.Run(fmt.Sprintf(":%s", port))
}
