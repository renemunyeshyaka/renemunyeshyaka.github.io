package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type ChatHandler struct{}

type ChatRequest struct {
	Message string `json:"message" binding:"required"`
}

type DeepSeekMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type DeepSeekRequest struct {
	Model       string            `json:"model"`
	Messages    []DeepSeekMessage `json:"messages"`
	Temperature float64           `json:"temperature"`
	MaxTokens   int               `json:"max_tokens"`
}

type DeepSeekResponse struct {
	Choices []struct {
		Message DeepSeekMessage `json:"message"`
	} `json:"choices"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

var systemPrompt = `You are a friendly AI assistant for Jean René MUNYESHYAKA's portfolio website (Kcoders). 

About Jean René:
- Full-stack Software Engineer, SysAdmin & Cybersecurity Enthusiast
- 10+ years experience, 20+ projects completed
- Based in Rwanda
- Expertise: Java Spring Boot, React, Next.js, Node.js, Go, Python, PostgreSQL, Docker, Kubernetes, AWS, Terraform, Ansible
- Services: Web Development, Mobile Apps, API & Integration, DevOps & Cloud, Cybersecurity, Architecture Design

Live Products:
- LandVal (https://landval.kcoders.org): AI-powered land valuation for Rwanda
- CV Builder (https://cvbuilder.kcoders.org): Professional CV & Resume Builder
- Kcoders Portal (https://kcoders.org): Client portal for software services

Contact: hello@kcoders.org
GitHub: https://github.com/renemunyeshyaka

Answer questions helpfully and concisely about Jean René's skills, projects, and services. If asked about hiring or collaboration, encourage visiting the Kcoders Portal or sending an email. Be warm and professional.`

func (h *ChatHandler) Chat(c *gin.Context) {
	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "message is required"})
		return
	}

	apiKey := os.Getenv("DEEPSEEK_API_KEY")
	if apiKey == "" {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "AI chat is not configured"})
		return
	}

	deepReq := DeepSeekRequest{
		Model: "deepseek-chat",
		Messages: []DeepSeekMessage{
			{Role: "system", Content: systemPrompt},
			{Role: "user", Content: req.Message},
		},
		Temperature: 0.7,
		MaxTokens:   500,
	}

	body, _ := json.Marshal(deepReq)

	httpReq, _ := http.NewRequest("POST", "https://api.deepseek.com/v1/chat/completions", bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+apiKey)

	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to reach AI service"})
		return
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	var deepResp DeepSeekResponse
	if err := json.Unmarshal(respBody, &deepResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse AI response"})
		return
	}

	if deepResp.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("AI error: %s", deepResp.Error.Message)})
		return
	}

	if len(deepResp.Choices) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "no response from AI"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"reply": deepResp.Choices[0].Message.Content,
	})
}
