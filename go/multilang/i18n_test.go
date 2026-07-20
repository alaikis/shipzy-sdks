package multilang

import (
	"testing"
)

type optionFunc func(*I18n)

func (f optionFunc) Apply(i *I18n) {
	f(i)
}

func TestNewI18n(t *testing.T) {
	i := NewI18n()
	if i.fallback != "en" {
		t.Errorf("expected default fallback 'en', got %s", i.fallback)
	}
}

func TestTranslate(t *testing.T) {
	i := NewI18n()
	i.Load("en", []*Translation{
		{Key: "hello", Language: "en", Value: "Hello"},
		{Key: "world", Language: "en", Value: "World"},
	})
	result := i.Translate("hello")
	if result != "Hello" {
		t.Errorf("expected 'Hello', got %s", result)
	}
}
