# Zymeup Python SDK

Official Python SDK for the [Zymeup](https://api.zymeup.com) logistics platform. Manage orders, ECMR documents, EPOD, addresses, activations, and more.

## Features

- **ZymeupClient** — Unified entry point with API key authentication and configurable base URL
- **OrderClient** — List, get, create, create with documents, update, and cancel orders
- **EcmrClient** — Manage European Consignment Notes (create, sign, generate PDF, derive from orders)
- **EpodClient** — Manage Electronic Proof of Delivery (list, get, generate_sign_url, deliver, fail, generate_pdf, verify, capture_proof, upload_photo)
- **MerchantAddressClient** — Address book CRUD with default address management
- **ActivationClient** — Provider marketplace: list providers, activate, pause, resume, revoke
- **AgeVerificationClient** — Create and query age verification events by parcel or order
- **PickupPointClient** — Pickup point CRUD and deactivation
- **ProductClient** — Product catalog management (list, get, create, update, retire)
- **FinanceClient** — Invoices and subscription management
- **SupportTicketClient** — Support ticket creation and messaging
- **NotificationClient** — Delivery mode and notification channel constants with validation

## Installation

```bash
pip install zymeup-sdk
```

Requires Python 3.10+.

## Quick Start

```python
from zymeup_sdk import ZymeupClient

client = ZymeupClient(api_key="your-api-key")

# List orders
orders = client.order.list(page=1, page_size=20)

# Get a single order
order = client.order.get("order-123")

# Create an order
new_order = client.order.create({
    "sender_address_id": "addr-1",
    "receiver_address_id": "addr-2",
    "goods_description": "Electronics",
    "quantity": 5,
    "weight": 12.5,
})

# Create order with ECMR and EPOD documents
result = client.order.create_with_documents({
    "order": {
        "sender_address_id": "addr-1",
        "receiver_address_id": "addr-2",
        "goods_description": "Furniture",
    },
    "generate_ecmr": True,
    "generate_epod": True,
    "notification_channels": ["email"],
})

# Generate ECMR from order
ecmr = client.ecmr.generate_from_order("order-123")

# Mark EPOD as delivered
client.epod.deliver("epod-456", {"recipient_name": "John Doe"})

# List pickup points
points = client.pickup_points.list()
```

## API Reference

### ZymeupClient

```python
from zymeup_sdk import ZymeupClient

client = ZymeupClient(api_key="your-api-key", base_url="https://api.zymeup.com", timeout=30)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `api_key` | `str` | required | Your Zymeup API key |
| `base_url` | `str` | `https://api.zymeup.com` | API base URL |
| `timeout` | `int` | `30` | Request timeout in seconds |

All sub-clients are accessed as attributes: `client.order`, `client.ecmr`, `client.epod`, etc.

### OrderClient

| Method | Signature | Description |
|--------|-----------|-------------|
| `list` | `(page=1, page_size=25, status=None)` | List orders with optional status filter |
| `get` | `(order_id)` | Get order detail |
| `create` | `(data)` | Create a new order |
| `create_with_documents` | `(data)` | Create order with ECMR/EPOD documents |
| `update` | `(order_id, data)` | Update an order |
| `cancel` | `(order_id)` | Cancel an order |

### EcmrClient

| Method | Signature | Description |
|--------|-----------|-------------|
| `list` | `(page=1, page_size=25)` | List ECMR records |
| `get` | `(ecmr_id)` | Get ECMR detail |
| `create` | `(data)` | Create an ECMR |
| `generate_from_order` | `(order_id)` | Generate ECMR from an existing order |
| `sign` | `(ecmr_id)` | Generate signing URL |
| `pdf` | `(ecmr_id)` | Generate PDF |

### EpodClient

| Method | Signature | Description |
|--------|-----------|-------------|
| `list` | `(page=1, page_size=25, status=None)` | List EPOD records |
| `get` | `(epod_id)` | Get EPOD detail |
| `generate_sign_url` | `(epod_id)` | Generate signing URL |
| `deliver` | `(epod_id, data=None)` | Mark as delivered |
| `fail` | `(epod_id, data=None)` | Mark as failed |
| `generate_pdf` | `(epod_id)` | Generate PDF (async) |
| `verify` | `(epod_id)` | Verify signature |
| `capture_proof` | `(epod_id, data)` | Capture delivery proof |
| `upload_photo` | `(epod_id, file)` | Upload photo (multipart) |

### MerchantAddressClient

| Method | Signature | Description |
|--------|-----------|-------------|
| `list` | `(page=1, page_size=25, role_tag=None)` | List merchant addresses |
| `create` | `(data)` | Create a new address |
| `update` | `(address_id, data)` | Update an address |
| `delete` | `(address_id)` | Delete an address |
| `set_default` | `(address_id, address_type)` | Set default (sender/return/contact/warehouse) |

### ActivationClient

| Method | Signature | Description |
|--------|-----------|-------------|
| `list_providers` | `(capability=None)` | List available providers |
| `get_provider` | `(slug)` | Get provider detail |
| `list` | `()` | List merchant's activations |
| `get` | `(activation_id)` | Get activation detail |
| `activate` | `(data)` | Activate a provider |
| `pause` | `(activation_id)` | Pause an activation |
| `resume` | `(activation_id)` | Resume an activation |
| `revoke` | `(activation_id, reason=None)` | Revoke an activation |

### AgeVerificationClient

| Method | Signature | Description |
|--------|-----------|-------------|
| `create` | `(data)` | Create an age verification event |
| `list_by_parcel` | `(parcel_id)` | List verifications by parcel |
| `list_by_order` | `(order_id)` | List verifications by order |

### PickupPointClient

| Method | Signature | Description |
|--------|-----------|-------------|
| `list` | `(active_only=True)` | List pickup points |
| `get` | `(pickup_point_id)` | Get pickup point detail |
| `create` | `(data)` | Create a new pickup point |
| `update` | `(pickup_point_id, data)` | Update a pickup point |
| `deactivate` | `(pickup_point_id)` | Deactivate a pickup point |

### ProductClient

| Method | Signature | Description |
|--------|-----------|-------------|
| `list` | `(status=None, category=None, search=None, active_only=False)` | List products |
| `get` | `(product_id)` | Get product detail |
| `create` | `(data)` | Create a new product |
| `update` | `(product_id, data)` | Update a product |
| `retire` | `(product_id)` | Retire (deactivate) a product |

### FinanceClient

| Method | Signature | Description |
|--------|-----------|-------------|
| `get_invoices` | `()` | List invoices |
| `list_subscriptions` | `()` | List subscriptions |
| `cancel_subscription` | `(subscription_id)` | Cancel a subscription |
| `restore_subscription` | `(subscription_id)` | Restore a cancelled subscription |
| `download_invoice` | `(invoice_id)` | Download an invoice |

### SupportTicketClient

| Method | Signature | Description |
|--------|-----------|-------------|
| `create` | `(data)` | Create a support ticket |
| `list` | `(status=None)` | List support tickets |
| `get` | `(ticket_id)` | Get ticket detail |
| `add_message` | `(ticket_id, data)` | Add a message to a ticket |

### NotificationClient

The notification module provides constants and validation helpers, not a class client.

```python
from zymeup_sdk import DELIVERY_MODES, NOTIFICATION_CHANNELS, validate_channel_requirements

# Available delivery modes
# [{"key": "carrier", ...}, {"key": "self-delivery", ...}, {"key": "self-pickup", ...}]

# Available notification channels
# [{"key": "email", "requires": "email", ...}, {"key": "sms", "requires": "phone", ...}, ...]

# Validate channel requirements
missing = validate_channel_requirements(
    channels=["email", "sms"],
    recipient={"email": "user@example.com", "phone": None}
)
# missing == ["phone"]
```

## License

MIT
