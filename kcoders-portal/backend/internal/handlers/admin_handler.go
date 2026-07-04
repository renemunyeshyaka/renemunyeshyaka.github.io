package handlers

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"kcoders-portal/backend/internal/models"
	"kcoders-portal/backend/internal/utils"
)

type AdminHandler struct {
	DB *gorm.DB
}

// ==================== Dashboard ====================

func (h *AdminHandler) GetDashboard(c *gin.Context) {
	var totalUsers int64
	h.DB.Model(&models.User{}).Count(&totalUsers)

	var activeUsers int64
	h.DB.Model(&models.User{}).Where("is_active = ?", true).Count(&activeUsers)

	var totalServices int64
	h.DB.Model(&models.Service{}).Count(&totalServices)

	var activeServices int64
	h.DB.Model(&models.Service{}).Where("is_archived = ?", false).Count(&activeServices)

	var totalProjects int64
	h.DB.Model(&models.Project{}).Count(&totalProjects)

	var briefProjects int64
	h.DB.Model(&models.Project{}).Where("status = ?", models.ProjectStatusBrief).Count(&briefProjects)

	var activeProjects int64
	h.DB.Model(&models.Project{}).Where("status = ?", models.ProjectStatusActive).Count(&activeProjects)

	var pendingMilestones int64
	h.DB.Model(&models.Milestone{}).Where("status = ?", models.MilestonePending).Count(&pendingMilestones)

	// Revenue stats
	type RevenueResult struct {
		Currency string
		Total    float64
	}
	var revenue []RevenueResult
	h.DB.Model(&models.Milestone{}).
		Select("currency, SUM(amount) as total").
		Where("status = ?", models.MilestoneConfirmed).
		Group("currency").Find(&revenue)

	// Recent projects
	var recentProjects []models.Project
	h.DB.Preload("User").Preload("Service").
		Order("created_at DESC").Limit(10).Find(&recentProjects)

	// Visits today
	var visitsToday int64
	todayStart := time.Now().Truncate(24 * time.Hour)
	h.DB.Model(&models.Visit{}).Where("visited_at >= ?", todayStart).Count(&visitsToday)

	c.JSON(http.StatusOK, gin.H{
		"stats": gin.H{
			"total_users":        totalUsers,
			"active_users":       activeUsers,
			"total_services":     totalServices,
			"active_services":    activeServices,
			"total_projects":     totalProjects,
			"brief_projects":     briefProjects,
			"active_projects":    activeProjects,
			"pending_milestones": pendingMilestones,
			"visits_today":       visitsToday,
		},
		"revenue":         revenue,
		"recent_projects": recentProjects,
	})
}

// ==================== User Management ====================

func (h *AdminHandler) ListUsers(c *gin.Context) {
	var users []models.User
	query := h.DB

	if search := c.Query("search"); search != "" {
		query = query.Where("LOWER(name) LIKE ? OR LOWER(email) LIKE ?",
			"%"+search+"%", "%"+search+"%")
	}

	if status := c.Query("status"); status == "active" {
		query = query.Where("is_active = ?", true)
	} else if status == "suspended" {
		query = query.Where("is_active = ?", false)
	}

	if err := query.Order("created_at DESC").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch users"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}

func (h *AdminHandler) GetUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User
	if err := h.DB.Preload("Projects.Service").Preload("Projects.Milestones").First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"user": user})
}

func (h *AdminHandler) ToggleUserStatus(c *gin.Context) {
	id := c.Param("id")
	var user models.User
	if err := h.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	newStatus := !user.IsActive
	h.DB.Model(&user).Update("is_active", newStatus)

	status := "activated"
	if !newStatus {
		status = "suspended"
	}
	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("user %s successfully", status), "is_active": newStatus})
}

func (h *AdminHandler) DeleteUser(c *gin.Context) {
	id := c.Param("id")
	result := h.DB.Delete(&models.User{}, id)
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "user deleted successfully"})
}

// ==================== Service Management (Admin) ====================

func (h *AdminHandler) ListAllServices(c *gin.Context) {
	var services []models.Service
	query := h.DB

	if archived := c.Query("archived"); archived == "true" {
		query = query.Where("is_archived = ?", true)
	} else if archived == "false" {
		query = query.Where("is_archived = ?", false)
	}

	query.Order("created_at DESC").Find(&services)
	c.JSON(http.StatusOK, gin.H{"services": services})
}

// ==================== Project Management (Admin) ====================

