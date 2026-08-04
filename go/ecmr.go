package zymeup

type EcmrClient struct {
	client *Client
}

func NewEcmrClient(c *Client) *EcmrClient {
	return &EcmrClient{client: c}
}

func (c *EcmrClient) List(params map[string]interface{}) ([]map[string]interface{}, error) {
	path := "/api/v1/shipment/ecmr/list" + buildQueryString(params)
	resp, err := c.client.doRequest("GET", path, nil)
	if err != nil {
		return nil, err
	}
	var result struct {
		Code int `json:"code"`
		Data struct {
			Items []map[string]interface{} `json:"items"`
			Total int                      `json:"total"`
		} `json:"data"`
	}
	if err := decodeResponse(resp, &result); err != nil {
		return nil, err
	}
	return result.Data.Items, nil
}

func (c *EcmrClient) Get(id string) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("GET", "/api/v1/shipment/ecmr/"+id, nil)
	if err != nil {
		return nil, err
	}
	var result struct {
		Code int                    `json:"code"`
		Data map[string]interface{} `json:"data"`
	}
	if err := decodeResponse(resp, &result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (c *EcmrClient) Create(data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/shipment/ecmr/create", data)
	if err != nil {
		return nil, err
	}
	var result struct {
		Code int                    `json:"code"`
		Data map[string]interface{} `json:"data"`
	}
	if err := decodeResponse(resp, &result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (c *EcmrClient) GenerateFromOrder(orderID string) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/shipment/ecmr/generate-from-order", map[string]interface{}{
		"order_id": orderID,
	})
	if err != nil {
		return nil, err
	}
	var result struct {
		Code int                    `json:"code"`
		Data map[string]interface{} `json:"data"`
	}
	if err := decodeResponse(resp, &result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (c *EcmrClient) Sign(id string) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/shipment/ecmr/"+id+"/sign", nil)
	if err != nil {
		return nil, err
	}
	var result struct {
		Code int                    `json:"code"`
		Data map[string]interface{} `json:"data"`
	}
	if err := decodeResponse(resp, &result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (c *EcmrClient) Pdf(id string) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/shipment/ecmr/"+id+"/pdf", nil)
	if err != nil {
		return nil, err
	}
	var result struct {
		Code int                    `json:"code"`
		Data map[string]interface{} `json:"data"`
	}
	if err := decodeResponse(resp, &result); err != nil {
		return nil, err
	}
	return result.Data, nil
}
