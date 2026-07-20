package multilang

type Option func(*I18n)

type I18n struct {
	translations map[string]map[string]*Translation
	fallback     string
}

func NewI18n(opts ...Option) *I18n {
	i := &I18n{
		translations: make(map[string]map[string]*Translation),
		fallback:     "en",
	}
	for _, opt := range opts {
		opt(i)
	}
	return i
}

func (i *I18n) Translate(key string, args ...interface{}) string {
	result := key
	for lang := range i.translations {
		if tr, ok := i.translations[lang][key]; ok {
			result = tr.Value
			break
		}
	}
	return result
}

func (i *I18n) Load(lang string, translations []*Translation) {
	if i.translations[lang] == nil {
		i.translations[lang] = make(map[string]*Translation)
	}
	for _, tr := range translations {
		i.translations[lang][tr.Key] = tr
	}
}

func (i *I18n) SetFallback(lang string) {
	i.fallback = lang
}