func (h *AdminHandler) ListProjects(c *gin.Context) {
	var projects []models.Project
	query := h.DB.Preload("User").Preload("Service").Preload("Milestones")

	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}
	if serviceID := c.Query("service_id"); serviceID != "" {
		query = query.Where("service_id = ?", serviceID)
	}

	query.Order("created_at DESC").Find(&projects)
	c.JSON(http.StatusOK, gin.H{"projects": projects})
}

func (h *AdminHandler) UpdateProjectStatus(c *gin.Context) {
	id := c.Param("id")
	var project models.Project
	if err := h.DB.First(&project, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "project not found"})
		return
	}

	var req struct {
		Status      string `json:"status" binding:"required"`
		DeveloperID *uint  `json:"developer_id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{
		"status": req.Status,
	}
	if req.DeveloperID != nil {
		updates["developer_id"] = *req.DeveloperID
	}
	if req.Status == string(models.ProjectStatusActive) && project.StartedAt == nil {
		now := time.Now()
		updates["started_at"] = &now
	}
	if req.Status == string(models.ProjectStatusCompleted) {
		now := time.Now()
		updates["completed_at"] = &now
	}

	h.DB.Model(&project).Updates(updates)
	c.JSON(http.StatusOK, gin.H{"message": "project updated", "project": project})
}

// ==================== Milestone Management ====================

func (h *AdminHandler) CreateMilestone(c *gin.Context) {
	projectID := c.Param("id")

	var project models.Project
	if err := h.DB.First(&project, projectID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "project not found"})
		return
	}

	var req struct {
		Title       string  `json:"title" binding:"required"`
		Description string  `json:"description"`
		Amount      float64 `json:"amount" binding:"required"`
		Currency    string  `json:"currency" binding:"required"`
		Deadline    string  `json:"deadline"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	milestone := models.Milestone{
		ProjectID:   project.ID,
		Title:       req.Title,
		Description: req.Description,
		Amount:      req.Amount,
		Currency:    req.Currency,
		Status:      models.MilestonePending,
	}
	if req.Deadline != "" {
		if d, err := parseDate(req.Deadline); err == nil {
			milestone.Deadline = &d
		}
	}

	if err := h.DB.Create(&milestone).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create milestone"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"milestone": milestone})
}

func (h *AdminHandler) ListMilestones(c *gin.Context) {
	projectID := c.Param("id")
	var milestones []models.Milestone
	h.DB.Where("project_id = ?", projectID).Order("created_at ASC").Find(&milestones)
	c.JSON(http.StatusOK, gin.H{"milestones": milestones})
}

func (h *AdminHandler) VerifyMilestone(c *gin.Context) {
	adminID := c.GetUint("user_id")
	milestoneID := c.Param("id")

	var milestone models.Milestone
	if err := h.DB.Preload("Project.User").Preload("Project.Service").First(&milestone, milestoneID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "milestone not found"})
		return
	}

	var req struct {
		Action string `json:"action" binding:"required"` // "confirm" or "reject"
		Reason string `json:"reason"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	now := time.Now()

	if req.Action == "confirm" {
		h.DB.Model(&milestone).Updates(map[string]interface{}{
			"status":      models.MilestoneConfirmed,
			"verified_by": adminID,
			"verified_at": &now,
		})
		go utils.SendMilestoneConfirmedEmail(milestone.Project.User.Email, milestone.Project.User.Name,
			milestone.Project.Service.Title, milestone.Title)

		c.JSON(http.StatusOK, gin.H{"message": "milestone payment confirmed"})

	} else if req.Action == "reject" {
		h.DB.Model(&milestone).Updates(map[string]interface{}{
			"status":        models.MilestonePending,
			"verified_by":   adminID,
			"verified_at":   &now,
			"reject_reason": req.Reason,
		})
		c.JSON(http.StatusOK, gin.H{"message": "milestone payment rejected"})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "action must be 'confirm' or 'reject'"})
	}
}

// ==================== Ticket Management ====================

func (h *AdminHandler) ListTickets(c *gin.Context) {
	var tickets []models.Ticket
	query := h.DB.Preload("User")

	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	query.Order("created_at DESC").Find(&tickets)
	c.JSON(http.StatusOK, gin.H{"tickets": tickets})
}

func (h *AdminHandler) ReplyTicket(c *gin.Context) {
	adminID := c.GetUint("user_id")
	id := c.Param("id")

	var ticket models.Ticket
	if err := h.DB.Preload("User").First(&ticket, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ticket not found"})
		return
	}

	var req struct {
		Reply string `json:"reply" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.DB.Model(&ticket).Updates(map[string]interface{}{
		"status":   models.TicketReplied,
		"admin_id": adminID,
		"reply":    req.Reply,
	})

	go utils.SendTicketReplyEmail(ticket.User.Email, ticket.Subject, req.Reply)

	c.JSON(http.StatusOK, gin.H{"message": "reply sent"})
}

