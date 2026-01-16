package main

import (
	"fmt"
	"os"
	"updateSpace/config"
	"updateSpace/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.InitDB()

	router := gin.Default()
	routes.SetupRoutes(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3010"
	}

	router.Run(fmt.Sprintf(":%s", port))
}
