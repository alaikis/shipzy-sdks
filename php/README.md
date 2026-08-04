# Zymeup SDK for PHP

Official PHP SDK for the [Zymeup](https://zymeup.com) logistics platform.

## Features

- **ZymeupClient** — API key authentication, configurable base URL and timeout
- **OrderClient** — list, get, create, createWithDocuments, update, cancel orders
- **EpodClient** — list, get, generateSignUrl, deliver, fail electronic proof of delivery
- **EcmrClient** — list, get, create, generateFromOrder, sign, generate PDF for European Consignment Notes
- **AddressClient** — list, create, update, delete, setDefault merchant addresses
- **ActivationClient** — list, create, get, activate, deactivate carrier activations
- **AgeVerificationClient** — create, verify age checks
- **PickupPointClient** — list, search pickup points
- **ProductClient** — list, create, update products
- **FinanceClient** — invoices, subscription, cancelSubscription
- **NotificationClient** — send, list notifications
- **SupportTicketClient** — create, list, get, addMessage support tickets

## Requirements

- PHP >= 8.0
- ext-curl
- ext-json

## Installation

```bash
composer require zymeup/sdk
```

## Quick Start

```php
use Zymeup\SDK\ZymeupClient;

$client = new ZymeupClient('your-api-key');

// List orders
$orders = $client->order->list(['page' => 1, 'pageSize' => 20]);

// Get a single order
$order = $client->order->get('order-id-123');

// Create an order
$newOrder = $client->order->create([
    'sender_name' => 'Acme Corp',
    'receiver_name' => 'Widget Ltd',
    'goods_description' => 'Electronics',
    'quantity' => 10,
]);

// List EPODs
$epods = $client->epod->list(1, 25, 'delivered');

// Create an ECMR from an order
$ecmr = $client->ecmr->generateFromOrder('order-id-123');
```

## Custom Base URL

```php
$client = new ZymeupClient('your-api-key', 'https://api.zymeup.com', 60);
```

## API Reference

### ZymeupClient

| Property | Type | Description |
|----------|------|-------------|
| `$epod` | `EpodClient` | Electronic Proof of Delivery |
| `$order` | `OrderClient` | Order management |
| `$ecmr` | `EcmrClient` | European Consignment Note |
| `$address` | `AddressClient` | Merchant address book |
| `$activation` | `ActivationClient` | Carrier activation |
| `$ageVerification` | `AgeVerificationClient` | Age verification |
| `$pickupPoints` | `PickupPointClient` | Pickup point lookup |
| `$product` | `ProductClient` | Product catalog |
| `$finance` | `FinanceClient` | Invoices and subscriptions |
| `$notification` | `NotificationClient` | Notifications |
| `$supportTicket` | `SupportTicketClient` | Support tickets |

### OrderClient

| Method | Parameters | Description |
|--------|-----------|-------------|
| `list($params)` | `page`, `pageSize`, `status` | List orders with pagination |
| `get($id)` | Order ID | Get order by ID |
| `create($data)` | Order fields array | Create a new order |
| `createWithDocuments($data)` | Order + document fields | Create order with ECMR/EPOD |
| `update($id, $data)` | Order ID, update fields | Update an existing order |
| `cancel($id)` | Order ID | Cancel an order |

### EpodClient

| Method | Parameters | Description |
|--------|-----------|-------------|
| `list($page, $pageSize, $status)` | Page, page size, status filter | List EPODs |
| `get($id)` | EPOD ID | Get EPOD by ID |
| `generateSignUrl($id)` | EPOD ID | Generate signing URL |
| `deliver($id, $data)` | EPOD ID, delivery data | Mark EPOD as delivered |
| `fail($id, $data)` | EPOD ID, failure data | Mark EPOD as failed |

### EcmrClient

| Method | Parameters | Description |
|--------|-----------|-------------|
| `list($params)` | `page`, `pageSize` | List ECMRs |
| `get($id)` | ECMR ID | Get ECMR by ID |
| `create($data)` | ECMR fields | Create a new ECMR |
| `generateFromOrder($orderId)` | Order ID | Generate ECMR from existing order |
| `sign($id)` | ECMR ID | Sign an ECMR |
| `pdf($id)` | ECMR ID | Generate PDF for ECMR |

### AddressClient

| Method | Parameters | Description |
|--------|-----------|-------------|
| `list($params)` | Filter params | List addresses |
| `create($data)` | Address fields | Create a new address |
| `update($id, $data)` | Address ID, update fields | Update an address |
| `delete($id)` | Address ID | Delete an address |
| `setDefault($id)` | Address ID | Set address as default |

### ActivationClient

| Method | Parameters | Description |
|--------|-----------|-------------|
| `list()` | — | List carrier activations |
| `create($data)` | Activation fields | Create a new activation |
| `get($id)` | Activation ID | Get activation by ID |
| `activate($id, $credentials)` | Activation ID, credentials | Activate a carrier |
| `deactivate($id)` | Activation ID | Deactivate a carrier |

### AgeVerificationClient

| Method | Parameters | Description |
|--------|-----------|-------------|
| `create($data)` | Verification fields | Create age verification request |
| `verify($id, $method, $data)` | Request ID, method, data | Submit verification |

### PickupPointClient

| Method | Parameters | Description |
|--------|-----------|-------------|
| `list($params)` | Filter params | List pickup points |
| `search($params)` | Search criteria | Search pickup points |

### ProductClient

| Method | Parameters | Description |
|--------|-----------|-------------|
| `list($params)` | `page`, `pageSize`, `status` | List products |
| `create($data)` | Product fields | Create a product |
| `update($id, $data)` | Product ID, update fields | Update a product |

### FinanceClient

| Method | Parameters | Description |
|--------|-----------|-------------|
| `invoices($params)` | Filter params | List invoices |
| `subscription()` | — | Get current subscription |
| `cancelSubscription()` | — | Cancel subscription |

### NotificationClient

| Method | Parameters | Description |
|--------|-----------|-------------|
| `send($data)` | Notification fields | Send a notification |
| `list($params)` | Filter params | List notifications |

### SupportTicketClient

| Method | Parameters | Description |
|--------|-----------|-------------|
| `create($data)` | Ticket fields | Create a support ticket |
| `list($params)` | Filter params | List tickets |
| `get($id)` | Ticket ID | Get ticket by ID |
| `addMessage($id, $content)` | Ticket ID, message content | Add a message to ticket |

## License

MIT
