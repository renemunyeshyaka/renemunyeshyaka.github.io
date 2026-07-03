package auth

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"math/big"
	"os"
	"time"

	"github.com/pquerna/otp/totp"
)

type OTPConfig struct {
	Issuer    string
	Length    int
	ExpiryMin int
}

func DefaultOTPConfig() *OTPConfig {
	issuer := os.Getenv("TOTP_ISSUER")
	if issuer == "" {
		issuer = "Kcoders.org"
	}
	return &OTPConfig{
		Issuer:    issuer,
		Length:    6,
		ExpiryMin: 5,
	}
}

func GenerateTOTPSecret() (string, error) {
	bytes := make([]byte, 10)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func GenerateTOTPCode(secret string) (string, error) {
	return totp.GenerateCode(secret, time.Now())
}

func ValidateTOTPCode(secret, code string) bool {
	return totp.Validate(code, secret)
}

func GenerateNumericOTP(length int) (string, error) {
	if length <= 0 {
		length = 6
	}
	max := new(big.Int)
	max.Exp(big.NewInt(10), big.NewInt(int64(length)), nil)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "", err
	}
	format := fmt.Sprintf("%%0%dd", length)
	return fmt.Sprintf(format, n), nil
}

func GenerateActivationToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}
