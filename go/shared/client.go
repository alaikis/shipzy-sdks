package shared

import (
	"context"
	"net/http"
	"time"
)

type Client struct {
	baseURL    string
	auth       AuthProvider
	httpClient *http.Client
	language   string
}

func NewClient(cfg *Config, auth AuthProvider) *Client {
	return &Client{
		baseURL: cfg.BaseURL,
		auth:    auth,
		httpClient: &http.Client{
			Timeout: time.Duration(cfg.Timeout) * time.Second,
		},
		language: cfg.Language,
	}
}

func (c *Client) Do(ctx context.Context, req *http.Request) (*http.Response, error) {
	if err := c.auth.Apply(ctx, req); err != nil {
		return nil, err
	}
	if c.language != "" {
		req.Header.Set("Accept-Language", c.language)
	}
	return c.httpClient.Do(req.WithContext(ctx))
}

func (c *Client) Get(ctx context.Context, path string) (*http.Response, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", c.baseURL+path, nil)
	if err != nil {
		return nil, err
	}
	return c.Do(ctx, req)
}

func (c *Client) Post(ctx context.Context, path string, body interface{}) (*http.Response, error) {
	// TODO: implement JSON body encoding
	req, err := http.NewRequestWithContext(ctx, "POST", c.baseURL+path, nil)
	if err != nil {
		return nil, err
	}
	return c.Do(ctx, req)
}
