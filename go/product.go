package zymeup

type ProductClient struct {
	client *Client
}

func NewProductClient(c *Client) *ProductClient {
	return &ProductClient{client: c}
}

func (c *ProductClient) List(params map[string]interface{}) ([]map[string]interface{}, error) {
	path := "/api/v1/products" + buildQueryString(params)
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

func (c *ProductClient) Get(id string) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("GET", "/api/v1/products/"+id, nil)
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

func (c *ProductClient) Create(data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/products", data)
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

func (c *ProductClient) Update(id string, data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("PUT", "/api/v1/products/"+id, data)
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

func (c *ProductClient) Retire(id string) error {
	resp, err := c.client.doRequest("POST", "/api/v1/products/"+id+"/retire", nil)
	if err != nil {
		return err
	}
	return decodeResponse(resp, nil)
}
