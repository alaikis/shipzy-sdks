package zymeup

type SupportTicketClient struct {
	client *Client
}

func NewSupportTicketClient(c *Client) *SupportTicketClient {
	return &SupportTicketClient{client: c}
}

func (c *SupportTicketClient) Create(data map[string]interface{}) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/support/tickets", data)
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

func (c *SupportTicketClient) List(params map[string]interface{}) ([]map[string]interface{}, error) {
	path := "/api/v1/support/tickets" + buildQueryString(params)
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

func (c *SupportTicketClient) Get(id string) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("GET", "/api/v1/support/tickets/"+id, nil)
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

func (c *SupportTicketClient) AddMessage(id string, content string) (map[string]interface{}, error) {
	resp, err := c.client.doRequest("POST", "/api/v1/support/tickets/"+id+"/messages", map[string]interface{}{
		"content": content,
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
