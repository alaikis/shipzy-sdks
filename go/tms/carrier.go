package tms

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/alaikis/shipzy-sdks/go/shared"
)

type CarrierService interface {
	List(ctx context.Context, filter *CarrierFilter) (*CarrierListResponse, error)
	Get(ctx context.Context, code string) (*Carrier, error)
}

type CarrierFilter struct {
	Page     int
	PageSize int
	Active   bool
}

type CarrierListResponse struct {
	Data     []Carrier `json:"data"`
	Total    int       `json:"total"`
	Page     int       `json:"page"`
	PageSize int       `json:"page_size"`
}

type carrierServiceImpl struct {
	client *shared.Client
}

func NewCarrierService(c *shared.Client) CarrierService {
	return &carrierServiceImpl{client: c}
}

func (s *carrierServiceImpl) List(ctx context.Context, filter *CarrierFilter) (*CarrierListResponse, error) {
	params := url.Values{}
	if filter != nil {
		if filter.Page > 0 {
			params.Set("page", fmt.Sprintf("%d", filter.Page))
		}
		if filter.PageSize > 0 {
			params.Set("page_size", fmt.Sprintf("%d", filter.PageSize))
		}
	}
	path := "/api/v1/carrier/list"
	if len(params) > 0 {
		path += "?" + params.Encode()
	}
	resp, err := s.client.Get(ctx, path)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, shared.NewShipzyError(resp.StatusCode, string(body), nil)
	}
	var apiResp struct {
		Code int                `json:"code"`
		Data CarrierListResponse `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("decode carrier list: %w", err)
	}
	return &apiResp.Data, nil
}

func (s *carrierServiceImpl) Get(ctx context.Context, code string) (*Carrier, error) {
	resp, err := s.client.Get(ctx, "/api/v1/carrier/"+url.PathEscape(code))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, shared.NewShipzyError(resp.StatusCode, string(body), nil)
	}
	var apiResp struct {
		Code int     `json:"code"`
		Data Carrier `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("decode carrier: %w", err)
	}
	return &apiResp.Data, nil
}