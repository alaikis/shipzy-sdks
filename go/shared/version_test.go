package shared

import "testing"

func TestVersionMatchesFile(t *testing.T) {
	if Version == "" {
		t.Fatal("Version constant is empty")
	}
	if Version != "0.1.0-alpha.1" {
		t.Fatalf("expected 0.1.0-alpha.1, got %s", Version)
	}
}
