package models

import (
	"time"

	"gorm.io/gorm"
)

type TicketStatus string

const (
	TicketOpen     TicketStatus = "open"
	TicketReplied  TicketStatus = "replied"
	TicketClosed   TicketStatus = "closed"
)

type Ticket struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `gorm:"not null;index" json:"user_id"`
	ProjectID *uint          `gorm:"index" json:"project_id"`
	Subject   string         `gorm:"size:300;not null" json:"subject"`
	Message   string         `gorm:"type:text;not null" json:"message"`
	Status    TicketStatus   `gorm:"size:20;default:'open'" json:"status"`
	AdminID   *uint          `json:"admin_id"`
	Reply     string         `gorm:"type:text" json:"reply,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	User    User     `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Admin   *User    `gorm:"foreignKey:AdminID" json:"admin,omitempty"`
	Project *Project `gorm:"foreignKey:ProjectID" json:"project,omitempty"`
}
