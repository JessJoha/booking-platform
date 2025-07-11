package controllers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"review-management/config"
	"review-management/models"
	"review-management/services"
)

// ReviewController handles review-related operations
type ReviewController struct {
	reviewService *services.ReviewService
}

// NewReviewController creates a new review controller
func NewReviewController() *ReviewController {
	return &ReviewController{
		reviewService: services.NewReviewService(config.DB),
	}
}

// CreateReviewRequest represents the request body for creating a review
type CreateReviewRequest struct {
	UserID      string   `json:"user_id" binding:"required"`
	SpaceID     string   `json:"space_id" binding:"required"`
	BookingID   string   `json:"booking_id" binding:"required"`
	Rating      int      `json:"rating" binding:"required,min=1,max=5"`
	Title       string   `json:"title"`
	Content     string   `json:"content" binding:"required,min=10,max=2000"`
	IsAnonymous bool     `json:"is_anonymous"`
	Language    string   `json:"language"`
	TagNames    []string `json:"tag_names"`
}

// UpdateReviewRequest represents the request body for updating a review
type UpdateReviewRequest struct {
	Rating      *int     `json:"rating,omitempty" binding:"omitempty,min=1,max=5"`
	Title       *string  `json:"title,omitempty"`
	Content     *string  `json:"content,omitempty" binding:"omitempty,min=10,max=2000"`
	IsAnonymous *bool    `json:"is_anonymous,omitempty"`
	TagNames    []string `json:"tag_names,omitempty"`
}

// CreateReview creates a new review
// @Summary Create a new review
// @Description Create a new review for a space/booking
// @Tags reviews
// @Accept json
// @Produce json
// @Param review body CreateReviewRequest true "Review data"
// @Success 201 {object} map[string]interface{} "Review created successfully"
// @Failure 400 {object} map[string]interface{} "Bad request"
// @Failure 409 {object} map[string]interface{} "Review already exists"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Security BearerAuth
// @Router /reviews [post]
func (rc *ReviewController) CreateReview(c *gin.Context) {
	var req CreateReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	// Check if review already exists for this booking
	existingReview, err := rc.reviewService.GetReviewByBooking(req.BookingID, req.UserID)
	if err != nil && err != gorm.ErrRecordNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to check existing review",
		})
		return
	}

	if existingReview != nil {
		c.JSON(http.StatusConflict, gin.H{
			"success": false,
			"error":   "Review already exists for this booking",
		})
		return
	}

	// Create review
	review := &models.Review{
		UserID:      req.UserID,
		SpaceID:     req.SpaceID,
		BookingID:   req.BookingID,
		Rating:      req.Rating,
		Title:       req.Title,
		Content:     req.Content,
		IsAnonymous: req.IsAnonymous,
		Language:    req.Language,
		Status:      models.ReviewStatusPending,
		IsVerified:  true, // Assuming verified if tied to a booking
	}

	if req.Language == "" {
		review.Language = "en"
	}

	createdReview, err := rc.reviewService.CreateReview(review, req.TagNames)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Review created successfully",
		"data":    createdReview,
	})
}

// GetReview gets a review by ID
// @Summary Get a review by ID
// @Description Get a single review by its ID
// @Tags reviews
// @Accept json
// @Produce json
// @Param id path int true "Review ID"
// @Success 200 {object} map[string]interface{} "Review found"
// @Failure 404 {object} map[string]interface{} "Review not found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /reviews/{id} [get]
func (rc *ReviewController) GetReview(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid review ID",
		})
		return
	}

	review, err := rc.reviewService.GetReviewByID(uint(id))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Review not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    review,
	})
}

// GetReviews gets reviews with filtering and pagination
// @Summary Get reviews with filtering
// @Description Get reviews with optional filtering by space, user, rating, etc.
// @Tags reviews
// @Accept json
// @Produce json
// @Param space_id query string false "Filter by space ID"
// @Param user_id query string false "Filter by user ID"
// @Param rating query int false "Filter by rating"
// @Param status query string false "Filter by status"
// @Param page query int false "Page number (default: 1)"
// @Param limit query int false "Items per page (default: 20, max: 100)"
// @Param sort query string false "Sort by field (default: created_at)"
// @Param order query string false "Sort order: asc or desc (default: desc)"
// @Success 200 {object} map[string]interface{} "Reviews found"
// @Failure 400 {object} map[string]interface{} "Bad request"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /reviews [get]
func (rc *ReviewController) GetReviews(c *gin.Context) {
	// Parse query parameters
	filters := services.ReviewFilters{
		SpaceID: c.Query("space_id"),
		UserID:  c.Query("user_id"),
		Status:  c.Query("status"),
	}

	if ratingStr := c.Query("rating"); ratingStr != "" {
		if rating, err := strconv.Atoi(ratingStr); err == nil && rating >= 1 && rating <= 5 {
			filters.Rating = &rating
		}
	}

	// Parse pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	pagination := services.Pagination{
		Page:  page,
		Limit: limit,
		Sort:  c.DefaultQuery("sort", "created_at"),
		Order: c.DefaultQuery("order", "desc"),
	}

	reviews, total, err := rc.reviewService.GetReviews(filters, pagination)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	// Calculate pagination info
	totalPages := (total + int64(limit) - 1) / int64(limit)
	hasNext := page < int(totalPages)
	hasPrev := page > 1

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    reviews,
		"pagination": gin.H{
			"current_page": page,
			"total_pages":  totalPages,
			"total_items":  total,
			"limit":        limit,
			"has_next":     hasNext,
			"has_prev":     hasPrev,
		},
	})
}

