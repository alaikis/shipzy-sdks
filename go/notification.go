package zymeup

// NotificationClient handles notification operations
type NotificationClient struct{}

func NewNotificationClient() *NotificationClient {
	return &NotificationClient{}
}

func (c *NotificationClient) Send(data map[string]interface{}) (map[string]interface{}, error) {
	return nil, nil
}

func (c *NotificationClient) List(params map[string]interface{}) ([]map[string]interface{}, error) {
	return nil, nil
}
