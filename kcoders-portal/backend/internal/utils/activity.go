package utils

import (
	"time"

	"kcoders-portal/backend/internal/models"
	"gorm.io/gorm"
)

// LogActivity creates an activity log entry.
func LogActivity(db *gorm.DB, userID uint, action, details string) {
	entry := models.ActivityLog{
		UserID:    userID,
		Action:    action,
		Details:   details,
		CreatedAt: time.Now(),
	}
	db.Create(&entry)
}
