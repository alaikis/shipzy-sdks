package shared

type Config struct {
	BaseURL    string
	Timeout    int
	RetryCount int
	Language   string
}

type Option func(*Config)

func WithBaseURL(url string) Option {
	return func(c *Config) {
		c.BaseURL = url
	}
}

func WithTimeout(seconds int) Option {
	return func(c *Config) {
		c.Timeout = seconds
	}
}

func WithRetry(count int) Option {
	return func(c *Config) {
		c.RetryCount = count
	}
}

func WithLanguage(lang string) Option {
	return func(c *Config) {
		c.Language = lang
	}
}

func NewConfig(opts ...Option) *Config {
	cfg := &Config{
		BaseURL:    "https://api.shipzy.me/api/v1",
		Timeout:    30,
		RetryCount: 3,
		Language:   "en",
	}
	for _, opt := range opts {
		opt(cfg)
	}
	return cfg
}
