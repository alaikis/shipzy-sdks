package zymeup

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"
)

const (
	Version   = "2.0.0"
	BaseURL   = "https://api.zymeup.com"
	UserAgent = "zymeup-sdk-go/" + Version
)

type Client struct {
	BaseURL    string
	APIKey     string
	HTTPClient *http.Client
}

type APIError struct {
	StatusCode int
	Message    string
	Err        string
}

func (e *APIError) Error() string {
	if e.Err != "" {
		return fmt.Sprintf("API error %d: %s", e.StatusCode, e.Err)
	}
	return fmt.Sprintf("API error %d: %s", e.StatusCode, e.Message)
}

func NewClient(apiKey string) *Client {
	return &Client{
		BaseURL: BaseURL,
		APIKey:  apiKey,
		HTTPClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

func (c *Client) doRequest(method, path string, body interface{}) (*http.Response, error) {
	var bodyReader io.Reader
	if body != nil {
		jsonBytes, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("marshal request body: %w", err)
		}
		bodyReader = bytes.NewReader(jsonBytes)
	}

	u := c.BaseURL + path
	req, err := http.NewRequest(method, u, bodyReader)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+c.APIKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", UserAgent)
	return c.HTTPClient.Do(req)
}

func decodeResponse(resp *http.Response, result interface{}) error {
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		bodyBytes, _ := io.ReadAll(resp.Body)
		var errResp struct {
			Error   string `json:"error"`
			Message string `json:"message"`
		}
		if err := json.Unmarshal(bodyBytes, &errResp); err == nil {
			msg := errResp.Error
			if msg == "" {
				msg = errResp.Message
			}
			return &APIError{StatusCode: resp.StatusCode, Message: msg, Err: msg}
		}
		return &APIError{StatusCode: resp.StatusCode, Message: string(bodyBytes)}
	}
	if result != nil {
		if err := json.NewDecoder(resp.Body).Decode(result); err != nil {
			return fmt.Errorf("decode response: %w", err)
		}
	}
	return nil
}

func buildQueryString(params map[string]interface{}) string {
	if len(params) == 0 {
		return ""
	}
	q := url.Values{}
	for k, v := range params {
		switch val := v.(type) {
		case string:
			if val != "" {
				q.Set(k, val)
			}
		case int:
			q.Set(k, fmt.Sprintf("%d", val))
		case float64:
			q.Set(k, fmt.Sprintf("%g", val))
		case bool:
			if val {
				q.Set(k, "true")
			}
		}
	}
	encoded := q.Encode()
	if encoded == "" {
		return ""
	}
	return "?" + encoded
}
