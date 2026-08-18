# Shipzy SDK for Ruby

Official Ruby SDK for the [Shipzy](https://shipzy.me) logistics platform. Manage orders, EPOD, ECMR, addresses, products, and more via the Shipzy API.

## Features

- **Order Management** - List, create, update, and cancel orders
- **EPOD (Electronic Proof of Delivery)** - Create, deliver, fail, sign, and generate PDFs
- **ECMR (European Consignment Note)** - Create, sign, and generate PDFs from orders
- **Address Book** - CRUD operations for merchant and carrier addresses
- **Carrier EPOD** - Carrier-side delivery, photo upload, and proof capture
- **Product Catalog** - List, create, update, and retire products
- **Activation** - Manage marketplace provider activations
- **Age Verification** - Create and query age verification records
- **Pickup Points** - List and manage pickup locations
- **Finance** - View invoices and manage subscriptions
- **Notifications** - Channel validation for email, SMS, WhatsApp
- **Support Tickets** - Create, list, and reply to support tickets
- **Role-Based** - Supports both merchant and carrier roles
- Zero external dependencies (uses Ruby stdlib only)

## Installation

```bash
gem install shipzy-sdk
```

Or add to your Gemfile:

```ruby
gem 'shipzy-sdk', '~> 2.0.0'
```

Then run:

```bash
bundle install
```

## Quick Start

```ruby
require 'shipzy'

client = Shipzy::Client.new(api_key: 'your-api-key')

# List orders
orders = client.order.list(page: 1, page_size: 20)

# Get a single order
order = client.order.get('order-id')

# Create an order
new_order = client.order.create(
  sender_name: 'John Doe',
  receiver_name: 'Jane Smith',
  goods_description: 'Electronics',
  quantity: 2
)

# Create order with documents (ECMR + EPOD)
result = client.order.create_with_documents(
  sender_name: 'John Doe',
  receiver_name: 'Jane Smith',
  goods_description: 'Furniture',
  generate_ecmr: true,
  generate_epod: true
)

# Cancel an order
client.order.cancel('order-id')
```

## Carrier Role

```ruby
require 'shipzy'

client = Shipzy::Client.new(api_key: 'carrier-api-key', role: :carrier, carrier_code: 'DPD')

# List carrier EPOD items
epods = client.carrier_epod.list(page: 1, page_size: 25)

# Mark delivery
client.carrier_epod.deliver('epod-id', recipient_name: 'Jane Smith')

# Upload delivery photo
client.carrier_epod.upload_photo('epod-id', 'https://example.com/photo.jpg')
```

## API Reference

### `Shipzy::Client.new(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `api_key` | String | - | Your Shipzy API key |
| `base_url` | String | `https://api.shipzy.me` | API base URL |
| `timeout` | Integer | `30` | Request timeout in seconds |
| `role` | Symbol | `:merchant` | `:merchant` or `:carrier` |
| `carrier_code` | String | `nil` | Carrier code (required for carrier role) |

### `client.order` — OrderClient

| Method | Description |
|--------|-------------|
| `list(page:, page_size:, status:)` | List orders with pagination |
| `get(id)` | Get order by ID |
| `create(data)` | Create a new order |
| `create_with_documents(data)` | Create order with ECMR/EPOD |
| `update(id, data)` | Update an order |
| `cancel(id)` | Cancel an order |

### `client.epod` — EpodClient

| Method | Description |
|--------|-------------|
| `list(page:, page_size:, status:, tracking_no:)` | List EPOD records |
| `get(id)` | Get EPOD by ID |
| `create(data)` | Create EPOD |
| `generate_from_order(order_id, options)` | Generate EPOD from an order |
| `update(id, data)` | Update EPOD |
| `deliver(id, data)` | Mark as delivered |
| `fail(id, remark)` | Mark as failed |
| `generate_sign_url(id)` | Get signing URL |
| `generate_pdf(id)` | Generate PDF |
| `verify(id)` | Verify EPOD integrity |
| `capture_proof(id, data)` | Capture delivery proof |
| `upload_photo(id, file_path)` | Upload photo (multipart) |

### `client.ecmr` — EcmrClient

| Method | Description |
|--------|-------------|
| `list(page:, page_size:)` | List ECMR records |
| `get(id)` | Get ECMR by ID |
| `create(data)` | Create ECMR |
| `generate_from_order(order_id)` | Generate ECMR from an order |
| `sign(id)` | Get signing URL |
| `pdf(id)` | Generate PDF |

### `client.address` — AddressClient

| Method | Description |
|--------|-------------|
| `list(params)` | List addresses |
| `create(data)` | Create address |
| `update(id, data)` | Update address |
| `delete(id)` | Delete address |
| `set_default(id)` | Set as default address |

### `client.carrier_epod` — CarrierEpodClient

| Method | Description |
|--------|-------------|
| `list(page:, page_size:, status:)` | List carrier EPOD records |
| `get(id)` | Get EPOD by ID |
| `deliver(id, data)` | Mark as delivered |
| `fail(id, remark)` | Mark as failed |
| `upload_photo(id, photo_url)` | Upload delivery photo |
| `capture_proof(id, data)` | Capture delivery proof |

### `client.carrier_address` — CarrierAddressClient

| Method | Description |
|--------|-------------|
| `list(params)` | List carrier addresses |
| `create(data)` | Create address |
| `update(id, data)` | Update address |

### `client.activation` — ActivationClient

| Method | Description |
|--------|-------------|
| `list_providers(capability:)` | List marketplace providers |
| `get_provider(slug)` | Get provider by slug |
| `list(page:, page_size:)` | List activations |
| `get(id)` | Get activation by ID |
| `activate(data)` | Create activation |
| `pause(id)` | Pause activation |
| `resume(id)` | Resume activation |
| `revoke(id, reason:)` | Revoke activation |

### `client.age_verification` — AgeVerificationClient

| Method | Description |
|--------|-------------|
| `create(data)` | Create age verification |
| `list_by_parcel(parcel_id)` | List verifications for a parcel |
| `list_by_order(order_id)` | List verifications for an order |

### `client.pickup_point` — PickupPointClient

| Method | Description |
|--------|-------------|
| `list(active_only:)` | List pickup points |
| `get(id)` | Get pickup point by ID |
| `create(data)` | Create pickup point |
| `update(id, data)` | Update pickup point |
| `deactivate(id)` | Deactivate pickup point |

### `client.product` — ProductClient

| Method | Description |
|--------|-------------|
| `list(status:, category:, search:, active_only:)` | List products |
| `get(id)` | Get product by ID |
| `create(data)` | Create product |
| `update(id, data)` | Update product |
| `retire(id)` | Retire product |

### `client.finance` — FinanceClient

| Method | Description |
|--------|-------------|
| `invoices` | List invoices |
| `list_subscriptions` | List subscriptions |
| `cancel_subscription(id)` | Cancel subscription |
| `resume_subscription(id)` | Resume subscription |
| `download_invoice(id)` | Download invoice PDF |

### `client.support_ticket` — SupportTicketClient

| Method | Description |
|--------|-------------|
| `create(data)` | Create support ticket |
| `list(status:)` | List tickets |
| `get(id)` | Get ticket by ID |
| `add_message(id, content)` | Reply to ticket |
| `admin_list(status:, priority:)` | List tickets (admin) |
| `admin_update(id, data)` | Update ticket (admin) |
| `admin_reply(id, content)` | Reply to ticket (admin) |
| `admin_stats` | Get support stats (admin) |

## Error Handling

```ruby
require 'shipzy'

client = Shipzy::Client.new(api_key: 'your-api-key')

begin
  orders = client.order.list
rescue Shipzy::AuthError => e
  puts "Authentication failed: #{e.message}"
rescue Shipzy::ApiError => e
  puts "API error (#{e.status_code}): #{e.message}"
rescue Shipzy::Error => e
  puts "SDK error: #{e.message}"
end
```

| Error Class | Description |
|-------------|-------------|
| `Shipzy::Error` | Base error class |
| `Shipzy::AuthError` | Authentication failure (401) |
| `Shipzy::ApiError` | API error with `status_code` attribute |

## Requirements

- Ruby >= 3.0

## License

MIT License. See [LICENSE](../LICENSE) for details.
