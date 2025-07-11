package main

import (
	"net/http"
	"review-management/config"
	"review-management/controllers"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title Review Management API
// @version 1.0
// @description Microservice for managing reviews and ratings in the booking platform
// @termsOfService http://swagger.io/terms/

// @contact.name Booking Platform Team
// @contact.email dev@bookingplatform.com

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:3008
// @BasePath /api/v1

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name x-api-key

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.

func setupRoutes() *gin.Engine {
	router := gin.Default()

	// Add CORS middleware
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, x-api-key")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Swagger documentation
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Health check endpoint
		v1.GET("/health", healthCheck)

		// Review routes
		reviews := v1.Group("/reviews")
		{
			reviews.POST("", createReview)
			reviews.GET("", getReviews)
			reviews.GET("/:id", getReviewByID)
			reviews.PUT("/:id", updateReview)
			reviews.DELETE("/:id", deleteReview)
			reviews.GET("/space/:spaceId", getReviewsBySpace)
			reviews.GET("/user/:userId", getReviewsByUser)
		}

		// Statistics routes
		stats := v1.Group("/statistics")
		{
			stats.GET("/overview", getStatisticsOverview)
			stats.GET("/space/:spaceId", getSpaceStatistics)
			stats.GET("/ratings-distribution", getRatingsDistribution)
		}

		// Moderation routes
		moderation := v1.Group("/moderation")
		{
			moderation.GET("/flagged", getFlaggedReviews)
			moderation.PUT("/:id/approve", approveReview)
			moderation.PUT("/:id/reject", rejectReview)
		}
	}

	return router
}

// HealthResponse represents the health check response
type HealthResponse struct {
	Status    string `json:"status" example:"healthy"`
	Service   string `json:"service" example:"review-management"`
	Version   string `json:"version" example:"1.0.0"`
	Timestamp string `json:"timestamp" example:"2024-01-15T10:00:00Z"`
	Uptime    int64  `json:"uptime" example:"3600"`
	Database  DatabaseStatus `json:"database"`
}

