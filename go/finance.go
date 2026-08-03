package zymeup

// FinanceClient handles finance operations
type FinanceClient struct{}

func NewFinanceClient() *FinanceClient {
	return &FinanceClient{}
}

func (c *FinanceClient) Invoices(params map[string]interface{}) ([]map[string]interface{}, error) {
	return nil, nil
}

func (c *FinanceClient) Subscription() (map[string]interface{}, error) {
	return nil, nil
}
