# Shipzy.Sdk

Official .NET SDK for the [Shipzy](https://api.zymeup.com) logistics platform. Provides strongly-typed clients for Orders, EPOD, ECMR, Tracking, Carrier management, and more.

## Features

- **ShipzyClient** — unified entry point with API key authentication
- **OrderClient** — list, get, create, update, cancel orders
- **EcmrClient** — list, get, create, generate from order, sign, export PDF
- **EpodClient** — list, get, create, update, delivery, fail, sign capture, upload photo
- **TrackingClient** — public tracking detail, merchant/carrier tracking list
- **CarrierClient** — carrier registration and management
- **CarrierAddressClient** — carrier address book CRUD
- **CarrierEpodClient** — carrier-side EPOD operations
- **ProductClient** — product catalog management
- **FinanceClient** — financial data and invoices
- **NotificationClient** — send notifications (email, SMS, webhook)
- **SupportTicketClient** — create and manage support tickets
- **PlatformConfigClient** — platform configuration queries

## Installation

```bash
dotnet add package Shipzy.Sdk
```

## Quick Start

```csharp
using Shipzy.Sdk;
using Shipzy.Sdk.Models;

var client = new ShipzyClient(new ShipzyConfig
{
    Token = "your-api-key"
});

// List orders
var result = await client.Order.ListAsync(page: 1, pageSize: 10);
foreach (var order in result.Data.Items)
{
    Console.WriteLine($"Order {order.Id}: {order.Status}");
}

// Get a single order
var orderResult = await client.Order.GetAsync("order-id");

// Create an order
var created = await client.Order.CreateAsync(new
{
    goods_description = "Electronics",
    quantity = 5,
    weight = 12.5
});

// Cancel an order
var cancelled = await client.Order.CancelAsync("order-id");
```

### Carrier Auth

For carrier-scoped requests, set the role and carrier code:

```csharp
var client = new ShipzyClient(new ShipzyConfig
{
    Token = "your-api-key",
    Role = UserRole.Carrier,
    CarrierCode = "DPD"
});
```

## API Reference

### ShipzyClient

```csharp
var client = new ShipzyClient(config);
```

| Property | Type | Description |
|----------|------|-------------|
| `Order` | `OrderClient` | Order CRUD |
| `Ecmr` | `EcmrClient` | European CMR consignment notes |
| `Epod` | `EpodClient` | Electronic proof of delivery |
| `Tracking` | `TrackingClient` | Shipment tracking |
| `Carrier` | `CarrierClient` | Carrier management |
| `CarrierAddress` | `CarrierAddressClient` | Carrier address book |
| `CarrierEpod` | `CarrierEpodClient` | Carrier-side EPOD |
| `Product` | `ProductClient` | Product catalog |
| `Finance` | `FinanceClient` | Financials |
| `Notification` | `NotificationClient` | Notifications |
| `SupportTicket` | `SupportTicketClient` | Support tickets |
| `PlatformConfig` | `PlatformConfigClient` | Platform config |
| `MerchantAddress` | `MerchantAddressClient` | Merchant address book |
| `PickupPoints` | `PickupPointClient` | Pickup points |
| `AgeVerification` | `AgeVerificationClient` | Age verification |
| `Activation` | `ActivationClient` | Carrier activation |

| Method | Description |
|--------|-------------|
| `UpdateToken(string token)` | Rotate the auth token at runtime |

### ShipzyConfig

```csharp
var config = new ShipzyConfig
{
    BaseUrl = "https://api.zymeup.com",  // default
    Token = "your-api-key",
    TimeoutSeconds = 30,                  // default
    Role = UserRole.Merchant,             // or UserRole.Carrier
    CarrierCode = null                    // required when Role = Carrier
};
```

### OrderClient

| Method | HTTP | Endpoint |
|--------|------|----------|
| `ListAsync(page, pageSize, status)` | GET | `/api/v1/order/list` |
| `GetAsync(id)` | GET | `/api/v1/order/{id}` |
| `CreateAsync(data)` | POST | `/api/v1/order/create` |
| `CreateWithDocumentsAsync(data)` | POST | `/api/v1/order/create-with-documents` |
| `UpdateAsync(id, data)` | POST | `/api/v1/order/{id}/update` |
| `CancelAsync(id)` | POST | `/api/v1/order/{id}/cancel` |

### EcmrClient

| Method | HTTP | Endpoint |
|--------|------|----------|
| `ListAsync(page, pageSize)` | GET | `/api/v1/shipment/ecmr/list` |
| `GetAsync(id)` | GET | `/api/v1/shipment/ecmr/{id}` |
| `CreateAsync(data)` | POST | `/api/v1/shipment/ecmr/create` |
| `GenerateFromOrderAsync(orderId)` | POST | `/api/v1/shipment/ecmr/generate-from-order` |
| `SignAsync(id)` | POST | `/api/v1/shipment/ecmr/{id}/sign` |
| `PdfAsync(id)` | POST | `/api/v1/shipment/ecmr/{id}/pdf` |

### TrackingClient

| Method | HTTP | Endpoint |
|--------|------|----------|
| `DetailAsync(trackingNo)` | GET | `/api/v1/tracking/{trackingNo}` |
| `ListAsync(page, pageSize, status, trackingNo)` | GET | `/api/v1/merchant/tracking/list` or `/api/v1/carrier/tracking/list` |

### EpodClient

| Method | HTTP | Endpoint |
|--------|------|----------|
| `ListAsync(page, pageSize)` | GET | `/api/v1/shipment/epod/list` |
| `GetAsync(id)` | GET | `/api/v1/shipment/epod/{id}` |
| `CreateAsync(data)` | POST | `/api/v1/shipment/epod/create` |
| `UpdateAsync(id, data)` | POST | `/api/v1/shipment/epod/{id}/update` |
| `DeliveryAsync(id)` | POST | `/api/v1/shipment/epod/{id}/delivery` |
| `FailAsync(id, data)` | POST | `/api/v1/shipment/epod/{id}/fail` |
| `SignCaptureAsync(id)` | POST | `/api/v1/shipment/epod/{id}/sign-capture` |
| `UploadPhotoAsync(id, data)` | POST | `/api/v1/shipment/epod/{id}/upload-photo` |

## Error Handling

The SDK throws typed exceptions for error scenarios:

```csharp
try
{
    var result = await client.Order.GetAsync("nonexistent");
}
catch (ShipzyAuthException ex)
{
    Console.WriteLine("Authentication failed");
}
catch (ShipzyException ex)
{
    Console.WriteLine($"API error {ex.StatusCode}: {ex.Message}");
}
```

| Exception | Description |
|-----------|-------------|
| `ShipzyException` | Base exception with `StatusCode` property |
| `ShipzyAuthException` | HTTP 401 Unauthorized |

## License

MIT