// UpdateReview updates an existing review
// @Summary Update a review
// @Description Update an existing review (only by the review author)
// @Tags reviews
// @Accept json
// @Produce json
// @Param id path int true "Review ID"
// @Param review body UpdateReviewRequest true "Review update data"
// @Success 200 {object} map[string]interface{} "Review updated successfully"
// @Failure 400 {object} map[string]interface{} "Bad request"
// @Failure 403 {object} map[string]interface{} "Forbidden"
// @Failure 404 {object} map[string]interface{} "Review not found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Security BearerAuth
// @Router /reviews/{id} [put]
func (rc *ReviewController) UpdateReview(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid review ID",
		})
		return
	}

	var req UpdateReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	// Get current user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "User not authenticated",
		})
		return
	}

	updatedReview, err := rc.reviewService.UpdateReview(uint(id), userID.(string), req)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Review not found",
			})
			return
		}
		if err.Error() == "unauthorized" {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"error":   "You can only update your own reviews",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Review updated successfully",
		"data":    updatedReview,
	})
}

// DeleteReview deletes a review
// @Summary Delete a review
// @Description Delete a review (only by the review author or admin)
// @Tags reviews
// @Accept json
// @Produce json
// @Param id path int true "Review ID"
// @Success 200 {object} map[string]interface{} "Review deleted successfully"
// @Failure 403 {object} map[string]interface{} "Forbidden"
// @Failure 404 {object} map[string]interface{} "Review not found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Security BearerAuth
// @Router /reviews/{id} [delete]
func (rc *ReviewController) DeleteReview(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid review ID",
		})
		return
	}

	// Get current user ID from context
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "User not authenticated",
		})
		return
	}

	err = rc.reviewService.DeleteReview(uint(id), userID.(string))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Review not found",
			})
			return
		}
		if err.Error() == "unauthorized" {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"error":   "You can only delete your own reviews",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Review deleted successfully",
	})
}

// MarkHelpful marks a review as helpful or not helpful
// @Summary Mark review as helpful
// @Description Mark a review as helpful or not helpful
// @Tags reviews
// @Accept json
// @Produce json
// @Param id path int true "Review ID"
// @Param helpful body map[string]bool true "Helpful flag"
// @Success 200 {object} map[string]interface{} "Review helpfulness updated"
// @Failure 400 {object} map[string]interface{} "Bad request"
// @Failure 404 {object} map[string]interface{} "Review not found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Security BearerAuth
// @Router /reviews/{id}/helpful [post]
func (rc *ReviewController) MarkHelpful(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid review ID",
		})
		return
	}

	var req struct {
		IsHelpful bool `json:"is_helpful" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "User not authenticated",
		})
		return
	}

	err = rc.reviewService.MarkHelpful(uint(id), userID.(string), req.IsHelpful)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Review not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Review helpfulness updated successfully",
	})
}

// ReportReview reports a review for inappropriate content
// @Summary Report a review
// @Description Report a review for inappropriate content
// @Tags reviews
// @Accept json
// @Produce json
// @Param id path int true "Review ID"
// @Param report body map[string]interface{} true "Report data"
// @Success 200 {object} map[string]interface{} "Review reported successfully"
// @Failure 400 {object} map[string]interface{} "Bad request"
// @Failure 404 {object} map[string]interface{} "Review not found"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Security BearerAuth
// @Router /reviews/{id}/report [post]
func (rc *ReviewController) ReportReview(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid review ID",
		})
		return
	}

	var req struct {
		Reason  string `json:"reason" binding:"required"`
		Details string `json:"details"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "User not authenticated",
		})
		return
	}

	err = rc.reviewService.ReportReview(uint(id), userID.(string), models.ReportReason(req.Reason), req.Details)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Review not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Review reported successfully",
	})
}
