package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"review-management/config"
	"review-management/controllers"
	"review-management/middleware"
	"review-management/models"
	"review-management/routes"
)

// @title Review Management Service API
// @version 1.0
// @description REST API for managing reviews and ratings in the booking platform
// @termsOfService http://swagger.io/terms/

// @contact.name Booking Platform Team
// @contact.email support@bookingplatform.com

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:4007
// @BasePath /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize database connection
	config.ConnectDatabase()

	// Run database migrations
	if err := models.AutoMigrate(config.DB); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Initialize Gin router
	router := gin.Default()

	// Add CORS middleware
	router.Use(middleware.CORSMiddleware())

	// Add request logging middleware
	router.Use(middleware.RequestLogger())

	// Health check endpoint
	router.GET("/health", controllers.HealthCheck)

	// Root endpoint
	router.GET("/", controllers.RootHandler)

	// API routes
	apiV1 := router.Group("/api/v1")
	{
		routes.SetupReviewRoutes(apiV1)
		routes.SetupRatingRoutes(apiV1)
		routes.SetupModerationRoutes(apiV1)
		routes.SetupAnalyticsRoutes(apiV1)
	}

	// Swagger documentation
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "4007"
	}

	log.Printf("Review Management Service starting on port %s", port)
	log.Printf("Swagger documentation available at http://localhost:%s/swagger/index.html", port)

	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
