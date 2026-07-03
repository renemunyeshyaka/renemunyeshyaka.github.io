package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/renemunyeshyaka/kcoders-portal/backend/internal/models"
)

type VisitHandler struct {
	DB *gorm.DB
}

type TrackVisitRequest struct {
	Page string `json:"page" binding:"required"`
}

func (h *VisitHandler) TrackVisit(c *gin.Context) {
	var req TrackVisitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	visit := models.Visit{
		IP:        c.ClientIP(),
		Page:      req.Page,
		UserAgent: c.GetHeader("User-Agent"),
		VisitedAt: time.Now(),
	}

	h.DB.Create(&visit)
	c.JSON(http.StatusOK, gin.H{"message": "tracked"})
}
