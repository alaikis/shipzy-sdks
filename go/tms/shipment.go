package tms

import "context"

type ShipmentService interface {
	Create(ctx context.Context, req *ShipmentCreateRequest) (*Shipment, error)
	Get(ctx context.Context, id string) (*Shipment, error)
	List(ctx context.Context, filter *ShipmentFilter) (*ShipmentListResponse, error)
	Cancel(ctx context.Context, id string) error
	Track(ctx context.Context, trackingNo string) (*Tracking, error)
}
