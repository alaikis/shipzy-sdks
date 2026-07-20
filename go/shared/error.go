package shared

import "fmt"

type ShipzyError struct {
	Code    int
	Message string
	Details map[string]interface{}
}

func (e *ShipzyError) Error() string {
	return fmt.Sprintf("shipzy error %d: %s", e.Code, e.Message)
}

func NewShipzyError(code int, message string, details map[string]interface{}) *ShipzyError {
	return &ShipzyError{
		Code:    code,
		Message: message,
		Details: details,
	}
}
