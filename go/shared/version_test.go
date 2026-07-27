package shared

import "testing"

func TestVersionMatchesFile(t *testing.T) {
	if Version == "" {
		t.Fatal("Version constant is empty")
	}
	if Version != "1.1.1" {
		t.Fatalf("expected 1.1.1, got %s", Version)
	}
}
