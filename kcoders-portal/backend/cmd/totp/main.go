package main

import (
	"fmt"
	"time"
	"github.com/pquerna/otp/totp"
)

func main() {
	code, _ := totp.GenerateCode("c3999e26f5437083e921", time.Now())
	fmt.Println(code)
}
