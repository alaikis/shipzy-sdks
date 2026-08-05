package zymeup

type ValidationClient struct {
	client *Client
}

func NewValidationClient(c *Client) *ValidationClient {
	return &ValidationClient{client: c}
}

type PhoneVerifyResult struct {
	Valid        bool   `json:"valid"`
	Formatted    string `json:"formatted"`
	CountryCode  string `json:"country_code"`
}

type PhoneFormatResult struct {
	Formatted string `json:"formatted"`
}

type PostalCodeResult struct {
	Valid   bool   `json:"valid"`
	Message string `json:"message"`
	Source  string `json:"source"`
}

type EmailValidationResult struct {
	Valid     bool   `json:"valid"`
	Status    string `json:"status"`
	Message   string `json:"message"`
	Source    string `json:"source"`
	Formatted string `json:"formatted"`
}

type TaxIdValidationResult struct {
	Valid   bool   `json:"valid"`
	Message string `json:"message"`
	Source  string `json:"source"`
}

func (c *ValidationClient) VerifyPhone(countryCode, phone string) (*PhoneVerifyResult, error) {
	path := "/api/v1/validation/phone"
	resp, err := c.client.doRequest("POST", path, map[string]interface{}{
		"country_code": countryCode,
		"phone":        phone,
	})
	if err != nil {
		return nil, err
	}
	var result struct {
		Code int                  `json:"code"`
		Data *PhoneVerifyResult  `json:"data"`
	}
	if err := decodeResponse(resp, &result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (c *ValidationClient) FormatPhone(countryCode, phone string) (*PhoneFormatResult, error) {
	path := "/api/v1/validation/phone/format"
	resp, err := c.client.doRequest("POST", path, map[string]interface{}{
		"country_code": countryCode,
		"phone":        phone,
	})
	if err != nil {
		return nil, err
	}
	var result struct {
		Code int                    `json:"code"`
		Data *PhoneFormatResult    `json:"data"`
	}
	if err := decodeResponse(resp, &result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (c *ValidationClient) ValidatePostalCode(countryCode, code string) (*PostalCodeResult, error) {
	path := "/api/v1/validation/postal-code"
	resp, err := c.client.doRequest("POST", path, map[string]interface{}{
		"country_code": countryCode,
		"code":         code,
	})
	if err != nil {
		return nil, err
	}
	var result struct {
		Code int                    `json:"code"`
		Data *PostalCodeResult     `json:"data"`
	}
	if err := decodeResponse(resp, &result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (c *ValidationClient) ValidateEmail(email string) (*EmailValidationResult, error) {
	path := "/api/v1/validation/email"
	resp, err := c.client.doRequest("POST", path, map[string]interface{}{
		"email": email,
	})
	if err != nil {
		return nil, err
	}
	var result struct {
		Code int                        `json:"code"`
		Data *EmailValidationResult    `json:"data"`
	}
	if err := decodeResponse(resp, &result); err != nil {
		return nil, err
	}
	return result.Data, nil
}

func (c *ValidationClient) ValidateTaxId(countryCode, taxId string) (*TaxIdValidationResult, error) {
	path := "/api/v1/validation/tax-id"
	resp, err := c.client.doRequest("POST", path, map[string]interface{}{
		"country_code": countryCode,
		"tax_id":       taxId,
	})
	if err != nil {
		return nil, err
	}
	var result struct {
		Code int                      `json:"code"`
		Data *TaxIdValidationResult  `json:"data"`
	}
	if err := decodeResponse(resp, &result); err != nil {
		return nil, err
	}
	return result.Data, nil
}
