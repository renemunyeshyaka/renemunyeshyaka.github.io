package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"kcoders-portal/backend/internal/models"
)

type ServiceHandler struct {
	DB *gorm.DB
}

type CreateServiceRequest struct {
	Title       string  `json:"title" binding:"required"`
	Description string  `json:"description"`
	Category    string  `json:"category" binding:"required"`
	ImagePath   string  `json:"image_path"`
}

func (h *ServiceHandler) ListServices(c *gin.Context) {
	var services []models.Service
	query := h.DB.Where("is_archived = ?", false)

	if search := c.Query("search"); search != "" {
		query = query.Where("LOWER(title) LIKE ? OR LOWER(description) LIKE ?",
			"%"+strings.ToLower(search)+"%", "%"+strings.ToLower(search)+"%")
	}
	if cat := c.Query("category"); cat != "" {
		query = query.Where("category = ?", cat)
	}

	if err := query.Order("created_at DESC").Find(&services).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch services"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"services": services})
}

func (h *ServiceHandler) GetService(c *gin.Context) {
	id := c.Param("id")
	var service models.Service
	if err := h.DB.First(&service, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "service not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"service": service})
}

func (h *ServiceHandler) CreateService(c *gin.Context) {
	var req CreateServiceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	slug := strings.ToLower(strings.ReplaceAll(req.Title, " ", "-"))

	service := models.Service{
		Title:       req.Title,
		Slug:        slug,
		Description: req.Description,
		Category:    req.Category,
		ImagePath:   req.ImagePath,
	}

	if err := h.DB.Create(&service).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create service"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"service": service})
}

func (h *ServiceHandler) UpdateService(c *gin.Context) {
	id := c.Param("id")
	var service models.Service
	if err := h.DB.First(&service, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "service not found"})
		return
	}

	var req CreateServiceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{
		"title":       req.Title,
		"description": req.Description,
		"category":    req.Category,
		"image_path":  req.ImagePath,
	}
	if req.Title != "" {
		updates["slug"] = strings.ToLower(strings.ReplaceAll(req.Title, " ", "-"))
	}

	h.DB.Model(&service).Updates(updates)
	c.JSON(http.StatusOK, gin.H{"service": service})
}

func (h *ServiceHandler) ArchiveService(c *gin.Context) {
	id := c.Param("id")
	result := h.DB.Model(&models.Service{}).Where("id = ?", id).Update("is_archived", true)
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "service not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "service archived successfully"})
}

func (h *ServiceHandler) UnarchiveService(c *gin.Context) {
	id := c.Param("id")
	result := h.DB.Model(&models.Service{}).Where("id = ?", id).Update("is_archived", false)
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "service not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "service restored successfully"})
}

func (h *ServiceHandler) DeleteService(c *gin.Context) {
	id := c.Param("id")
	result := h.DB.Delete(&models.Service{}, id)
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "service not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "service deleted permanently"})
}
