package shared

import (
	"context"
	"net/http"
)

type AuthProvider interface {
	Apply(ctx context.Context, req *http.Request) error
}

type APIKeyAuth struct {
	Key string
}

func (a *APIKeyAuth) Apply(ctx context.Context, req *http.Request) error {
	req.Header.Set("Authorization", "Bearer "+a.Key)
	return nil
}

type OAuth2Auth struct {
	ClientID     string
	ClientSecret string
	TokenURL     string
}

func (o *OAuth2Auth) Apply(ctx context.Context, req *http.Request) error {
	return nil
}

type CarrierAuth struct {
	Code string
	Key  string
}

func (c *CarrierAuth) Apply(ctx context.Context, req *http.Request) error {
	req.SetBasicAuth(c.Code, c.Key)
	return nil
}
