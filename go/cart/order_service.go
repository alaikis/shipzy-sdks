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

type OrderService interface {
	List(ctx context.Context, filter *OrderFilter) (*OrderListResponse, error)
	Get(ctx context.Context, id string) (*Order, error)
	Create(ctx context.Context, req *OrderCreateRequest) (*Order, error)
	Cancel(ctx context.Context, id string) error
}

type orderServiceImpl struct {
	client *shared.Client
}

func NewOrderService(c *shared.Client) OrderService {
	return &orderServiceImpl{client: c}
}

func (s *orderServiceImpl) List(ctx context.Context, filter *OrderFilter) (*OrderListResponse, error) {
	params := url.Values{}
	if filter != nil {
		if filter.Page > 0 {
			params.Set("page", fmt.Sprintf("%d", filter.Page))
		}
		if filter.PageSize > 0 {
			params.Set("page_size", fmt.Sprintf("%d", filter.PageSize))
		}
		if filter.Status != "" {
			params.Set("status", filter.Status)
		}
	}
	path := "/api/v1/order/list"
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
		Code int              `json:"code"`
		Data OrderListResponse `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("decode order list: %w", err)
	}
	return &apiResp.Data, nil
}

func (s *orderServiceImpl) Get(ctx context.Context, id string) (*Order, error) {
	resp, err := s.client.Get(ctx, "/api/v1/order/"+url.PathEscape(id))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, shared.NewShipzyError(resp.StatusCode, string(body), nil)
	}
	var apiResp struct {
		Code int   `json:"code"`
		Data Order `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("decode order: %w", err)
	}
	return &apiResp.Data, nil
}

func (s *orderServiceImpl) Create(ctx context.Context, req *OrderCreateRequest) (*Order, error) {
	resp, err := s.client.Post(ctx, "/api/v1/order/create", req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return nil, shared.NewShipzyError(resp.StatusCode, string(body), nil)
	}
	var apiResp struct {
		Code int   `json:"code"`
		Data Order `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("decode order create: %w", err)
	}
	return &apiResp.Data, nil
}

func (s *orderServiceImpl) Cancel(ctx context.Context, id string) error {
	resp, err := s.client.Post(ctx, "/api/v1/order/"+url.PathEscape(id)+"/cancel", nil)
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

type CheckoutService interface {
	CreateWithDocuments(ctx context.Context, req *CheckoutRequest) (*CheckoutResult, error)
}

type checkoutServiceImpl struct {
	client *shared.Client
}

func NewCheckoutService(c *shared.Client) CheckoutService {
	return &checkoutServiceImpl{client: c}
}

func (s *checkoutServiceImpl) CreateWithDocuments(ctx context.Context, req *CheckoutRequest) (*CheckoutResult, error) {
	payload := map[string]interface{}{
		"order": req,
		"auto_generate": req.AutoGenerate,
		"channels":      []string{},
	}
	if req.Channel != "" {
		payload["channels"] = []string{req.Channel}
	}
	resp, err := s.client.Post(ctx, "/api/v1/order/create-with-documents", payload)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, shared.NewShipzyError(resp.StatusCode, string(body), nil)
	}
	var apiResp struct {
		Code int            `json:"code"`
		Data CheckoutResult `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("decode checkout: %w", err)
	}
	return &apiResp.Data, nil
}