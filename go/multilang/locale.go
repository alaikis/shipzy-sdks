package multilang

import (
	"net/http"
	"strings"
)

func DetectLocale(r *http.Request) *Locale {
	accept := r.Header.Get("Accept-Language")
	if accept == "" {
		return &Locale{Language: "en"}
	}
	parts := strings.Split(accept, ",")
	if len(parts) > 0 {
		lang := strings.Split(parts[0], "-")[0]
		return &Locale{Language: lang}
	}
	return &Locale{Language: "en"}
}

func (l *Locale) FormatDate(format string, t interface{}) string {
	return ""
}

func (l *Locale) FormatCurrency(amount float64) string {
	return ""
}
