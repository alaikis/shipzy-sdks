# ShipzySDK for Swift

A Swift client library for the [Shipzy](https://shipzy.me) API. Provides typed, async/await access to all Shipzy platform resources including orders, ECMR, EPOD, products, finance, and more.

## Features

- **Async/await** throughout — built on Swift Concurrency
- **Strongly typed** models for all API resources
- **Role-based** — supports `merchant` and `carrier` roles
- **Modular clients** — one client per resource domain, composed through `ShipzyClient`
- **Zero dependencies** — uses only Foundation

| Client | Description |
|--------|-------------|
| `OrderClient` | List, get, create, update, and cancel orders |
| `EcmrClient` | ECMR documents — list, get, create, generate from order, update, sign, PDF |
| `EpodClient` | Electronic proof of delivery — list, get, create, deliver, fail, capture proof, sign, PDF |
| `MerchantAddressClient` | Address book — list, get, create, update, delete, set default |
| `ActivationClient` | Marketplace providers and activation lifecycle |
| `AgeVerificationClient` | Age verification events for parcels/orders |
| `PickupPointClient` | Pickup point management |
| `ProductClient` | Product catalog — list, get, create, update, retire |
| `FinanceClient` | Invoices and subscriptions |
| `NotificationClient` | Send notifications via multiple channels |
| `SupportTicketClient` | Support tickets — CRUD, close, add comments |

## Requirements

- Swift 5.9+
- iOS 15+ / macOS 12+

## Installation

### Swift Package Manager

Add `ShipzySDK` as a dependency in your `Package.swift`:

```swift
// swift-tools-version:5.9
import PackageDescription

let package = Package(
    dependencies: [
        .package(url: "https://github.com/shipzy/shipzy-sdks.git", from: "2.0.0"),
    ],
    targets: [
        .target(
            name: "YourTarget",
            dependencies: ["ShipzySDK"]
        ),
    ]
)
```

Alternatively, in Xcode go to **File > Add Package Dependencies** and enter the repository URL.

## Quick Start

```swift
import ShipzySDK

// Initialize with an API key
let client = ShipzyClient(
    config: ShipzyConfig(
        token: "your-api-key"
    )
)

// List orders
let orders = try await client.order.list(page: 1, pageSize: 20)
for order in orders.data {
    print("\(order.orderNo) — \(order.status)")
}

// Get a single order
let detail = try await client.order.get("order-id-123")
print(detail.customerName ?? "Unknown")

// Create an order
let newOrder = try await client.order.create([
    "customer_name": "Acme Corp",
    "total_amount": 250.00,
    "currency": "EUR"
])

// Cancel an order
let cancelled = try await client.cancel("order-id-123")
```

## Configuration

`ShipzyConfig` accepts the following parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `baseUrl` | `String` | `"https://api.shipzy.me"` | API base URL |
| `token` | `String?` | `nil` | API key / auth token |
| `timeout` | `TimeInterval` | `30` | Request timeout in seconds |
| `role` | `UserRole` | `.merchant` | `.merchant` or `.carrier` |
| `carrierCode` | `String?` | `nil` | Carrier code (carrier role only) |

### Updating the token

```swift
client.updateToken("new-api-key")
```

### Role-based usage

```swift
// Carrier configuration
let carrierClient = ShipzyClient(
    config: ShipzyConfig(
        token: "carrier-api-key",
        role: .carrier,
        carrierCode: "DPD"
    )
)

if carrierClient.isCarrier() {
    // Carrier-specific logic
}
```

## API Reference

### OrderClient

```swift
// List with filters
let orders = try await client.order.list(page: 1, pageSize: 20, status: "active")

// Get by ID
let order = try await client.order.get("id")

// Create
let created = try await client.order.create(["customer_name": "Acme Corp"])

// Create with auto-generated documents (ECMR/EPOD)
let withDocs = try await client.order.createWithDocuments(["customer_name": "Acme Corp"])

// Update
let updated = try await client.order.update("id", ["notes": "Updated notes"])

// Cancel
let cancelled = try await client.order.cancel("id")
```

### EcmrClient

```swift
let ecmrs = try await client.ecmr.list(page: 1, status: "draft")
let ecmr = try await client.ecmr.get("id")
let created = try await client.ecmr.create(["goods_description": "Electronics"])

// Generate from existing order
let fromOrder = try await client.ecmr.generateFromOrder("order-id")

// Sign and get PDF
let signResponse = try await client.ecmr.sign("id")
let pdf = try await client.ecmr.pdf("id")
```

### EpodClient

```swift
let epods = try await client.epod.list(page: 1, trackingNo: "TRACK123")
let epod = try await client.epod.get("id")

// Generate from order
let fromOrder = try await client.epod.generateFromOrder("order-id")

// Delivery workflow
let delivered = try await client.epod.deliver("id", data: ["recipient_name": "John"])
let failed = try await client.epod.fail("id", remark: "No answer")

// Capture proof and sign
let proof = try await client.epod.captureProof("id", ["photo_url": "..."])
let signUrl = try await client.epod.generateSignUrl("id")
```

### MerchantAddressClient

```swift
let addresses = try await client.merchantAddress.list()
let created = try await client.merchantAddress.create([
    "full_name": "John Doe",
    "street": "123 Main St",
    "city": "Amsterdam",
    "country_code": "NL"
])
letsetDefault = try await client.merchantAddress.setDefault("id")
```

### ProductClient

```swift
let products = try await client.product.list(category: "electronics", activeOnly: true)
let product = try await client.product.get("id")
let created = try await client.product.create(["name": "Widget", "sku": "WDG-001"])
let retired = try await client.product.retire("id")
```

### FinanceClient

```swift
let invoices = try await client.finance.getInvoices()
let subscriptions = try await client.finance.listSubscriptions()
let cancelled = try await client.finance.cancelSubscription("sub-id")
```

### NotificationClient

```swift
let result = try await client.notification.sendToChannels(
    channels: ["email", "sms"],
    recipient: ["email": "user@example.com", "phone": "+31612345678"],
    template: "order_confirmation",
    templateData: ["order_no": "ORD-001"]
)

let history = try await client.notification.list(page: 1, channel: "email")
```

### ActivationClient

```swift
let providers = try await client.activation.listProviders(capability: "tracking")
let activations = try await client.activation.list()
let activated = try await client.activation.activate(["provider_slug": "dpd"])
let paused = try await client.activation.pause("activation-id")
let revoked = try await client.activation.revoke("activation-id", reason: "No longer needed")
```

### AgeVerificationClient

```swift
let event = try await client.ageVerification.create([
    "parcel_id": "P-001",
    "method": "id_scan",
    "pass": true,
    "min_age_required": 18
])
let byParcel = try await client.ageVerification.listByParcel(parcelId: "P-001")
```

### PickupPointClient

```swift
let points = try await client.pickupPoints.list(activeOnly: true)
let created = try await client.pickupPoints.create([
    "name": "Downtown Locker",
    "type": "locker",
    "country_code": "NL"
])
```

### SupportTicketClient

```swift
let tickets = try await client.supportTicket.list(status: "open", priority: "high")
let ticket = try await client.supportTicket.get("id")
let created = try await client.supportTicket.create([
    "subject": "Delivery issue",
    "description": "Package not received",
    "priority": "high"
])
let comment = try await client.supportTicket.addComment("id", content: "Following up")
let closed = try await client.supportTicket.close("id")
```

## Error Handling

The SDK throws typed errors:

```swift
do {
    let order = try await client.order.get("nonexistent")
} catch let error as ShipzyError {
    print("API error \(error.statusCode): \(error.message)")
} catch let error as ShipzyAuthError {
    print("Authentication failed: \(error.message)")
} catch {
    print("Unexpected error: \(error)")
}
```

## License

MIT License. See [LICENSE](../LICENSE) for details.
