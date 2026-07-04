package main

import (
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/renemunyeshyaka/kcoders-portal/backend/internal/handlers"
	"github.com/renemunyeshyaka/kcoders-portal/backend/internal/middleware"
	"github.com/renemunyeshyaka/kcoders-portal/backend/internal/models"
)

func main() {
	// Load .env
	godotenv.Load()

	// Database connection
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = buildDSN()
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto-migrate
	db.AutoMigrate(
		&models.User{},
		&models.Service{},
		&models.Project{},
		&models.Milestone{},
		&models.OTP{},
		&models.Ticket{},
		&models.Visit{},
		&models.ActivityLog{},
	)

	// Init handlers
	authHandler := &handlers.AuthHandler{DB: db}
	serviceHandler := &handlers.ServiceHandler{DB: db}
	projectHandler := &handlers.ProjectHandler{DB: db}
	adminHandler := &handlers.AdminHandler{DB: db}
	ticketHandler := &handlers.TicketHandler{DB: db}
	visitHandler := &handlers.VisitHandler{DB: db}
	chatHandler := &handlers.ChatHandler{}

	// Setup router
	r := gin.Default()
	r.Use(middleware.CORSMiddleware())

	// Static files — configurable via env var for Docker support
	storagePath := os.Getenv("STORAGE_PATH")
	if storagePath == "" {
		storagePath = "../../storage"
	}
	r.Static("/uploads", storagePath+"/uploads")
	r.Static("/certificates", storagePath+"/certificates")

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "timestamp": time.Now()})
	})

	api := r.Group("/api")
	{
		// AI Chat (no auth)
		api.POST("/chat", chatHandler.Chat)

		// Visit tracking (no auth)
		api.POST("/visits/track", visitHandler.TrackVisit)

		// Auth routes (no auth)
		auth := api.Group("/auth")
		{
			auth.POST("/register", middleware.RateLimit(5, time.Minute), authHandler.Register)
			auth.GET("/activate", authHandler.Activate)
			auth.POST("/resend-activation", middleware.RateLimit(3, time.Minute), authHandler.ResendActivation)
			auth.POST("/login", middleware.RateLimit(10, time.Minute), authHandler.Login)
			auth.POST("/otp/verify", middleware.RateLimit(10, time.Minute), authHandler.VerifyOTP)
			auth.POST("/forgot-password", middleware.RateLimit(3, time.Minute), authHandler.ForgotPassword)
			auth.POST("/reset-password", authHandler.ResetPassword)
		}

		// Public services
		api.GET("/services", serviceHandler.ListServices)
		api.GET("/services/:id", serviceHandler.GetService)

		// Authenticated routes
		authed := api.Group("")
		authed.Use(middleware.AuthRequired())
		{
			// Profile
			authed.GET("/profile", authHandler.GetProfile)
			authed.PUT("/profile", authHandler.UpdateProfile)

			// Projects
			authed.POST("/projects/brief", projectHandler.SubmitBrief)
			authed.GET("/projects", projectHandler.MyProjects)
			authed.GET("/projects/:id", projectHandler.GetProject)
			authed.POST("/projects/:id/document", projectHandler.UploadDocument)

			// Dashboard
			authed.GET("/dashboard", projectHandler.Dashboard)

			// Tickets
			authed.POST("/tickets", ticketHandler.CreateTicket)
			authed.GET("/tickets", ticketHandler.MyTickets)
			authed.GET("/tickets/:id", ticketHandler.GetTicket)
		}

		// Admin routes
		admin := api.Group("/admin")
		admin.Use(middleware.AuthRequired())
		admin.Use(middleware.AdminRequired())
		{
			admin.GET("/dashboard", adminHandler.GetDashboard)

			// User management
			admin.GET("/users", adminHandler.ListUsers)
			admin.GET("/users/export/csv", adminHandler.ExportUsersCSV)
			admin.POST("/users/import/csv", adminHandler.ImportUsersCSV)
			admin.GET("/users/:id", adminHandler.GetUser)
			admin.PUT("/users/:id/toggle-status", adminHandler.ToggleUserStatus)
			admin.DELETE("/users/:id", adminHandler.DeleteUser)

			// Service management
			admin.GET("/services", adminHandler.ListAllServices)
			admin.POST("/services", serviceHandler.CreateService)
			admin.PUT("/services/:id", serviceHandler.UpdateService)
			admin.PUT("/services/:id/archive", serviceHandler.ArchiveService)
			admin.PUT("/services/:id/unarchive", serviceHandler.UnarchiveService)
			admin.DELETE("/services/:id", serviceHandler.DeleteService)

			// Project management
			admin.GET("/projects", adminHandler.ListProjects)
			admin.PUT("/projects/:id/status", adminHandler.UpdateProjectStatus)

			// Milestone management
			admin.POST("/projects/:id/milestones", adminHandler.CreateMilestone)
			admin.GET("/projects/:id/milestones", adminHandler.ListMilestones)
			admin.PUT("/milestones/:id/verify", adminHandler.VerifyMilestone)
			admin.PUT("/milestones/:id/sign-off", adminHandler.SignOffDeliverable)

			// Ticket management
			admin.GET("/tickets", adminHandler.ListTickets)
			admin.POST("/tickets/:id/reply", adminHandler.ReplyTicket)
			admin.PUT("/tickets/:id/close", adminHandler.CloseTicket)

			// Analytics
			admin.GET("/analytics/visits", adminHandler.GetVisits)
			admin.GET("/analytics/revenue", adminHandler.GetRevenueReport)
			admin.GET("/analytics/revenue/export/csv", adminHandler.ExportRevenueCSV)
			admin.GET("/analytics/activity", adminHandler.GetActivityLog)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func buildDSN() string {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "kcoders")
	password := getEnv("DB_PASSWORD", "your_password")
	dbName := getEnv("DB_NAME", "kcoders_portal")

	return "host=" + host + " port=" + port + " user=" + user + " password=" + password + " dbname=" + dbName + " sslmode=disable TimeZone=Africa/Kigali"
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
