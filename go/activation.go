package zymeup

type ActivationClient struct {
	client *Client
}

func NewActivationClient(c *Client) *ActivationClient {
	return &ActivationClient{client: c}
}

func (c *ActivationClient) ListProviders(params map[string]interface{}) ([]map[string]interface{}, error) {
	path := "/api/v1/marketplace/providers" + buildQueryString(params)
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

func (c *ActivationClient) GetProvider(slug string) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("GET", "/api/v1/marketplace/providers/"+slug, nil)
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

func (c *ActivationClient) List() ([]map[string]interface{}, error) {
	resp, err := c.client.doRequest("GET", "/api/v1/marketplace/activations", nil)
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

func (c *ActivationClient) Get(id string) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("GET", "/api/v1/marketplace/activations/"+id, nil)
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

func (c *ActivationClient) Activate(data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/marketplace/activations", data)
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

func (c *ActivationClient) Pause(id string) error {
	resp, err := c.client.doRequest("POST", "/api/v1/marketplace/activations/"+id+"/pause", nil)
	if err != nil {
		return err
	}
	return decodeResponse(resp, nil)
}

func (c *ActivationClient) Resume(id string) error {
	resp, err := c.client.doRequest("POST", "/api/v1/marketplace/activations/"+id+"/resume", nil)
	if err != nil {
		return err
	}
	return decodeResponse(resp, nil)
}

func (c *ActivationClient) Revoke(id string) error {
	resp, err := c.client.doRequest("POST", "/api/v1/marketplace/activations/"+id+"/revoke", nil)
	if err != nil {
		return err
	}
	return decodeResponse(resp, nil)
}
