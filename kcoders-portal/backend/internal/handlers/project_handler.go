package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/renemunyeshyaka/kcoders-portal/backend/internal/models"
	"github.com/renemunyeshyaka/kcoders-portal/backend/internal/utils"
)

type ProjectHandler struct {
	DB *gorm.DB
}

type ProjectBriefRequest struct {
	ServiceID   uint   `json:"service_id" binding:"required"`
	Tier        string `json:"tier" binding:"required"`
	FullName    string `json:"full_name" binding:"required"`
	Email       string `json:"email" binding:"required,email"`
	Phone       string `json:"phone" binding:"required"`
	Description string `json:"description" binding:"required"`
	BudgetRange string `json:"budget_range"`
}

func (h *ProjectHandler) SubmitBrief(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req ProjectBriefRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var service models.Service
	if err := h.DB.Where("id = ? AND is_archived = ?", req.ServiceID, false).First(&service).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "service not found or archived"})
		return
	}

	project := models.Project{
		UserID:      userID,
		ServiceID:   req.ServiceID,
		Tier:        req.Tier,
		Status:      models.ProjectStatusBrief,
		FullName:    req.FullName,
		Email:       req.Email,
		Phone:       req.Phone,
		Description: req.Description,
		BudgetRange: req.BudgetRange,
	}

	if err := h.DB.Create(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to submit project brief"})
		return
	}

	utils.LogActivity(h.DB, userID, models.ActionProjectBrief, "Submitted brief for "+service.Title+" ("+req.Tier+" tier)")

	// Notify admin via email
	go utils.SendProjectBriefEmail(project.Email, project.FullName, service.Title, project.Description)

	c.JSON(http.StatusCreated, gin.H{
		"message": "project brief submitted successfully. You will receive a proposal shortly.",
		"project": project,
	})
}

func (h *ProjectHandler) MyProjects(c *gin.Context) {
	userID := c.GetUint("user_id")

	var projects []models.Project
	h.DB.Preload("Service").
		Preload("Milestones").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&projects)

	c.JSON(http.StatusOK, gin.H{"projects": projects})
}

func (h *ProjectHandler) GetProject(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetUint("user_id")
	isAdmin := c.GetBool("is_admin")

	var project models.Project
	query := h.DB.Preload("Service").Preload("Milestones").Preload("Tickets").
		Preload("Developer")

	if isAdmin {
		query = query.First(&project, id)
	} else {
		query = query.Where("id = ? AND user_id = ?", id, userID).First(&project)
	}

	if err := query.Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "project not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"project": project})
}

func (h *ProjectHandler) Dashboard(c *gin.Context) {
	userID := c.GetUint("user_id")

	var totalProjects int64
	h.DB.Model(&models.Project{}).Where("user_id = ?", userID).Count(&totalProjects)

	var activeProjects int64
	h.DB.Model(&models.Project{}).Where("user_id = ? AND status IN ?", userID,
		[]models.ProjectStatus{models.ProjectStatusActive, models.ProjectStatusProposal}).Count(&activeProjects)

	var completedCount int64
	h.DB.Model(&models.Project{}).Where("user_id = ? AND status = ?", userID, models.ProjectStatusCompleted).Count(&completedCount)

	var briefProjects int64
	h.DB.Model(&models.Project{}).Where("user_id = ? AND status = ?", userID, models.ProjectStatusBrief).Count(&briefProjects)

	var recentProjects []models.Project
	h.DB.Preload("Service").Preload("Milestones").
		Where("user_id = ?", userID).
		Order("created_at DESC").Limit(5).Find(&recentProjects)

	// Check for expiring milestones
	var expiringMilestones []models.Milestone
	h.DB.Preload("Project.Service").
		Joins("JOIN projects ON projects.id = milestones.project_id").
		Where("projects.user_id = ? AND milestones.status = ? AND milestones.deadline > ?",
			userID, models.MilestonePending, time.Now()).
		Find(&expiringMilestones)

	var tickets []models.Ticket
	h.DB.Where("user_id = ? AND status != ?", userID, models.TicketClosed).Order("created_at DESC").Limit(5).Find(&tickets)

	c.JSON(http.StatusOK, gin.H{
		"stats": gin.H{
			"total_projects":  totalProjects,
			"active_projects": activeProjects,
			"completed":       completedCount,
			"pending_briefs":  briefProjects,
		},
		"recent_projects":    recentProjects,
		"expiring_milestones": expiringMilestones,
		"tickets":            tickets,
	})
}

func (h *ProjectHandler) UploadDocument(c *gin.Context) {
	projectID := c.Param("id")
	userID := c.GetUint("user_id")

	var project models.Project
	if err := h.DB.Where("id = ? AND user_id = ?", projectID, userID).First(&project).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "project not found"})
		return
	}

	file, err := c.FormFile("document")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "document file required"})
		return
	}

	result, err := utils.SaveUploadedFile(file, fmt.Sprintf("documents/project_%s", projectID))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "document uploaded",
		"file_path": result.FilePath,
	})
}
