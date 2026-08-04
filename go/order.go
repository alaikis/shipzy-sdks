package zymeup

type OrderClient struct {
	client *Client
}

func NewOrderClient(c *Client) *OrderClient {
	return &OrderClient{client: c}
}

func (c *OrderClient) List(params map[string]interface{}) ([]map[string]interface{}, error) {
	path := "/api/v1/order/list" + buildQueryString(params)
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

func (c *OrderClient) Get(id string) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("GET", "/api/v1/order/"+id, nil)
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

func (c *OrderClient) Create(data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/order/create", data)
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

func (c *OrderClient) Update(id string, data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/order/"+id+"/update", data)
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

func (c *OrderClient) Cancel(id string) error {
	resp, err := c.client.doRequest("POST", "/api/v1/order/"+id+"/cancel", nil)
	if err != nil {
		return err
	}
	return decodeResponse(resp, nil)
}

func (c *OrderClient) CreateWithDocuments(data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/order/create-with-documents", data)
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
