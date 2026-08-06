package cart

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/alaikis/shipzy-sdks/go/shared"
)

type productServiceImpl struct {
	client *shared.Client
}

func NewProductService(c *shared.Client) ProductService {
	return &productServiceImpl{client: c}
}

func (s *productServiceImpl) List(ctx context.Context, filter *ProductFilter) (*ProductListResponse, error) {
	params := url.Values{}
	if filter != nil {
		if filter.Page > 0 {
			params.Set("page", fmt.Sprintf("%d", filter.Page))
		}
		if filter.PageSize > 0 {
			params.Set("page_size", fmt.Sprintf("%d", filter.PageSize))
		}
		if filter.Category != "" {
			params.Set("category", filter.Category)
		}
		if filter.Search != "" {
			params.Set("search", filter.Search)
		}
		if filter.Status != "" {
			params.Set("status", filter.Status)
		}
	}
	path := "/api/v1/products/"
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
		Data ProductListResponse `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("decode product list: %w", err)
	}
	return &apiResp.Data, nil
}

func (s *productServiceImpl) Get(ctx context.Context, id string) (*Product, error) {
	resp, err := s.client.Get(ctx, "/api/v1/products/"+url.PathEscape(id))
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
		Data Product `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("decode product: %w", err)
	}
	return &apiResp.Data, nil
}

func (s *productServiceImpl) Create(ctx context.Context, req *ProductCreateRequest) (*Product, error) {
	resp, err := s.client.Post(ctx, "/api/v1/products/", req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return nil, shared.NewShipzyError(resp.StatusCode, string(body), nil)
	}
	var apiResp struct {
		Code int     `json:"code"`
		Data Product `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("decode product create: %w", err)
	}
	return &apiResp.Data, nil
}

func (s *productServiceImpl) Update(ctx context.Context, id string, updates map[string]interface{}) (*Product, error) {
	resp, err := s.client.Put(ctx, "/api/v1/products/"+url.PathEscape(id)+"/update", updates)
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
		Data Product `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("decode product update: %w", err)
	}
	return &apiResp.Data, nil
}

func (s *productServiceImpl) Retire(ctx context.Context, id string) error {
	resp, err := s.client.Post(ctx, "/api/v1/products/"+url.PathEscape(id)+"/retire", nil)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return shared.NewShipzyError(resp.StatusCode, string(body), nil)
	}
	return nil
}