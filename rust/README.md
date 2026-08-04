# shipzy-sdk

Official Rust SDK for the [Shipzy](https://zymeup.com) logistics platform. Provides async API clients for merchants and carriers.

## Features

- **Async-first** — built on `tokio` and `reqwest`
- **Role-aware** — merchant and carrier authentication with `Bearer` token and carrier-code headers
- **Type-safe** — all request/response types use `serde` derives
- **Error handling** — typed `ShipzyError` enum with `thiserror`

### Client modules

| Client | Description |
|--------|-------------|
| `OrderClient` | List, get, create, update, cancel orders |
| `EcmrClient` | ECMR document operations |
| `MerchantAddressClient` | Merchant address book management |
| `ActivationClient` | Carrier/provider activation |
| `AgeVerificationClient` | Age verification events |
| `PickupPointClient` | Pickup point listing and details |
| `ProductClient` | Product catalog |
| `FinanceClient` | Invoice and finance operations |
| `SupportTicketClient` | Support ticket management |

## Installation

```sh
cargo add shipzy-sdk
```

Or add to `Cargo.toml`:

```toml
[dependencies]
shipzy-sdk = "2.0.0"
```

## Quick Start

```rust
use shipzy_sdk::{ShipzyClient, ShipzyConfig, UserRole};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = ShipzyConfig {
        token: Some("your-api-key".into()),
        role: UserRole::Merchant,
        ..Default::default()
    };

    let client = ShipzyClient::new(config)?;

    // List orders (page 1, 25 per page)
    let orders = client.order.list(1, 25, None).await?;
    println!("{:?}", orders);

    // Get a single order
    let order = client.order.get("order-id-123").await?;
    println!("{:?}", order);

    Ok(())
}
```

### Carrier role

```rust
use shipzy_sdk::{ShipzyClient, ShipzyConfig, UserRole};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = ShipzyConfig {
        token: Some("your-api-key".into()),
        role: UserRole::Carrier,
        carrier_code: Some("DPD".into()),
        ..Default::default()
    };

    let client = ShipzyClient::new(config)?;
    let ecmrs = client.ecmr.list(1, 25, None).await?;
    println!("{:?}", ecmrs);

    Ok(())
}
```

### Dynamic token update

```rust
client.update_token("new-api-key");
```

## API Reference

### `ShipzyClient`

| Method | Description |
|--------|-------------|
| `new(config: ShipzyConfig) -> Result<Self>` | Create a new client |
| `update_token(token: &str)` | Replace the auth token on all sub-clients |
| `is_merchant() -> bool` | Check if client is merchant role |
| `is_carrier() -> bool` | Check if client is carrier role |

### `ShipzyConfig`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `base_url` | `String` | `https://api.zymeup.com` | API base URL |
| `token` | `Option<String>` | `None` | Auth token |
| `timeout_seconds` | `u64` | `30` | Request timeout |
| `role` | `UserRole` | `Merchant` | Merchant or Carrier |
| `carrier_code` | `Option<String>` | `None` | Required for carrier role |

### `OrderClient`

| Method | Signature |
|--------|-----------|
| `list` | `async fn list(&self, page: i32, page_size: i32, status: Option<&str>) -> Result<PaginatedResponse<OrderListItem>>` |
| `get` | `async fn get(&self, id: &str) -> Result<serde_json::Value>` |
| `create` | `async fn create(&self, body: serde_json::Value) -> Result<serde_json::Value>` |
| `create_with_documents` | `async fn create_with_documents(&self, body: serde_json::Value) -> Result<serde_json::Value>` |
| `update` | `async fn update(&self, id: &str, body: serde_json::Value) -> Result<serde_json::Value>` |
| `cancel` | `async fn cancel(&self, id: &str) -> Result<serde_json::Value>` |

### Error types

```rust
pub enum ShipzyError {
    Http { status: u16, message: String },
    Auth,
    Reqwest(reqwest::Error),
    Json(serde_json::Error),
}
```

## License

MIT
