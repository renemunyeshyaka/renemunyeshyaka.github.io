package models

import (
	"time"
)

type OTP struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	UserID        uint      `gorm:"not null;index" json:"user_id"`
	Code          string    `gorm:"size:10;not null" json:"-"`
	Purpose       string    `gorm:"size:20;default:'login'" json:"purpose"`
	ExpiresAt     time.Time `gorm:"not null" json:"expires_at"`
	Used          bool      `gorm:"default:false" json:"used"`
	DeviceToken   string    `gorm:"size:200" json:"-"`
	DeviceExpires *time.Time `json:"device_expires,omitempty"`
	CreatedAt     time.Time `json:"created_at"`

	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (o *OTP) IsExpired() bool {
	return time.Now().After(o.ExpiresAt)
}

func (o *OTP) IsValid() bool {
	return !o.Used && !o.IsExpired()
}
