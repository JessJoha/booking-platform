package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthCheck handles health check requests
// @Summary Health check
// @Description Check if the service is healthy
// @Tags health
// @Produce json
// @Success 200 {object} map[string]interface{} "Service is healthy"
// @Router /health [get]
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"service":   "review_management",
		"version":   "1.0.0",
		"timestamp": c.Request.Header.Get("X-Request-ID"),
	})
}

// RootHandler handles root endpoint requests
// @Summary Service information
// @Description Get basic information about the review management service
// @Tags info
// @Produce json
// @Success 200 {object} map[string]interface{} "Service information"
// @Router / [get]
func RootHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message":     "Booking Platform - Review Management Service",
		"description": "REST API for managing reviews, ratings, and user feedback",
		"version":     "1.0.0",
		"endpoints": gin.H{
			"reviews":      "/api/v1/reviews",
			"ratings":      "/api/v1/ratings",
			"moderation":   "/api/v1/moderation",
			"analytics":    "/api/v1/analytics",
			"health":       "/health",
			"swagger":      "/swagger/index.html",
		},
		"features": []string{
			"Create and manage reviews",
			"Rating system with aggregation",
			"Review moderation and reporting",
			"Business response to reviews",
			"Review analytics and insights",
			"Tag-based categorization",
			"Image attachments",
			"Helpfulness voting",
		},
	})
}
