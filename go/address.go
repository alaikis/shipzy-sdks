package zymeup

type AddressClient struct {
	client *Client
}

func NewAddressClient(c *Client) *AddressClient {
	return &AddressClient{client: c}
}

func (c *AddressClient) List(params map[string]interface{}) ([]map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/merchant/addresses/list", params)
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

func (c *AddressClient) Get(id string) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/merchant/addresses/list", map[string]interface{}{
		"id": id,
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

func (c *AddressClient) Create(data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/merchant/addresses/create", data)
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

func (c *AddressClient) Update(id string, data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/merchant/addresses/"+id+"/update", data)
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

func (c *AddressClient) Delete(id string) error {
	resp, err := c.client.doRequest("POST", "/api/v1/merchant/addresses/"+id+"/delete", nil)
	if err != nil {
		return err
	}
	return decodeResponse(resp, nil)
}

func (c *AddressClient) SetDefault(id string) error {
	resp, err := c.client.doRequest("POST", "/api/v1/merchant/addresses/"+id+"/set-default", nil)
	if err != nil {
		return err
	}
	return decodeResponse(resp, nil)
}
