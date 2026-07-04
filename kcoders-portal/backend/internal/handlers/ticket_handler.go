package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/renemunyeshyaka/kcoders-portal/backend/internal/models"
	"github.com/renemunyeshyaka/kcoders-portal/backend/internal/utils"
)

type TicketHandler struct {
	DB *gorm.DB
}

type CreateTicketRequest struct {
	Subject string `json:"subject" binding:"required,max=300"`
	Message string `json:"message" binding:"required"`
}

func (h *TicketHandler) CreateTicket(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req CreateTicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ticket := models.Ticket{
		UserID:  userID,
		Subject: req.Subject,
		Message: req.Message,
		Status:  models.TicketOpen,
	}

	if err := h.DB.Create(&ticket).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create ticket"})
		return
	}

	utils.LogActivity(h.DB, userID, models.ActionTicketCreated, "Created ticket: "+req.Subject)

	c.JSON(http.StatusCreated, gin.H{"ticket": ticket})
}

func (h *TicketHandler) MyTickets(c *gin.Context) {
	userID := c.GetUint("user_id")

	var tickets []models.Ticket
	h.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&tickets)

	c.JSON(http.StatusOK, gin.H{"tickets": tickets})
}

func (h *TicketHandler) GetTicket(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetUint("user_id")

	var ticket models.Ticket
	if err := h.DB.Where("id = ? AND user_id = ?", id, userID).First(&ticket).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ticket not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ticket": ticket})
}
