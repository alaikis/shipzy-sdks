package zymeup

// AddressClient handles address book operations
type AddressClient struct {
	db interface{}
}

func NewAddressClient() *AddressClient {
	return &AddressClient{}
}

func (c *AddressClient) List(params map[string]interface{}) ([]map[string]interface{}, error) {
	return nil, nil
}

func (c *AddressClient) Create(data map[string]interface{}) (map[string]interface{}, error) {
	return nil, nil
}

func (c *AddressClient) Update(id string, data map[string]interface{}) (map[string]interface{}, error) {
	return nil, nil
}

func (c *AddressClient) Delete(id string) error {
	return nil
}
