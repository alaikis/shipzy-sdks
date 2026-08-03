package zymeup

// ProductClient handles product operations
type ProductClient struct{}

func NewProductClient() *ProductClient {
	return &ProductClient{}
}

func (c *ProductClient) List(params map[string]interface{}) ([]map[string]interface{}, error) {
	return nil, nil
}

func (c *ProductClient) Create(data map[string]interface{}) (map[string]interface{}, error) {
	return nil, nil
}

func (c *ProductClient) Update(id string, data map[string]interface{}) (map[string]interface{}, error) {
	return nil, nil
}
