package controller

import (
	"listSpaces/config"
	"listSpaces/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllSpaces(c *gin.Context) {
	var spaces []model.Space
	if err := config.DB.Find(&spaces).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch spaces"})
		return
	}
	c.JSON(http.StatusOK, spaces)
}
