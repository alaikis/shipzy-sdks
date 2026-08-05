# Shipzy Go SDK

[![Go Reference](https://pkg.go.dev/badge/github.com/alaikis/shipzy-sdks/go.svg)](https://pkg.go.dev/github.com/alaikis/shipzy-sdks/go)

Go client library for the [Shipzy](https://shipzy.com) API. Provides typed access to all Shipzy services — orders, ECMR, EPOD, tracking, addresses, finance, notifications, and more.

## Features

- **Client** — API key authentication with configurable HTTP client
- **OrderClient** — List, Get, Create, Update, Cancel orders
- **EcmrClient** — European Consignment Note operations
- **EpodClient** — Electronic Proof of Delivery operations (list, get, create, generate_from_order, update, generate_sign_url, deliver, fail, generate_pdf, verify, capture_proof)
- **AddressClient** — Address book management
- **ActivationClient** — Carrier activation workflows
- **AgeVerificationClient** — Age verification checks
- **PickupPointsClient** — Pickup point discovery and management
- **ProductClient** — Product catalog operations
- **FinanceClient** — Financial data and invoicing
- **NotificationClient** — Notification channel management
- **SupportTicketClient** — Support ticket operations

## Installation

```bash
go get github.com/alaikis/shipzy-sdks/go
```

## Quick Start

```go
package main

import (
    "fmt"
    zymeup "github.com/alaikis/shipzy-sdks/go"
)

func main() {
    client := zymeup.NewZymeupClient("your-api-key")

    orders, err := client.Order.List(nil)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println(orders)
}
```

## API Reference

### Client

```go
client := zymeup.NewZymeupClient("your-api-key")
```

All service clients are accessed through the top-level `ZymeupClient`:

| Field | Type | Description |
|-------|------|-------------|
| `client.Order` | `*OrderClient` | Order management (List, Get, Create, Update, Cancel) |
| `client.Ecmr` | `*EcmrClient` | European Consignment Note operations |
| `client.Epod` | `*EpodClient` | Electronic Proof of Delivery |
| `client.Address` | `*AddressClient` | Address book CRUD |
| `client.Activation` | `*ActivationClient` | Carrier activation workflows |
| `client.AgeVerification` | `*AgeVerificationClient` | Age verification checks |
| `client.PickupPoints` | `*PickupPointsClient` | Pickup point management |
| `client.Product` | `*ProductClient` | Product catalog |
| `client.Finance` | `*FinanceClient` | Financial data |
| `client.Notification` | `*NotificationClient` | Notifications |
| `client.SupportTicket` | `*SupportTicketClient` | Support tickets |

### Custom HTTP Client

```go
import (
    "net/http"
    "time"
    zymeup "github.com/alaikis/shipzy-sdks/go"
)

client := zymeup.NewClient("your-api-key",
    zymeup.WithHTTPClient(&http.Client{Timeout: 30 * time.Second}),
    zymeup.WithBaseURL("https://custom-api.example.com"),
)
```

### Order Operations

```go
// List orders
orders, err := client.Order.List(nil)

// Get order by ID
order, err := client.Order.Get("order-123")

// Create order
newOrder, err := client.Order.Create(&zymeup.OrderCreateRequest{
    // ... fields
})

// Update order
updated, err := client.Order.Update("order-123", &zymeup.OrderUpdateRequest{
    // ... fields
})

// Cancel order
err = client.Order.Cancel("order-123")
```

### EPOD Operations

```go
// List EPODs
epods, err := client.Epod.List(1, 25, "pending")

// Get EPOD detail
epod, err := client.Epod.Get("epod-123")

// Create EPOD
epod, err := client.Epod.Create(map[string]interface{}{"order_id": "ord-123"})

// Generate from order
epod, err := client.Epod.GenerateFromOrder("ord-123", map[string]interface{}{"delivery_mode": "carrier"})

// Generate signing URL
signURL, err := client.Epod.GenerateSignURL("epod-123")

// Mark as delivered
_, err = client.Epod.Deliver("epod-123", map[string]interface{}{
    "delivery_date": "2026-08-01",
    "remark":        "Left at front desk",
})

// Mark as failed
_, err = client.Epod.Fail("epod-123", map[string]interface{}{"remark": "Not home"})

// Generate PDF (async)
pdfData, err := client.Epod.GeneratePdf("epod-123")

// Verify signature
verified, err := client.Epod.Verify("epod-123")

// Capture delivery proof
proofData, err := client.Epod.CaptureProof("epod-123", map[string]interface{}{
    "signature_data": "...",
})
```

### ECMR Operations

```go
// List ECMRs
ecmrs, err := client.Ecmr.List(1, 25)

// Get ECMR detail
ecmr, err := client.Ecmr.Get("ecmr-123")

// Generate signing URL
signURL, err := client.Ecmr.Sign("ecmr-123")

// Generate PDF
pdfResult, err := client.Ecmr.Pdf("ecmr-123")
```

## License

MIT
