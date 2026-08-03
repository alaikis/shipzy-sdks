package zymeup

// AgeVerificationClient handles age verification operations
type AgeVerificationClient struct{}

func NewAgeVerificationClient() *AgeVerificationClient {
	return &AgeVerificationClient{}
}

func (c *AgeVerificationClient) Create(data map[string]interface{}) (map[string]interface{}, error) {
	return nil, nil
}

func (c *AgeVerificationClient) Verify(id string, method string, data map[string]interface{}) (map[string]interface{}, error) {
	return nil, nil
}
