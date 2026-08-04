package zymeup

import "net/http"

type FinanceClient struct {
	client *Client
}

func NewFinanceClient(c *Client) *FinanceClient {
	return &FinanceClient{client: c}
}

func (c *FinanceClient) Invoices(params map[string]interface{}) ([]map[string]interface{}, error) {
	path := "/api/finance/invoices" + buildQueryString(params)
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

func (c *FinanceClient) ListSubscriptions() ([]map[string]interface{}, error) {
	resp, err := c.client.doRequest("GET", "/api/finance/subscriptions", nil)
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

func (c *FinanceClient) CancelSubscription(id string) error {
	resp, err := c.client.doRequest("POST", "/api/finance/subscriptions/"+id+"/cancel", nil)
	if err != nil {
		return err
	}
	return decodeResponse(resp, nil)
}

func (c *FinanceClient) RestoreSubscription(id string) error {
	resp, err := c.client.doRequest("POST", "/api/finance/subscriptions/"+id+"/restore", nil)
	if err != nil {
		return err
	}
	return decodeResponse(resp, nil)
}

func (c *FinanceClient) DownloadInvoice(id string) ([]byte, error) {
	resp, err := c.client.doRequest("GET", "/api/v1/merchant/invoices/"+id+"/download", nil)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		return nil, &APIError{StatusCode: resp.StatusCode, Message: "failed to download invoice"}
	}
	return readAll(resp)
}

func readAll(resp *http.Response) ([]byte, error) {
	defer resp.Body.Close()
	buf := make([]byte, 0, 64*1024)
	for {
		n, err := resp.Body.Read(buf[len(buf):cap(buf)])
		buf = buf[:len(buf)+n]
		if err != nil {
			if err.Error() == "EOF" {
				return buf, nil
			}
			return nil, err
		}
		if len(buf) == cap(buf) {
			buf = append(buf, 0)[:len(buf)]
		}
	}
}
