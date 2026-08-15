package utils

import "strings"

// NormalizeIdentifier trims whitespace and converts the string to lowercase.
func NormalizeIdentifier(s string) string {
	return strings.ToLower(strings.TrimSpace(s))
}
