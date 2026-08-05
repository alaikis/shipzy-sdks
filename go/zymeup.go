package zymeup

// ZymeupClient is the main entry point for the Zymeup Go SDK v2.0.0
type ZymeupClient struct {
	Epod            *EpodClient
	Order           *OrderClient
	Ecmr            *EcmrClient
	Address         *AddressClient
	Activation      *ActivationClient
	AgeVerification *AgeVerificationClient
	PickupPoint     *PickupPointClient
	Product         *ProductClient
	Finance         *FinanceClient
	Notification    *NotificationClient
	SupportTicket   *SupportTicketClient
	Validation      *ValidationClient
}

// NewZymeupClient creates a new ZymeupClient with the given API key
func NewZymeupClient(apiKey string) *ZymeupClient {
	c := NewClient(apiKey)
	return &ZymeupClient{
		Epod:            NewEpodClient(c),
		Order:           NewOrderClient(c),
		Ecmr:            NewEcmrClient(c),
		Address:         NewAddressClient(c),
		Activation:      NewActivationClient(c),
		AgeVerification: NewAgeVerificationClient(c),
		PickupPoint:     NewPickupPointClient(c),
		Product:         NewProductClient(c),
		Finance:         NewFinanceClient(c),
		Notification:    NewNotificationClient(c),
		SupportTicket:   NewSupportTicketClient(c),
		Validation:      NewValidationClient(c),
	}
}
