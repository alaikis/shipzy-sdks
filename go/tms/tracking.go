package tms

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/alaikis/shipzy-sdks/go/shared"
)

// TrackingService provides tracking query operations.
type TrackingService interface {
	// Track queries tracking status for a given tracking number.
	// carrier can be empty (auto-detect) or a specific carrier code.
	Track(ctx context.Context, trackingNo string, carrier string) (*TrackingResult, error)

	// List fetches paginated tracking list for the authenticated tenant.
	List(ctx context.Context, filter *TrackingListFilter) (*TrackingListResponse, error)
}

// TrackingResult is the full tracking detail returned by the API.
type TrackingResult struct {
	TrackingNo        string          `json:"tracking_no"`
	Status            string          `json:"status"`
	CarrierName       string          `json:"carrier_name"`
	LatestEvent       string          `json:"latest_event,omitempty"`
	EstimatedDelivery string          `json:"estimated_delivery,omitempty"`
	ActualDelivery    string          `json:"actual_delivery,omitempty"`
	Origin            *AddressSummary `json:"origin,omitempty"`
	Destination       *AddressSummary `json:"destination,omitempty"`
	Events            []TrackingEvent `json:"events"`
}

// AddressSummary holds origin/destination location info.
type AddressSummary struct {
	FullName    string  `json:"full_name,omitempty"`
	City        string  `json:"city,omitempty"`
	CountryCode string  `json:"country_code,omitempty"`
	Latitude    float64 `json:"latitude,omitempty"`
	Longitude   float64 `json:"longitude,omitempty"`
}

// TrackingEvent represents a single tracking milestone.
type TrackingEvent struct {
	Remark    string         `json:"remark"`
	EventTime string         `json:"event_time"`
	EventType string         `json:"event_type"`
	Location  *EventLocation `json:"location,omitempty"`
}

// EventLocation holds GPS coordinates and label for a tracking event.
type EventLocation struct {
	Lat   float64  `json:"lat"`
	Lng   float64  `json:"lng"`
	Label string   `json:"label,omitempty"`
}

// TrackingListFilter holds query parameters for listing tracking records.
type TrackingListFilter struct {
	Page       int
	PageSize   int
	Status     string
	TrackingNo string
}

// TrackingListItem is a summary entry in a tracking list response.
type TrackingListItem struct {
	TrackingNo  string `json:"tracking_no"`
	Status      string `json:"status"`
	CarrierName string `json:"carrier_name"`
	LatestEvent string `json:"latest_event,omitempty"`
	UpdatedAt   string `json:"updated_at"`
}

// TrackingListResponse is the paginated list of tracking records.
type TrackingListResponse struct {
	Data     []TrackingListItem `json:"data"`
	Total    int                `json:"total"`
	Page     int                `json:"page"`
	PageSize int                `json:"page_size"`
}

// trackingServiceImpl implements TrackingService.
type trackingServiceImpl struct {
	client *shared.Client
	role   string
}

// NewTrackingService creates a new TrackingService.
func NewTrackingService(c *shared.Client, role string) TrackingService {
	return &trackingServiceImpl{client: c, role: role}
}

func (s *trackingServiceImpl) Track(ctx context.Context, trackingNo string, carrier string) (*TrackingResult, error) {
	u := fmt.Sprintf("/api/v1/tracking/%s", url.PathEscape(trackingNo))
	if carrier != "" {
		u += "?carrier=" + url.QueryEscape(carrier)
	}

	resp, err := s.client.Get(ctx, u)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, shared.NewShipzyError(resp.StatusCode, string(body), nil)
	}

	var apiResp struct {
		Code int            `json:"code"`
		Data TrackingResult `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("failed to decode tracking response: %w", err)
	}
	return &apiResp.Data, nil
}

func (s *trackingServiceImpl) List(ctx context.Context, filter *TrackingListFilter) (*TrackingListResponse, error) {
	basePath := "/api/v1/merchant/tracking/list"
	if s.role == "carrier" {
		basePath = "/api/v1/carrier/tracking/list"
	}

	params := url.Values{}
	if filter != nil {
		if filter.Page > 0 {
			params.Set("page", fmt.Sprintf("%d", filter.Page))
		}
		if filter.PageSize > 0 {
			params.Set("page_size", fmt.Sprintf("%d", filter.PageSize))
		}
		if filter.Status != "" {
			params.Set("status", filter.Status)
		}
		if filter.TrackingNo != "" {
			params.Set("tracking_no", filter.TrackingNo)
		}
	}

	path := basePath
	if len(params) > 0 {
		path += "?" + params.Encode()
	}

	resp, err := s.client.Get(ctx, path)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, shared.NewShipzyError(resp.StatusCode, string(body), nil)
	}

	var apiResp struct {
		Code int                  `json:"code"`
		Data TrackingListResponse `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("failed to decode tracking list response: %w", err)
	}
	return &apiResp.Data, nil
}