package main

import (
	"deleteSpace/config"
	"deleteSpace/routes"
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	// Swagger imports
	_ "deleteSpace/docs"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	config.InitDB()

	router := gin.Default()
	routes.SetupRoutes(router)

	// Swagger route
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3012"
	}

	router.Run(fmt.Sprintf(":%s", port))
}
