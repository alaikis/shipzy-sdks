package shared

import "testing"

func TestVersionMatchesFile(t *testing.T) {
	if Version == "" {
		t.Fatal("Version constant is empty")
	}
	expected := "2.0.2"
	if Version != expected {
		t.Fatalf("expected %s, got %s", expected, Version)
	}
}
