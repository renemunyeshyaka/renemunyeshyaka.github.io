package models

import (
	"time"

	"gorm.io/gorm"
)

// ProjectStatus tracks where a project is in its lifecycle (replaces Enrollment).
type ProjectStatus string

const (
	ProjectStatusBrief     ProjectStatus = "brief"
	ProjectStatusProposal  ProjectStatus = "proposal"
	ProjectStatusActive    ProjectStatus = "active"
	ProjectStatusCompleted ProjectStatus = "completed"
	ProjectStatusCancelled ProjectStatus = "cancelled"
)

// Project represents a client software development project (replaces Enrollment).
type Project struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `gorm:"not null;index" json:"user_id"`
	ServiceID uint           `gorm:"not null;index" json:"service_id"`
	Tier      string         `gorm:"size:20;default:'basic'" json:"tier"`
	Status    ProjectStatus  `gorm:"size:20;default:'brief'" json:"status"`

	// Project brief fields
	FullName    string `gorm:"size:150" json:"full_name"`
	Email       string `gorm:"size:255" json:"email"`
	Phone       string `gorm:"size:30" json:"phone"`
	Description string `gorm:"type:text" json:"description"`
	BudgetRange string `gorm:"size:50" json:"budget_range"`

	// Developer assignment
	DeveloperID *uint `json:"developer_id"`

	// Dates
	StartedAt   *time.Time     `json:"started_at"`
	CompletedAt *time.Time     `json:"completed_at"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	User       User       `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Service    Service    `gorm:"foreignKey:ServiceID" json:"service,omitempty"`
	Developer  *User      `gorm:"foreignKey:DeveloperID" json:"developer,omitempty"`
	Milestones []Milestone `json:"milestones,omitempty"`
	Tickets    []Ticket   `json:"tickets,omitempty"`
}
