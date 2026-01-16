package main

import (
	"deleteSpace/config"
	"deleteSpace/routes"
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	config.InitDB()

	router := gin.Default()
	routes.SetupRoutes(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3009"
	}

	router.Run(fmt.Sprintf(":%s", port))
}
