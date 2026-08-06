package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/alaikis/shipzy-sdks/go/cart"
	"github.com/alaikis/shipzy-sdks/go/shared"
	"github.com/alaikis/shipzy-sdks/go/tms"
)

func main() {
	apiKey := os.Getenv("ZYMEUP_API_KEY")
	if apiKey == "" {
		apiKey = "your-api-key"
	}

	cfg := shared.NewConfig(
		shared.WithBaseURL("https://api.zymeup.com"),
		shared.WithTimeout(30),
	)
	auth := &shared.APIKeyAuth{Key: apiKey}
	client := shared.NewClient(cfg, auth)
	ctx := context.Background()

	// 1. List products
	productSvc := cart.NewProductService(client)
	products, err := productSvc.List(ctx, &cart.ProductFilter{Page: 1, PageSize: 10})
	if err != nil {
		log.Printf("list products: %v", err)
	} else {
		fmt.Printf("Products: %d total\n", products.Total)
	}

	// 2. Create order
	orderSvc := cart.NewOrderService(client)
	order, err := orderSvc.Create(ctx, &cart.OrderCreateRequest{
		OrderNo:       "DEMO-" + fmt.Sprintf("%d", 1000),
		CustomerName:  "Demo User",
		CustomerEmail: "demo@example.com",
		Currency:      "EUR",
		Items: []cart.OrderItem{
			{Name: "Widget", Quantity: 1, UnitPrice: 29.99, ProductType: "physical"},
		},
	})
	if err != nil {
		log.Printf("create order: %v", err)
	} else {
		fmt.Printf("Order created: %s\n", order.ID)
	}

	// 3. Track shipment
	trackingSvc := tms.NewTrackingService(client, "merchant")
	tracking, err := trackingSvc.Track(ctx, "TRK123456789", "")
	if err != nil {
		log.Printf("track: %v (expected if tracking number is invalid)", err)
	} else {
		fmt.Printf("Tracking: %s - %s\n", tracking.TrackingNo, tracking.Status)
	}

	// 4. List carriers
	carrierSvc := tms.NewCarrierService(client)
	carriers, err := carrierSvc.List(ctx, &tms.CarrierFilter{Page: 1, PageSize: 20})
	if err != nil {
		log.Printf("list carriers: %v", err)
	} else {
		fmt.Printf("Carriers: %d total\n", carriers.Total)
	}
}