func (h *AdminHandler) CloseTicket(c *gin.Context) {
	id := c.Param("id")
	result := h.DB.Model(&models.Ticket{}).Where("id = ?", id).Update("status", models.TicketClosed)
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "ticket not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "ticket closed"})
}

// ==================== Analytics ====================

func (h *AdminHandler) GetVisits(c *gin.Context) {
	sinceStr := c.Query("since")
	since := time.Now().AddDate(0, 0, -7) // default last 7 days

	if sinceStr != "" {
		if t, err := time.Parse("2006-01-02", sinceStr); err == nil {
			since = t
		}
	}

	var totalVisits int64
	h.DB.Model(&models.Visit{}).Where("visited_at >= ?", since).Count(&totalVisits)

	type DailyVisits struct {
		Date  string `json:"date"`
		Count int64  `json:"count"`
	}
	var dailyVisits []DailyVisits
	h.DB.Model(&models.Visit{}).
		Select("DATE(visited_at) as date, COUNT(*) as count").
		Where("visited_at >= ?", since).
		Group("DATE(visited_at)").
		Order("date ASC").
		Find(&dailyVisits)

	c.JSON(http.StatusOK, gin.H{
		"total_visits": totalVisits,
		"daily_visits": dailyVisits,
		"since":        since,
	})
}

func (h *AdminHandler) GetRevenueReport(c *gin.Context) {
	sinceStr := c.Query("since")
	since := time.Now().AddDate(0, -1, 0) // default last month

	if sinceStr != "" {
		if t, err := time.Parse("2006-01-02", sinceStr); err == nil {
			since = t
		}
	}

	type RevenueItem struct {
		Date      string  `json:"date"`
		Amount    float64 `json:"amount"`
		Currency  string  `json:"currency"`
		Service   string  `json:"service"`
		Milestone string  `json:"milestone"`
	}

	var items []RevenueItem
	h.DB.Model(&models.Milestone{}).
		Select("DATE(milestones.verified_at) as date, milestones.amount, milestones.currency, services.title as service, milestones.title as milestone").
		Joins("JOIN projects ON projects.id = milestones.project_id").
		Joins("JOIN services ON services.id = projects.service_id").
		Where("milestones.status = ? AND milestones.verified_at >= ?", models.MilestoneConfirmed, since).
		Order("milestones.verified_at DESC").
		Find(&items)

	var totalRWF float64
	var totalUSDT float64
	for _, item := range items {
		if item.Currency == "RWF" {
			totalRWF += item.Amount
		} else {
			totalUSDT += item.Amount
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"revenue":    items,
		"total_rwf":  totalRWF,
		"total_usdt": totalUSDT,
		"since":      since,
	})
}

func (h *AdminHandler) ExportRevenueCSV(c *gin.Context) {
	sinceStr := c.Query("since")
	since := time.Now().AddDate(0, -1, 0)
	if sinceStr != "" {
		if t, err := time.Parse("2006-01-02", sinceStr); err == nil {
			since = t
		}
	}

	type RevenueItem struct {
		Date      string
		Amount    float64
		Currency  string
		Service   string
		Milestone string
	}

	var items []RevenueItem
	h.DB.Model(&models.Milestone{}).
		Select("DATE(milestones.verified_at) as date, milestones.amount, milestones.currency, services.title as service, milestones.title as milestone").
		Joins("JOIN projects ON projects.id = milestones.project_id").
		Joins("JOIN services ON services.id = projects.service_id").
		Where("milestones.status = ? AND milestones.verified_at >= ?", models.MilestoneConfirmed, since).
		Order("milestones.verified_at DESC").
		Find(&items)

	c.Header("Content-Type", "text/csv")
	c.Header("Content-Disposition", "attachment; filename=revenue-report.csv")

	csv := "Date,Service,Milestone,Amount,Currency\n"
	for _, item := range items {
		csv += fmt.Sprintf("%s,%s,%s,%.0f,%s\n", item.Date, item.Service, item.Milestone, item.Amount, item.Currency)
	}
	c.String(http.StatusOK, csv)
}

