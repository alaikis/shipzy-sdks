package zymeup

type AgeVerificationClient struct {
	client *Client
}

func NewAgeVerificationClient(c *Client) *AgeVerificationClient {
	return &AgeVerificationClient{client: c}
}

func (c *AgeVerificationClient) Create(data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/age-verifications", data)
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

func (c *AgeVerificationClient) ListByParcel(parcelID string) ([]map[string]interface{}, error) {
	path := "/api/v1/age-verifications" + buildQueryString(map[string]interface{}{
		"parcel_id": parcelID,
	})
	resp, err := c.client.doRequest("GET", path, nil)
	if err != nil {
		return nil, err
	}
	var result struct {
		Code int                    `json:"code"`
		Data []map[string]interface{} `json:"data"`
	}
	if err := decodeResponse(resp, &result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (c *AgeVerificationClient) ListByOrder(orderID string) ([]map[string]interface{}, error) {
	path := "/api/v1/age-verifications" + buildQueryString(map[string]interface{}{
		"order_id": orderID,
	})
	resp, err := c.client.doRequest("GET", path, nil)
	if err != nil {
		return nil, err
	}
	var result struct {
		Code int                    `json:"code"`
		Data []map[string]interface{} `json:"data"`
	}
	if err := decodeResponse(resp, &result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (c *AgeVerificationClient) Verify(id string, method string, data map[string]interface{}) (map[string]interface{}, error) {
	payload := map[string]interface{}{
		"method": method,
	}
	if data != nil {
		for k, v := range data {
			payload[k] = v
		}
	}
	resp, err := c.client.doRequest("POST", "/api/v1/age-verifications/"+id+"/verify", payload)
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
