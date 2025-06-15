package main

import (
	"fmt"
	"listSpaces/config"
	"listSpaces/routes"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	config.InitDB()

	router := gin.Default()
	routes.SetupRoutes(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3011"
	}

	router.Run(fmt.Sprintf(":%s", port))
}