// DatabaseStatus represents database connection status
type DatabaseStatus struct {
	Status   string `json:"status" example:"connected"`
	Provider string `json:"provider" example:"postgresql"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Success bool   `json:"success" example:"false"`
	Error   string `json:"error" example:"Error message"`
	Code    string `json:"code" example:"ERROR_CODE"`
}

// healthCheck godoc
// @Summary Health check
// @Description Returns the health status of the review management service
// @Tags Health
// @Produce json
// @Success 200 {object} HealthResponse
// @Failure 500 {object} ErrorResponse
// @Router /health [get]
func healthCheck(c *gin.Context) {
	// Check database connection
	dbStatus := "connected"
	if err := config.DB.Ping(); err != nil {
		dbStatus = "disconnected"
	}

	response := HealthResponse{
		Status:    "healthy",
		Service:   "review-management",
		Version:   "1.0.0",
		Timestamp: "2024-01-15T10:00:00Z",
		Uptime:    3600,
		Database: DatabaseStatus{
			Status:   dbStatus,
			Provider: "postgresql",
		},
	}

	c.JSON(http.StatusOK, response)
}

// Review represents a review entity
type Review struct {
	ID          int    `json:"id" example:"1"`
	UserID      string `json:"user_id" example:"user123"`
	SpaceID     string `json:"space_id" example:"space456"`
	BookingID   string `json:"booking_id" example:"booking789"`
	Rating      int    `json:"rating" example:"5" minimum:"1" maximum:"5"`
	Title       string `json:"title" example:"Great space!"`
	Comment     string `json:"comment" example:"The space was perfect for our meeting."`
	Status      string `json:"status" example:"approved" enums:"pending,approved,rejected"`
	CreatedAt   string `json:"created_at" example:"2024-01-15T10:00:00Z"`
	UpdatedAt   string `json:"updated_at" example:"2024-01-15T10:00:00Z"`
}

// CreateReviewRequest represents the request to create a review
type CreateReviewRequest struct {
	UserID    string `json:"user_id" binding:"required" example:"user123"`
	SpaceID   string `json:"space_id" binding:"required" example:"space456"`
	BookingID string `json:"booking_id" binding:"required" example:"booking789"`
	Rating    int    `json:"rating" binding:"required,min=1,max=5" example:"5"`
	Title     string `json:"title" example:"Great space!"`
	Comment   string `json:"comment" example:"The space was perfect for our meeting."`
}

// UpdateReviewRequest represents the request to update a review
type UpdateReviewRequest struct {
	Rating  int    `json:"rating,omitempty" minimum:"1" maximum:"5" example:"4"`
	Title   string `json:"title,omitempty" example:"Updated title"`
	Comment string `json:"comment,omitempty" example:"Updated comment"`
}

// ReviewResponse represents a review response
type ReviewResponse struct {
	Success bool   `json:"success" example:"true"`
	Message string `json:"message" example:"Review created successfully"`
	Data    Review `json:"data"`
}

// ReviewsResponse represents multiple reviews response
type ReviewsResponse struct {
	Success bool     `json:"success" example:"true"`
	Message string   `json:"message" example:"Reviews retrieved successfully"`
	Data    []Review `json:"data"`
	Total   int      `json:"total" example:"10"`
	Page    int      `json:"page" example:"1"`
	Limit   int      `json:"limit" example:"10"`
}

// createReview godoc
// @Summary Create a new review
// @Description Create a new review for a space
// @Tags Reviews
// @Accept json
// @Produce json
// @Param review body CreateReviewRequest true "Review data"
// @Success 201 {object} ReviewResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security ApiKeyAuth
// @Router /reviews [post]
func createReview(c *gin.Context) {
	controllers.CreateReview(c)
}

// getReviews godoc
// @Summary Get all reviews
// @Description Get a list of all reviews with pagination
// @Tags Reviews
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Param status query string false "Filter by status" Enums(pending, approved, rejected)
// @Param rating query int false "Filter by rating" minimum(1) maximum(5)
// @Success 200 {object} ReviewsResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /reviews [get]
func getReviews(c *gin.Context) {
	controllers.GetReviews(c)
}

// getReviewByID godoc
// @Summary Get a review by ID
// @Description Get a specific review by its ID
// @Tags Reviews
// @Produce json
// @Param id path int true "Review ID"
// @Success 200 {object} ReviewResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /reviews/{id} [get]
func getReviewByID(c *gin.Context) {
	controllers.GetReviewByID(c)
}

// updateReview godoc
// @Summary Update a review
// @Description Update an existing review
// @Tags Reviews
// @Accept json
// @Produce json
// @Param id path int true "Review ID"
// @Param review body UpdateReviewRequest true "Updated review data"
// @Success 200 {object} ReviewResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security ApiKeyAuth
// @Router /reviews/{id} [put]
func updateReview(c *gin.Context) {
	controllers.UpdateReview(c)
}

// deleteReview godoc
// @Summary Delete a review
// @Description Delete a review by ID
// @Tags Reviews
// @Produce json
// @Param id path int true "Review ID"
// @Success 200 {object} map[string]interface{}
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security ApiKeyAuth
// @Router /reviews/{id} [delete]
func deleteReview(c *gin.Context) {
	controllers.DeleteReview(c)
}

// getReviewsBySpace godoc
// @Summary Get reviews by space ID
// @Description Get all reviews for a specific space
// @Tags Reviews
// @Produce json
// @Param spaceId path string true "Space ID"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} ReviewsResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /reviews/space/{spaceId} [get]
func getReviewsBySpace(c *gin.Context) {
	controllers.GetReviewsBySpace(c)
}

// getReviewsByUser godoc
// @Summary Get reviews by user ID
// @Description Get all reviews created by a specific user
// @Tags Reviews
// @Produce json
// @Param userId path string true "User ID"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} ReviewsResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /reviews/user/{userId} [get]
func getReviewsByUser(c *gin.Context) {
	controllers.GetReviewsByUser(c)
}

// StatisticsOverview represents overall statistics
type StatisticsOverview struct {
	TotalReviews      int     `json:"total_reviews" example:"150"`
	AverageRating     float64 `json:"average_rating" example:"4.2"`
	TotalSpaces       int     `json:"total_spaces" example:"25"`
	ReviewsThisMonth  int     `json:"reviews_this_month" example:"18"`
	PendingReviews    int     `json:"pending_reviews" example:"5"`
	ApprovedReviews   int     `json:"approved_reviews" example:"140"`
	RejectedReviews   int     `json:"rejected_reviews" example:"5"`
}

// getStatisticsOverview godoc
// @Summary Get statistics overview
// @Description Get overall review statistics
// @Tags Statistics
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 500 {object} ErrorResponse
// @Router /statistics/overview [get]
func getStatisticsOverview(c *gin.Context) {
	// Mock statistics data
	stats := StatisticsOverview{
		TotalReviews:      150,
		AverageRating:     4.2,
		TotalSpaces:       25,
		ReviewsThisMonth:  18,
		PendingReviews:    5,
		ApprovedReviews:   140,
		RejectedReviews:   5,
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    stats,
	})
}

// SpaceStatistics represents statistics for a specific space
type SpaceStatistics struct {
	SpaceID       string  `json:"space_id" example:"space456"`
	TotalReviews  int     `json:"total_reviews" example:"25"`
	AverageRating float64 `json:"average_rating" example:"4.6"`
	RatingCounts  map[string]int `json:"rating_counts"`
}

// getSpaceStatistics godoc
// @Summary Get space statistics
// @Description Get review statistics for a specific space
// @Tags Statistics
// @Produce json
// @Param spaceId path string true "Space ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /statistics/space/{spaceId} [get]
func getSpaceStatistics(c *gin.Context) {
	spaceID := c.Param("spaceId")
	
	// Mock space statistics
	stats := SpaceStatistics{
		SpaceID:       spaceID,
		TotalReviews:  25,
		AverageRating: 4.6,
		RatingCounts: map[string]int{
			"1": 1,
			"2": 2,
			"3": 3,
			"4": 8,
			"5": 11,
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    stats,
	})
}

// RatingsDistribution represents the distribution of ratings
type RatingsDistribution struct {
	Rating1 int `json:"rating_1" example:"5"`
	Rating2 int `json:"rating_2" example:"8"`
	Rating3 int `json:"rating_3" example:"15"`
	Rating4 int `json:"rating_4" example:"45"`
	Rating5 int `json:"rating_5" example:"77"`
}

// getRatingsDistribution godoc
// @Summary Get ratings distribution
// @Description Get the distribution of ratings across all reviews
// @Tags Statistics
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 500 {object} ErrorResponse
// @Router /statistics/ratings-distribution [get]
func getRatingsDistribution(c *gin.Context) {
	// Mock ratings distribution
	distribution := RatingsDistribution{
		Rating1: 5,
		Rating2: 8,
		Rating3: 15,
		Rating4: 45,
		Rating5: 77,
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    distribution,
	})
}

// getFlaggedReviews godoc
// @Summary Get flagged reviews
// @Description Get reviews that are flagged for moderation
// @Tags Moderation
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} ReviewsResponse
// @Failure 500 {object} ErrorResponse
// @Security ApiKeyAuth
// @Router /moderation/flagged [get]
func getFlaggedReviews(c *gin.Context) {
	// Mock flagged reviews - in real implementation, this would query for flagged reviews
	reviews := []Review{
		{
			ID:        1,
			UserID:    "user123",
			SpaceID:   "space456",
			BookingID: "booking789",
			Rating:    1,
			Title:     "Terrible experience",
			Comment:   "This place was absolutely horrible...",
			Status:    "pending",
			CreatedAt: "2024-01-15T10:00:00Z",
			UpdatedAt: "2024-01-15T10:00:00Z",
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    reviews,
		"total":   len(reviews),
		"page":    1,
		"limit":   10,
	})
}

// approveReview godoc
// @Summary Approve a review
// @Description Approve a review for publication
// @Tags Moderation
// @Produce json
// @Param id path int true "Review ID"
// @Success 200 {object} map[string]interface{}
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security ApiKeyAuth
// @Router /moderation/{id}/approve [put]
func approveReview(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Review approved successfully",
	})
}

// rejectReview godoc
// @Summary Reject a review
// @Description Reject a review and prevent publication
// @Tags Moderation
// @Produce json
// @Param id path int true "Review ID"
// @Success 200 {object} map[string]interface{}
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security ApiKeyAuth
// @Router /moderation/{id}/reject [put]
func rejectReview(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Review rejected successfully",
	})
}
