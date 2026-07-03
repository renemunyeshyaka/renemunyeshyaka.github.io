package models

import (
	"time"

	"gorm.io/gorm"
)

// MilestoneStatus tracks the payment and delivery state of a milestone.
type MilestoneStatus string

const (
	MilestonePending   MilestoneStatus = "pending"
	MilestonePaid      MilestoneStatus = "paid"
	MilestoneConfirmed MilestoneStatus = "confirmed"
	MilestoneCompleted MilestoneStatus = "completed"
)

// Milestone represents a milestone-based payment for a project (replaces Payment).
type Milestone struct {
	ID          uint            `gorm:"primaryKey" json:"id"`
	ProjectID   uint            `gorm:"not null;index" json:"project_id"`
	Title       string          `gorm:"size:200;not null" json:"title"`
	Description string          `gorm:"type:text" json:"description"`
	Amount      float64         `gorm:"not null" json:"amount"`
	Currency    string          `gorm:"size:10;not null;default:'RWF'" json:"currency"`
	Status      MilestoneStatus `gorm:"size:20;default:'pending'" json:"status"`
	Deadline    *time.Time      `json:"deadline"`
	PaidAt      *time.Time      `json:"paid_at"`
	VerifiedBy  *uint           `json:"verified_by"`
	VerifiedAt  *time.Time      `json:"verified_at"`
	RejectReason string         `gorm:"type:text" json:"reject_reason,omitempty"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
	DeletedAt   gorm.DeletedAt  `gorm:"index" json:"-"`

	Project  Project `gorm:"foreignKey:ProjectID" json:"project,omitempty"`
	Verifier *User   `gorm:"foreignKey:VerifiedBy" json:"verifier,omitempty"`
}
