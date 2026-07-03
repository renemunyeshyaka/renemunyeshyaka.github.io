package utils

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
)

type UploadResult struct {
	FilePath string
	FileName string
	Size     int64
}

const (
	MaxUploadSize    = 5 * 1024 * 1024 // 5MB
	AllowedDocuments = ".pdf,.jpg,.jpeg,.png"
)

func getUploadDir() string {
	if dir := os.Getenv("STORAGE_PATH"); dir != "" {
		return dir + "/uploads"
	}
	return "../../storage/uploads"
}

func SaveUploadedFile(file *multipart.FileHeader, subDir string) (*UploadResult, error) {
	ext := strings.ToLower(filepath.Ext(file.Filename))
	allowedExts := strings.Split(AllowedDocuments, ",")
	valid := false
	for _, e := range allowedExts {
		if ext == e {
			valid = true
			break
		}
	}
	if !valid {
		return nil, fmt.Errorf("file type %s not allowed. Allowed: %s", ext, AllowedDocuments)
	}

	if file.Size > MaxUploadSize {
		return nil, fmt.Errorf("file too large. Max: 5MB")
	}

	uploadPath := filepath.Join(getUploadDir(), subDir)
	if err := os.MkdirAll(uploadPath, 0755); err != nil {
		return nil, fmt.Errorf("failed to create upload directory: %w", err)
	}

	uniqueName := fmt.Sprintf("%s_%d%s", uuid.New().String(), time.Now().Unix(), ext)
	destPath := filepath.Join(uploadPath, uniqueName)

	src, err := file.Open()
	if err != nil {
		return nil, fmt.Errorf("failed to open uploaded file: %w", err)
	}
	defer src.Close()

	dst, err := os.Create(destPath)
	if err != nil {
		return nil, fmt.Errorf("failed to create destination file: %w", err)
	}
	defer dst.Close()

	size, err := io.Copy(dst, src)
	if err != nil {
		return nil, fmt.Errorf("failed to write file: %w", err)
	}

	relativePath := filepath.Join("uploads", subDir, uniqueName)

	return &UploadResult{
		FilePath: relativePath,
		FileName: uniqueName,
		Size:     size,
	}, nil
}

func DeleteFile(filePath string) error {
	uploadDir := getUploadDir()
	fullPath := filepath.Join(uploadDir, "..", filePath)
	return os.Remove(fullPath)
}

func GetFileURL(filePath string) string {
	if filePath == "" {
		return ""
	}
	return fmt.Sprintf("/%s", strings.ReplaceAll(filePath, "\\", "/"))
}
