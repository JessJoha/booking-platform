package main

import (
	"deleteSpace/config"
	"deleteSpace/routes"
	"fmt"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	// Swagger imports
	_ "deleteSpace/docs"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	config.InitDB()

	router := gin.Default()
	router.Use(cors.Default())
	routes.SetupRoutes(router)

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "deleteService is running",
		})
	})

	router.GET("/deleteSpace", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "createSpace is running",
		})
	})

	// Swagger route
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3012"
	}

	router.Run(fmt.Sprintf(":%s", port))
}
