package models

import (
	"time"
)

type Visit struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	IP        string    `gorm:"size:45" json:"ip"`
	Page      string    `gorm:"size:500" json:"page"`
	UserAgent string    `gorm:"size:500" json:"user_agent"`
	VisitedAt time.Time `gorm:"index" json:"visited_at"`
}
