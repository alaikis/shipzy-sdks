package zymeup

// ActivationClient handles carrier activation operations
type ActivationClient struct{}

func NewActivationClient() *ActivationClient {
	return &ActivationClient{}
}

func (c *ActivationClient) List() ([]map[string]interface{}, error) {
	return nil, nil
}

func (c *ActivationClient) Create(data map[string]interface{}) (map[string]interface{}, error) {
	return nil, nil
}

func (c *ActivationClient) Activate(id string, credentials map[string]interface{}) (map[string]interface{}, error) {
	return nil, nil
}

func (c *ActivationClient) Deactivate(id string) error {
	return nil
}
