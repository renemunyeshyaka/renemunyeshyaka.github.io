package utils

import (
	"fmt"
	"net/smtp"
	"os"
	"strings"
)

type EmailConfig struct {
	SMTPHost string
	SMTPPort string
	User     string
	Password string
	From     string
}

func GetEmailConfig() *EmailConfig {
	fromEmail := os.Getenv("FROM_EMAIL")
	appName := os.Getenv("APP_NAME")
	if appName == "" {
		appName = "Kcoders Portal"
	}
	// Format: "App Name" <email@example.com>
	from := fmt.Sprintf(`"%s" <%s>`, appName, fromEmail)

	return &EmailConfig{
		SMTPHost: os.Getenv("SMTP_HOST"),
		SMTPPort: os.Getenv("SMTP_PORT"),
		User:     os.Getenv("SMTP_USER"),
		Password: os.Getenv("SMTP_PASSWORD"),
		From:     from,
	}
}

func SendEmail(to, subject, body string) error {
	cfg := GetEmailConfig()

	headers := make(map[string]string)
	headers["From"] = cfg.From
	headers["To"] = to
	headers["Subject"] = subject
	headers["MIME-Version"] = "1.0"
	headers["Content-Type"] = "text/html; charset=\"UTF-8\""

	var headerStr string
	for k, v := range headers {
		headerStr += fmt.Sprintf("%s: %s\r\n", k, v)
	}

	msg := headerStr + "\r\n" + body

	addr := fmt.Sprintf("%s:%s", cfg.SMTPHost, cfg.SMTPPort)
	auth := smtp.PlainAuth("", cfg.User, cfg.Password, cfg.SMTPHost)

	return smtp.SendMail(addr, auth, cfg.From, []string{to}, []byte(msg))
}

func SendActivationEmail(to, token string) error {
	activationLink := fmt.Sprintf("https://kcoders.org/api/auth/activate?token=%s", token)
	subject := "Activate Your Kcoders Account"
	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head><meta charset="UTF-8"></head>
		<body style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 40px;">
			<div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
				<div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 30px; text-align: center;">
					<h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Kcoders Portal</h1>
				</div>
				<div style="padding: 40px 30px;">
					<p style="color: #1a2c3e; font-size: 16px; line-height: 1.6;">Thank you for registering! Please activate your account by clicking the button below:</p>
					<div style="text-align: center; margin: 30px 0;">
						<a href="%s" style="background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">Activate Account</a>
					</div>
					<p style="color: #6b7280; font-size: 14px;">Or copy this link into your browser:</p>
					<p style="background: #f3f4f6; padding: 12px; border-radius: 6px; font-size: 12px; word-break: break-all; color: #374151;">%s</p>
					<p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This link expires in 24 hours.</p>
				</div>
				<div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
					<p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; 2026 Kcoders. All rights reserved.</p>
				</div>
			</div>
		</body>
		</html>
	`, activationLink, activationLink)
	return SendEmail(to, subject, body)
}

func SendOTPEmail(to, code string) error {
	subject := "Your Login Verification Code"
	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head><meta charset="UTF-8"></head>
		<body style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 40px;">
			<div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
				<div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 30px; text-align: center;">
					<h1 style="color: white; margin: 0; font-size: 24px;">Verification Code</h1>
				</div>
				<div style="padding: 40px 30px; text-align: center;">
					<p style="color: #1a2c3e; font-size: 16px;">Use the following code to complete your login:</p>
					<div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0; letter-spacing: 8px;">
						<span style="font-size: 36px; font-weight: 700; color: #2563eb;">%s</span>
					</div>
					<p style="color: #6b7280; font-size: 14px;">This code expires in 5 minutes. Never share this code with anyone.</p>
				</div>
				<div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
					<p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; 2026 Kcoders. All rights reserved.</p>
				</div>
			</div>
		</body>
		</html>
	`, code)
	return SendEmail(to, subject, body)
}

func SendProjectBriefEmail(to, name, serviceTitle, description string) error {
	subject := "New Project Brief Received - Kcoders"
	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head><meta charset="UTF-8"></head>
		<body style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 40px;">
			<div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
				<div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 30px; text-align: center;">
					<h1 style="color: white; margin: 0; font-size: 24px;">Project Brief Received</h1>
				</div>
				<div style="padding: 40px 30px;">
					<p style="color: #1a2c3e; font-size: 16px;">Dear <strong>%s</strong>,</p>
					<p style="color: #1a2c3e; font-size: 16px; line-height: 1.6;">Thank you for submitting your project brief for <strong>%s</strong>. Our team will review your requirements and get back to you with a proposal shortly.</p>
					<div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
						<h3 style="color: #1a2c3e; margin: 0 0 15px 0;">Your Requirements</h3>
						<p style="color: #374151; font-size: 14px; line-height: 1.6;">%s</p>
					</div>
					<p style="color: #6b7280; font-size: 14px;">For any urgent questions, feel free to contact us via WhatsApp at +250788620201.</p>
				</div>
				<div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
					<p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; 2026 Kcoders. All rights reserved.</p>
				</div>
			</div>
		</body>
		</html>
	`, name, serviceTitle, description)
	return SendEmail(to, subject, body)
}

func SendMilestoneConfirmedEmail(to, name, serviceTitle, milestoneTitle string) error {
	subject := "Milestone Payment Confirmed - Kcoders"
	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head><meta charset="UTF-8"></head>
		<body style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 40px;">
			<div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
				<div style="background: linear-gradient(135deg, #059669, #047857); padding: 30px; text-align: center;">
					<h1 style="color: white; margin: 0; font-size: 24px;">✅ Milestone Payment Confirmed</h1>
				</div>
				<div style="padding: 40px 30px;">
					<p style="color: #1a2c3e; font-size: 16px;">Dear <strong>%s</strong>,</p>
					<p style="color: #1a2c3e; font-size: 16px; line-height: 1.6;">Your payment for milestone <strong>%s</strong> in project <strong>%s</strong> has been confirmed. Work on this milestone will begin shortly.</p>
					<p style="color: #6b7280; font-size: 14px;">You can track the progress of your project from your dashboard. For any questions, contact us at info@kcoders.org.</p>
				</div>
				<div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
					<p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; 2026 Kcoders. All rights reserved.</p>
				</div>
			</div>
		</body>
		</html>
	`, name, milestoneTitle, serviceTitle)
	return SendEmail(to, subject, body)
}

func SendTicketReplyEmail(to, subject, reply string) error {
	emailSubject := "Support Ticket Reply - " + subject
	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head><meta charset="UTF-8"></head>
		<body style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 40px;">
			<div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
				<div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 30px; text-align: center;">
					<h1 style="color: white; margin: 0; font-size: 24px;">Support Ticket Reply</h1>
				</div>
				<div style="padding: 40px 30px;">
					<p style="color: #1a2c3e; font-size: 16px;">Your ticket "<strong>%s</strong>" has received a reply:</p>
					<div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
						<p style="color: #374151; font-size: 14px; line-height: 1.6;">%s</p>
					</div>
					<p style="color: #6b7280; font-size: 14px;">Log in to your dashboard to continue the conversation.</p>
				</div>
				<div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
					<p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; 2026 Kcoders. All rights reserved.</p>
				</div>
			</div>
		</body>
		</html>
	`, subject, reply)
	return SendEmail(to, emailSubject, body)
}

func ValidateEmail(email string) bool {
	return strings.Contains(email, "@") && strings.Contains(email, ".")
}
