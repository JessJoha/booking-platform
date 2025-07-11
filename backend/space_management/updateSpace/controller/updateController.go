package controller

import (
	"net/http"
	"strconv"
	"updateSpace/config"
	"updateSpace/model"

	"github.com/gin-gonic/gin"
)

func UpdateSpace(c *gin.Context) {
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

	if err := c.ShouldBindJSON(&space); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	space.ID = uint(id)

	if err := config.DB.Save(&space).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update space"})
		return
	}

	c.JSON(http.StatusOK, space)
}
