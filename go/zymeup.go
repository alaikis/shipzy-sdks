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
}

// NewZymeupClient creates a new ZymeupClient with the given API key
func NewZymeupClient(apiKey string) *ZymeupClient {
	c := NewClient(apiKey)
	return &ZymeupClient{
		Epod:            NewEpodClient(c),
		Order:           NewOrderClient(nil),
		Ecmr:            NewEcmrClient(),
		Address:         NewAddressClient(),
		Activation:      NewActivationClient(),
		AgeVerification: NewAgeVerificationClient(),
		PickupPoint:     NewPickupPointClient(),
		Product:         NewProductClient(),
		Finance:         NewFinanceClient(),
		Notification:    NewNotificationClient(),
		SupportTicket:   NewSupportTicketClient(),
	}
}
