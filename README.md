# Shipzy SDK

Official multi-language SDK for the [Shipzy](https://shipzy.me) logistics platform.

**Current version:** `2.0.1`

## Install

| Language | Package | Install |
|----------|---------|---------|
| Node.js / TypeScript | [`@zymeup/sdk`](https://www.npmjs.com/package/@zymeup/sdk) | `npm i @zymeup/sdk@2.0.1` |
| PHP | [`alaikas/zymeup-sdk`](https://packagist.org/packages/alaikas/zymeup-sdk) | `composer require alaikas/zymeup-sdk:^2.0.1` |
| Go | [`github.com/alaikis/shipzy-sdks/go`](https://pkg.go.dev/github.com/alaikis/shipzy-sdks/go) | `go get github.com/alaikis/shipzy-sdks/go@v2.0.1` |
| Python | [`zymeup-sdk`](https://pypi.org/project/zymeup-sdk/) | `pip install zymeup-sdk==2.0.1` |
| Rust | [`shipzy-sdk`](https://crates.io/crates/shipzy-sdk) | `cargo add shipzy-sdk@2.0.1` |
| Ruby | [`shipzy-sdk`](https://rubygems.org/gems/shipzy-sdk) | `gem install shipzy-sdk -v 2.0.1` |
| .NET | [`Shipzy.Sdk`](https://www.nuget.org/packages/Shipzy.Sdk) | `dotnet add package Shipzy.Sdk --version 2.0.1` |
| Swift | [`ShipzySDK`](https://swiftpackageindex.com/alaikis/shipzy-sdks) | Package.swift dependency |

## Structure

| Directory | Language | Description |
|-----------|----------|-------------|
| `node/` | TypeScript | Core SDK + Web Components (`epod-elements/`) |
| `php/` | PHP 8.0+ | PSR-4 autoloading, cURL HTTP client |
| `go/` | Go | Module with typed clients |
| `python/` | Python 3.10+ | pip-installable package |
| `rust/` | Rust | async/await with reqwest |
| `ruby/` | Ruby 3.0+ | Net::HTTP based client |
| `dotnet/` | .NET 8+ | HttpClient based client |
| `swift/` | Swift 5.9+ | URLSession based client |
| `java/` | Java | Early stage |
| `kotlin/` | Kotlin | Early stage |
| `zig/` | Zig | Early stage |
| `epod-elements/` | TypeScript | Web Components for EPOD workflows |

## Features

| Feature | Node | PHP | Go | Python | Rust | Ruby | .NET | Swift |
|---------|:----:|:---:|:--:|:------:|:----:|:----:|:----:|:-----:|
| Order Management | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| EPOD (Electronic Proof of Delivery) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ECMR (Electronic Consignment Note) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tracking | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Address Book | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pickup Points | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Activation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Age Verification | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Finance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Notification | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Support Ticket | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Compliance | ✅ | ✅ | — | — | — | — | — | — |
| CPSC | ✅ | ✅ | — | — | — | — | — | — |
| Web Components | ✅ | — | — | — | — | — | — | — |

## Quick Start

### Node.js

```typescript
import { ShipzyClient } from '@zymeup/sdk';

const client = new ShipzyClient({ apiKey: 'your-api-key', role: 'merchant' });
const orders = await client.order.list({ page: 1, pageSize: 20 });
const epod = await client.epod.get('epod-id-123');
```

### PHP

```php
use Zymeup\SDK\ZymeupClient;

$client = new ZymeupClient('your-api-key');
$orders = $client->order->list(['page' => 1, 'page_size' => 20]);
$epod = $client->epod->get('epod-id-123');
```

### Go

```go
client := zymeup.NewClient("your-api-key")
orders, _ := client.Order.List(nil)
epod, _ := client.Epod.Get("epod-id-123")
```

### Python

```python
from zymeup_sdk import ZymeupClient

client = ZymeupClient(api_key="your-api-key")
orders = client.order.list(page=1, page_size=20)
epod = client.epod.get("epod-id-123")
```

## Web Components

Browser-native Custom Elements for EPOD workflows. No framework required.

```html
<script type="module" src="https://unpkg.com/@zymeup/sdk/epod-elements"></script>
<shipzy-epod-list token="your-api-key" base-url="https://api.zymeup.com"></shipzy-epod-list>
```

Available elements: `<shipzy-epod-list>`, `<shipzy-epod-detail>`, `<shipzy-epod-create>`, `<shipzy-epod-signature>`, `<shipzy-tracking-list>`, `<shipzy-tracking-detail>`

## API Reference

All SDKs expose the same interface through `ShipzyClient`:

| Property | Description |
|----------|-------------|
| `order` | Order CRUD |
| `epod` | EPOD management (merchant) |
| `ecmr` | ECMR management |
| `tracking` | Tracking subscriptions and events |
| `address` | Address book |
| `merchantAddress` | Multi-tenant address book |
| `pickupPoints` | Pickup point CRUD |
| `activation` | Carrier activation and marketplace |
| `ageVerification` | Age verification requests |
| `product` | Product catalog |
| `finance` | Invoices and subscriptions |
| `notification` | Email, SMS, WhatsApp notifications |
| `supportTicket` | Ticket management |
| `shipment` | Shipment management |
| `parcel` | Parcel management |
| `compliance` | Customs and compliance |
| `carrier` | Carrier configuration |
| `carrierEpod` | EPOD management (carrier) |
| `carrierAddress` | Carrier address book |
| `platformConfig` | Platform configuration |
| `upload` | File uploads |
| `publicEpod` | Public EPOD signing (no auth) |
| `cpsc` | CPSC compliance (US) |

## Role-Based Access

```typescript
// Merchant
const merchant = new ShipzyClient({ apiKey: '...', role: 'merchant' });

// Carrier
const carrier = new ShipzyClient({ apiKey: '...', role: 'carrier', carrierCode: 'UPS' });
```

## License

MIT
