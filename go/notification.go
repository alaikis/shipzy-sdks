package zymeup

type NotificationClient struct {
	client *Client
}

func NewNotificationClient(c *Client) *NotificationClient {
	return &NotificationClient{client: c}
}

func (c *NotificationClient) Send(data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/notifications/send", data)
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

func (c *NotificationClient) List(params map[string]interface{}) ([]map[string]interface{}, error) {
	path := "/api/v1/notifications/list" + buildQueryString(params)
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

func (c *NotificationClient) Get(id string) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("GET", "/api/v1/notifications/"+id, nil)
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

func (c *NotificationClient) MarkRead(id string) error {
	resp, err := c.client.doRequest("POST", "/api/v1/notifications/"+id+"/read", nil)
	if err != nil {
		return err
	}
	return decodeResponse(resp, nil)
}
