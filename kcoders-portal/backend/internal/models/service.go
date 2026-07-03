package models

import (
	"time"

	"gorm.io/gorm"
)

// Service represents a software development service offered (replaces Course).
type Service struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"size:200;not null" json:"title"`
	Slug        string         `gorm:"size:200;uniqueIndex;not null" json:"slug"`
	Description string         `gorm:"type:text" json:"description"`
	ImagePath   string         `gorm:"size:500" json:"image_path"`
	Category    string         `gorm:"size:50;not null;default:'web'" json:"category"`
	IsArchived  bool           `gorm:"default:false" json:"is_archived"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	Projects []Project `json:"projects,omitempty"`
}

// ServiceTier holds pricing for a single package tier.
type ServiceTier struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	PriceRWF    float64 `json:"price_rwf"`
	PriceUSDT   float64 `json:"price_usdt"`
}

// ServicePricing groups all tiers for a service.
type ServicePricing struct {
	Basic      ServiceTier `json:"basic"`
	Standard   ServiceTier `json:"standard"`
	Enterprise ServiceTier `json:"enterprise"`
}

// Service categories
const (
	ServiceCategoryWeb           = "web"
	ServiceCategoryMobile        = "mobile"
	ServiceCategoryAPI           = "api"
	ServiceCategoryDevOps        = "devops"
	ServiceCategorySecurity      = "security"
	ServiceCategoryAudit         = "audit"
	ServiceCategoryArchitecture  = "architecture"
)