// ==================== Client Activity Log ====================

func (h *AdminHandler) GetActivityLog(c *gin.Context) {
	var activities []models.ActivityLog
	h.DB.Preload("User").Order("created_at DESC").Limit(100).Find(&activities)

	type ActivityItem struct {
		ID        uint   `json:"id"`
		UserID    uint   `json:"user_id"`
		UserName  string `json:"user_name"`
		UserEmail string `json:"user_email"`
		Action    string `json:"action"`
		Details   string `json:"details"`
		CreatedAt string `json:"created_at"`
	}

	var items []ActivityItem
	for _, a := range activities {
		name := ""
		email := ""
		if a.User != nil {
			name = a.User.Name
			email = a.User.Email
		}
		items = append(items, ActivityItem{
			ID:        a.ID,
			UserID:    a.UserID,
			UserName:  name,
			UserEmail: email,
			Action:    a.Action,
			Details:   a.Details,
			CreatedAt: a.CreatedAt.Format("2006-01-02 15:04"),
		})
	}

	c.JSON(http.StatusOK, gin.H{"activities": items})
}

// ==================== Deliverable Sign-off ====================

func (h *AdminHandler) SignOffDeliverable(c *gin.Context) {
	milestoneID := c.Param("id")

	var milestone models.Milestone
	if err := h.DB.Preload("Project.User").Preload("Project.Service").First(&milestone, milestoneID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "milestone not found"})
		return
	}

	now := time.Now()
	h.DB.Model(&milestone).Updates(map[string]interface{}{
		"status":     models.MilestoneCompleted,
		"verified_at": &now,
	})

	// If all milestones completed, mark project as completed
	var pendingCount int64
	h.DB.Model(&models.Milestone{}).Where("project_id = ? AND status != ?", milestone.ProjectID, models.MilestoneCompleted).Count(&pendingCount)
	if pendingCount == 0 {
		h.DB.Model(&milestone.Project).Updates(map[string]interface{}{
			"status":       models.ProjectStatusCompleted,
			"completed_at": &now,
		})
	}

	c.JSON(http.StatusOK, gin.H{"message": "deliverable signed off"})
}

// ==================== CSV Export/Import ====================

func (h *AdminHandler) ExportUsersCSV(c *gin.Context) {
	var users []models.User
	h.DB.Order("created_at DESC").Find(&users)

	c.Header("Content-Type", "text/csv")
	c.Header("Content-Disposition", "attachment; filename=users.csv")

	csv := "ID,Name,Email,Phone,WhatsApp,Country,Active,Admin,Created\n"
	for _, u := range users {
		active := "No"
		if u.IsActive {
			active = "Yes"
		}
		admin := "No"
		if u.IsAdmin {
			admin = "Yes"
		}
		csv += fmt.Sprintf("%d,%s,%s,%s,%s,%s,%s,%s,%s\n",
			u.ID, u.Name, u.Email, u.Phone, u.WhatsApp, u.Country,
			active, admin, u.CreatedAt.Format("2006-01-02"))
	}
	c.String(http.StatusOK, csv)
}

func (h *AdminHandler) ImportUsersCSV(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}

	f, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to open file"})
		return
	}
	defer f.Close()

	reader := csv.NewReader(f)
	records, err := reader.ReadAll()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid CSV format"})
		return
	}

	if len(records) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CSV must have header + at least one row"})
		return
	}

	imported := 0
	errors := 0
	for i, row := range records[1:] {
		if len(row) < 3 {
			errors++
			continue
		}
		name := strings.TrimSpace(row[0])
		email := strings.TrimSpace(row[1])
		password := strings.TrimSpace(row[2])

		if name == "" || email == "" || password == "" {
			errors++
			continue
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			errors++
			continue
		}

		user := models.User{
			Name:           name,
			Email:          email,
			PasswordHash:   string(hash),
			Phone:          "",
			Country:        "RW",
			IsActive:       true,
			EmailActivated: true,
		}

		if len(row) > 3 {
			user.Phone = strings.TrimSpace(row[3])
		}
		if len(row) > 4 {
			user.Country = strings.TrimSpace(row[4])
		}

		if err := h.DB.Create(&user).Error; err != nil {
			errors++
			continue
		}
		imported++
		_ = i
	}

	c.JSON(http.StatusOK, gin.H{
		"imported": imported,
		"errors":   errors,
		"message":  fmt.Sprintf("Imported %d users, %d errors", imported, errors),
	})
}
