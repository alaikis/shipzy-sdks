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
		Code int             `json:"code"`
		Data SignURLResponse `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result.Data, nil
}

func (e *EpodClient) GeneratePdf(id string) (map[string]interface{}, error) {
	resp, err := e.client.doRequest("POST", "/api/v1/shipment/epod/"+id+"/pdf", nil)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result struct {
		Code int                    `json:"code"`
		Data map[string]interface{} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (e *EpodClient) Verify(id string) (bool, error) {
	resp, err := e.client.doRequest("POST", "/api/v1/shipment/epod/"+id+"/verify", nil)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()
	var result struct {
		Code int  `json:"code"`
		Data struct {
			Verified bool `json:"verified"`
		} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return false, err
	}
	return result.Data.Verified, nil
}

func (e *EpodClient) CaptureProof(id string, data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := e.client.doRequest("POST", "/api/v1/shipment/epod/"+id+"/capture-proof", data)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result struct {
		Code int                    `json:"code"`
		Data map[string]interface{} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (e *EpodClient) Create(data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := e.client.doRequest("POST", "/api/v1/shipment/epod/create", data)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result struct {
		Code int                    `json:"code"`
		Data map[string]interface{} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (e *EpodClient) GenerateFromOrder(orderID string, options map[string]interface{}) (map[string]interface{}, error) {
	body := map[string]interface{}{"order_id": orderID}
	for k, v := range options {
		body[k] = v
	}
	resp, err := e.client.doRequest("POST", "/api/v1/shipment/epod/generate-from-order", body)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result struct {
		Code int                    `json:"code"`
		Data map[string]interface{} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (e *EpodClient) Update(id string, data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := e.client.doRequest("PUT", "/api/v1/shipment/epod/"+id+"/update", data)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result struct {
		Code int                    `json:"code"`
		Data map[string]interface{} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (e *EpodClient) Deliver(id string, data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := e.client.doRequest("POST", "/api/v1/shipment/epod/"+id+"/delivery", data)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result struct {
		Code int                    `json:"code"`
		Data map[string]interface{} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (e *EpodClient) Fail(id string, data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := e.client.doRequest("POST", "/api/v1/shipment/epod/"+id+"/fail", data)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result struct {
		Code int                    `json:"code"`
		Data map[string]interface{} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return result.Data, nil
}
