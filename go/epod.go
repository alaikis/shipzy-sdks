package zymeup

import (
	"encoding/json"
	"fmt"
	"net/url"
)

type EpodClient struct {
	client *Client
}

func NewEpodClient(c *Client) *EpodClient {
	return &EpodClient{client: c}
}

type EpodListItem struct {
	ID          string `json:"id"`
	TrackingNo  string `json:"tracking_no"`
	Status      string `json:"status"`
	RecipientName string `json:"recipient_name,omitempty"`
	CreatedAt   string `json:"created_at"`
}

type EpodListResponse struct {
	Data       []EpodListItem `json:"data"`
	Total      int            `json:"total"`
	Page       int            `json:"page"`
	PageSize   int            `json:"page_size"`
}

type EpodDetail struct {
	ID             string `json:"id"`
	TrackingNo     string `json:"tracking_no"`
	Status         string `json:"status"`
	RecipientName  string `json:"recipient_name,omitempty"`
	SignURL        string `json:"sign_url,omitempty"`
	EvidenceHash   string `json:"evidence_hash,omitempty"`
	SignatureData  string `json:"signature_data,omitempty"`
	PhotoURL       string `json:"photo_url,omitempty"`
	ProofType      string `json:"proof_type,omitempty"`
	CreatedAt      string `json:"created_at"`
	UpdatedAt      string `json:"updated_at"`
}

type SignURLResponse struct {
	SignURL string `json:"sign_url"`
}

func (e *EpodClient) List(page, pageSize int, status string) (*EpodListResponse, error) {
	params := url.Values{}
	if page > 0 {
		params.Set("page", fmt.Sprintf("%d", page))
	}
	if pageSize > 0 {
		params.Set("page_size", fmt.Sprintf("%d", pageSize))
	}
	if status != "" {
		params.Set("status", status)
	}
	path := "/api/v1/shipment/epod/list?" + params.Encode()
	resp, err := e.client.doRequest("GET", path, nil)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result struct {
		Code int             `json:"code"`
		Data EpodListResponse `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result.Data, nil
}

func (e *EpodClient) Get(id string) (*EpodDetail, error) {
	resp, err := e.client.doRequest("GET", "/api/v1/shipment/epod/"+id, nil)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result struct {
		Code int        `json:"code"`
		Data EpodDetail `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result.Data, nil
}

func (e *EpodClient) GenerateSignURL(id string) (*SignURLResponse, error) {
	resp, err := e.client.doRequest("POST", "/api/v1/shipment/epod/"+id+"/sign", nil)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result struct {
		Code int            `json:"code"`
		Data SignURLResponse `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result.Data, nil
}
