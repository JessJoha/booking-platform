package controller

import (
	"deleteSpace/config"
	"deleteSpace/model"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func DeleteSpace(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid space ID"})
		return
	}

	var space model.Space
	if err := config.DB.First(&space, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Space not found"})
		return
	}

	if err := config.DB.Delete(&space).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete space"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Space deleted successfully"})
}
