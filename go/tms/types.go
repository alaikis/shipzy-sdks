package tms

import "github.com/alaikis/shipzy-sdks/go/shared"

type Shipment struct {
	ID              string
	TrackingNo      string
	Status          string
	Sender          *shared.Address
	Receiver        *shared.Address
	Packages        []Package
	Carrier         *Carrier
	CreatedAt       string
	UpdatedAt       string
}

type Package struct {
	ID       string
	Weight   float64
	Length   float64
	Width    float64
	Height   float64
}

type Tracking struct {
	TrackingNo       string
	Status           string
	Milestones       []Milestone
	EstimatedDelivery string
	ActualDelivery   string
}

type Milestone struct {
	Status    string
	Location  string
	Timestamp string
	Note      string
}

type Carrier struct {
	Code        string
	Name        string
	Services    []Service
	TrackingURL string
}

type Service struct {
	Code        string
	Name        string
	Description string
}

type ShipmentFilter struct {
	Status      string
	CarrierCode string
	Page        int
	PageSize    int
}

type ShipmentListResponse struct {
	Items    []*Shipment
	Total    int
	Page     int
	PageSize int
}

type ShipmentCreateRequest struct {
	TrackingNo string
	Sender     *shared.Address
	Receiver   *shared.Address
	Packages   []Package
	CarrierCode string
}
