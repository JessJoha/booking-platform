package main

import (
	"createSpace/config"
	"createSpace/routes"
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
		port = "3008"
	}

	router.Run(fmt.Sprintf(":%s", port))
}
