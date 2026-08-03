package zymeup

// OrderClient handles order operations
type OrderClient struct {
	db interface{}
}

func NewOrderClient(db interface{}) *OrderClient {
	return &OrderClient{db: db}
}

func (c *OrderClient) List(params map[string]interface{}) ([]map[string]interface{}, error) {
	// TODO: implement
	return nil, nil
}

func (c *OrderClient) Get(id string) (map[string]interface{}, error) {
	// TODO: implement
	return nil, nil
}

func (c *OrderClient) Create(data map[string]interface{}) (map[string]interface{}, error) {
	// TODO: implement
	return nil, nil
}

func (c *OrderClient) Update(id string, data map[string]interface{}) (map[string]interface{}, error) {
	// TODO: implement
	return nil, nil
}
