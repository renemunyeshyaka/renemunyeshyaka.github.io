package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	Name            string         `gorm:"size:150;not null" json:"name"`
	Email           string         `gorm:"size:255;uniqueIndex;not null" json:"email"`
	PasswordHash    string         `gorm:"size:255;not null" json:"-"`
	Phone           string         `gorm:"size:30" json:"phone"`
	WhatsApp        string         `gorm:"size:30" json:"whatsapp"`
	DocumentPath    string         `gorm:"size:500" json:"-"`
	TOTPSecret      string         `gorm:"size:100" json:"-"`
	IsActive        bool           `gorm:"default:false" json:"is_active"`
	IsAdmin         bool           `gorm:"default:false" json:"is_admin"`
	IsHighValue     bool           `gorm:"default:false" json:"is_high_value"`
	EmailActivated  bool           `gorm:"default:false" json:"email_activated"`
	ActivationToken string         `gorm:"size:500" json:"-"`
	Country         string         `gorm:"size:100;default:'RW'" json:"country"`
	LastLoginAt     *time.Time     `json:"last_login_at"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`

	Projects   []Project  `json:"projects,omitempty"`
	Tickets    []Ticket   `json:"tickets,omitempty"`
}

func (u *User) IsRwandan() bool {
	return u.Country == "RW" || u.Country == "RWA"
}
