package models

import "time"

// ActivityLog tracks user actions for the client activity log.
type ActivityLog struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null;index" json:"user_id"`
	Action    string    `gorm:"size:100;not null" json:"action"`
	Details   string    `gorm:"type:text" json:"details"`
	CreatedAt time.Time `json:"created_at"`

	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// Activity action constants
const (
	ActionLogin           = "login"
	ActionRegister        = "register"
	ActionProjectBrief    = "project_brief"
	ActionTicketCreated   = "ticket_created"
	ActionProfileUpdate   = "profile_update"
	ActionPasswordReset   = "password_reset"
)
