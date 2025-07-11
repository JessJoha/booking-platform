package controller

import (
	"createSpace/config"
	"createSpace/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateSpace(c *gin.Context) {
	var newSpace model.Space

	if err := c.ShouldBindJSON(&newSpace); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if newSpace.Name == "" || newSpace.Location == "" || newSpace.Type == "" || newSpace.Capacity <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	result := config.DB.Create(&newSpace)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating space"})
		return
	}

	c.JSON(http.StatusCreated, newSpace)
}
