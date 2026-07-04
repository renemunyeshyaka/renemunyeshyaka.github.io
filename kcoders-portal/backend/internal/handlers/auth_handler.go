package handlers

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"kcoders-portal/backend/internal/auth"
	"kcoders-portal/backend/internal/models"
	"kcoders-portal/backend/internal/utils"
)

type AuthHandler struct {
	DB *gorm.DB
}

type RegisterRequest struct {
	Name     string `json:"name" binding:"required,min=2,max=150"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	Phone    string `json:"phone"`
	Country  string `json:"country"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type VerifyOTPRequest struct {
	Email string `json:"email" binding:"required,email"`
	Code  string `json:"code" binding:"required"`
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existing models.User
	if result := h.DB.Where("email = ?", req.Email).First(&existing); result.Error == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "email already registered"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to process password"})
		return
	}

	activationToken, err := auth.GenerateActivationToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate activation token"})
		return
	}

	country := req.Country
	if country == "" {
		country = "RW"
	}

	// Generate TOTP secret for future use
	totpSecret, err := auth.GenerateTOTPSecret()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate security key"})
		return
	}

	user := models.User{
		Name:            req.Name,
		Email:           req.Email,
		PasswordHash:    string(hashedPassword),
		Phone:           req.Phone,
		WhatsApp:        req.Phone,
		Country:         country,
		TOTPSecret:      totpSecret,
		EmailActivated:  false,
		IsActive:        true,
		ActivationToken: activationToken,
	}

	if err := h.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
		return
	}

	utils.LogActivity(h.DB, user.ID, models.ActionRegister, "User registered")

	go func() {
		utils.SendActivationEmail(req.Email, activationToken)
	}()

	c.JSON(http.StatusCreated, gin.H{
		"message": "registration successful. Please check your email to activate your account.",
	})
}

func (h *AuthHandler) Activate(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "activation token required"})
		return
	}

	result := h.DB.Model(&models.User{}).Where("activation_token = ? AND email_activated = ?", token, false).
		Updates(map[string]interface{}{
			"email_activated":  true,
			"activation_token": "",
		})

	if result.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid or expired activation token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "account activated successfully. You can now log in."})
}

func (h *AuthHandler) ResendActivation(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := h.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"message": "if the email exists, a new activation link has been sent."})
		return
	}

	if user.EmailActivated {
		c.JSON(http.StatusOK, gin.H{"message": "account is already activated. Please log in."})
		return
	}

	token, err := auth.GenerateActivationToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	h.DB.Model(&user).Update("activation_token", token)

	go utils.SendActivationEmail(user.Email, token)

	c.JSON(http.StatusOK, gin.H{"message": "if the email exists, a new activation link has been sent."})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := h.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		return
	}

	if !user.EmailActivated {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "please activate your account first. Check your email or request a new activation link."})
		return
	}

	if !user.IsActive {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "your account has been suspended. Contact support."})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		return
	}

	otpCode, err := auth.GenerateNumericOTP(6)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate OTP"})
		return
	}

	otp := models.OTP{
		UserID:    user.ID,
		Code:      otpCode,
		Purpose:   "login",
		ExpiresAt: time.Now().Add(5 * time.Minute),
	}
	h.DB.Create(&otp)

	go utils.SendOTPEmail(user.Email, otpCode)

	c.JSON(http.StatusOK, gin.H{
		"message": "OTP sent to your email. Please verify to complete login.",
		"email":   user.Email,
		"otp_id":  otp.ID,
	})
}

func (h *AuthHandler) VerifyOTP(c *gin.Context) {
	var req struct {
		Email         string `json:"email" binding:"required,email"`
		Code          string `json:"code" binding:"required"`
		RememberDevice bool  `json:"remember_device"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := h.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
		return
	}

	var otp models.OTP
	if err := h.DB.Where("user_id = ? AND code = ? AND purpose = ? AND used = ?",
		user.ID, req.Code, "login", false).Last(&otp).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid OTP code"})
		return
	}

	if !otp.IsValid() {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "OTP has expired. Please request a new one."})
		return
	}

	h.DB.Model(&otp).Update("used", true)
	now := time.Now()
	h.DB.Model(&user).Update("last_login_at", &now)

	// Remember this device for 30 days
	var deviceToken string
	if req.RememberDevice {
		deviceToken, _ = auth.GenerateActivationToken()
		deviceExpires := now.Add(30 * 24 * time.Hour)
		h.DB.Model(&otp).Updates(map[string]interface{}{
			"device_token":  deviceToken,
			"device_expires": &deviceExpires,
		})
	}

	token, err := auth.GenerateToken(user.ID, user.Email, user.IsAdmin)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	utils.LogActivity(h.DB, user.ID, models.ActionLogin, "User logged in")

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"device_token": deviceToken,
		"user": gin.H{
			"id":       user.ID,
			"name":     user.Name,
			"email":    user.Email,
			"phone":    user.Phone,
			"whatsapp": user.WhatsApp,
			"country":  user.Country,
			"is_admin": user.IsAdmin,
		},
	})
}

func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID := c.GetUint("user_id")

	var user models.User
	if err := h.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"id":              user.ID,
			"name":            user.Name,
			"email":           user.Email,
			"phone":           user.Phone,
			"whatsapp":        user.WhatsApp,
			"country":         user.Country,
			"is_admin":        user.IsAdmin,
			"email_activated": user.EmailActivated,
			"last_login_at":   user.LastLoginAt,
			"created_at":      user.CreatedAt,
		},
	})
}

func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req struct {
		Name     string `json:"name"`
		Phone    string `json:"phone"`
		WhatsApp string `json:"whatsapp"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{}
	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Phone != "" {
		updates["phone"] = req.Phone
	}
	if req.WhatsApp != "" {
		updates["whatsapp"] = req.WhatsApp
	}

	if len(updates) > 0 {
		h.DB.Model(&models.User{}).Where("id = ?", userID).Updates(updates)
	}

	c.JSON(http.StatusOK, gin.H{"message": "profile updated successfully"})
}

func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := h.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"message": "if the email exists, a reset link has been sent."})
		return
	}

	token, err := auth.GenerateActivationToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	h.DB.Model(&user).Update("activation_token", token)

	resetLink := os.Getenv("FRONTEND_URL") + "/reset-password?token=" + token
	subject := "Password Reset - Kcoders Portal"
	body := "<p>Click <a href='" + resetLink + "'>here</a> to reset your password. This link expires in 1 hour.</p>"
	go utils.SendEmail(user.Email, subject, body)

	c.JSON(http.StatusOK, gin.H{"message": "if the email exists, a reset link has been sent."})
}

func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req struct {
		Token       string `json:"token" binding:"required"`
		NewPassword string `json:"new_password" binding:"required,min=8"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := h.DB.Where("activation_token = ?", req.Token).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid or expired token"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to process password"})
		return
	}

	h.DB.Model(&user).Updates(map[string]interface{}{
		"password_hash":   string(hashedPassword),
		"activation_token": "",
	})

	c.JSON(http.StatusOK, gin.H{"message": "password reset successfully. Please log in."})
}
