package zymeup

// EcmrClient handles ECMR operations
type EcmrClient struct {
	db interface{}
}

func NewEcmrClient() *EcmrClient {
	return &EcmrClient{}
}

func (c *EcmrClient) List(params map[string]interface{}) ([]map[string]interface{}, error) {
	return nil, nil
}

func (c *EcmrClient) Get(id string) (map[string]interface{}, error) {
	return nil, nil
}

func (c *EcmrClient) GenerateFromOrder(orderID string) (map[string]interface{}, error) {
	return nil, nil
}

func (c *EcmrClient) Sign(id string) (map[string]interface{}, error) {
	return nil, nil
}
