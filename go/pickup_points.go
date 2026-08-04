package zymeup

type PickupPointClient struct {
	client *Client
}

func NewPickupPointClient(c *Client) *PickupPointClient {
	return &PickupPointClient{client: c}
}

func (c *PickupPointClient) List(params map[string]interface{}) ([]map[string]interface{}, error) {
	path := "/api/v1/admin/pickup-points/" + buildQueryString(params)
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

func (c *PickupPointClient) Get(id string) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("GET", "/api/v1/admin/pickup-points/"+id, nil)
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

func (c *PickupPointClient) Create(data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/admin/pickup-points/", data)
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

func (c *PickupPointClient) Update(id string, data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("PUT", "/api/v1/admin/pickup-points/"+id, data)
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

func (c *PickupPointClient) Deactivate(id string) error {
	resp, err := c.client.doRequest("POST", "/api/v1/admin/pickup-points/"+id+"/deactivate", nil)
	if err != nil {
		return err
	}
	return decodeResponse(resp, nil)
}

func (c *PickupPointClient) Search(params map[string]interface{}) ([]map[string]interface{}, error) {
	path := "/api/v1/admin/pickup-points/" + buildQueryString(params)
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
