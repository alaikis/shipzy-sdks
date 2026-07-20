package shared

import (
	"testing"
)

func TestNewConfig(t *testing.T) {
	cfg := NewConfig(WithBaseURL("https://test.shipzy.me"))
	if cfg.BaseURL != "https://test.shipzy.me" {
		t.Errorf("expected BaseURL to be set, got %s", cfg.BaseURL)
	}
	if cfg.Timeout != 30 {
		t.Errorf("expected default Timeout 30, got %d", cfg.Timeout)
	}
	if cfg.RetryCount != 3 {
		t.Errorf("expected default RetryCount 3, got %d", cfg.RetryCount)
	}
}

func TestAPIKeyAuth(t *testing.T) {
	auth := &APIKeyAuth{Key: "test-key"}
	// TODO: add mock HTTP request to verify Authorization header
	_ = auth
}
