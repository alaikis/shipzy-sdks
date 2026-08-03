package zymeup

// PickupPointClient handles pickup point operations
type PickupPointClient struct{}

func NewPickupPointClient() *PickupPointClient {
	return &PickupPointClient{}
}

func (c *PickupPointClient) List(params map[string]interface{}) ([]map[string]interface{}, error) {
	return nil, nil
}

func (c *PickupPointClient) Search(params map[string]interface{}) ([]map[string]interface{}, error) {
	return nil, nil
}
