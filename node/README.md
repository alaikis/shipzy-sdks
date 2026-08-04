# @zymeup/sdk

Official Node.js SDK for the [Zymeup](https://zymeup.com) logistics platform. Provides typed API clients for merchants and carriers, plus browser Web Components with framework wrappers for Vue, Solid, and React.

## Features

- **HTTP Client** — API key authentication with automatic `X-Api-Token` header injection
- **EPOD Management** — List, detail, create, generate from order, sign, deliver, capture proof, verify, PDF generation
- **ECMR Management** — List, detail, create, generate from order, sign, PDF generation
- **Order Management** — List, detail, create, update, cancel, create with documents
- **Tracking** — Subscribe, list events, real-time SSE support
- **Pickup Points** — CRUD for merchant pickup locations
- **Activation** — Carrier activation and capability discovery
- **Age Verification** — Request and manage age verification events
- **Merchant Address** — Address book with multi-tenant support
- **Product** — Product catalog management
- **Finance** — Invoices and subscriptions
- **Notification** — Multi-channel delivery (Email, SMS, WhatsApp)
- **Support Ticket** — Ticket management
- **Web Components** — `<zymeup-epod-list>`, `<zymeup-epod-detail>`, `<zymeup-epod-create>`, `<zymeup-epod-signature>`, etc.
- **Framework Wrappers** — Vue 3, Solid.js, and React bindings for Web Components
- **React Native** — WebView-based components (import from `@zymeup/sdk/rn`)

## Installation

```bash
npm install @zymeup/sdk
```

Requires Node.js >= 20.

## Quick Start

```typescript
import { ShipzyClient } from '@zymeup/sdk';

const client = new ShipzyClient({
  apiKey: 'your-api-key',
  role: 'merchant', // 'merchant' | 'carrier'
  baseUrl: 'https://api.zymeup.com',
});

// List orders
const orders = await client.order.list({ page: 1, pageSize: 20 });
console.log(orders.data);

// Get EPOD detail
const epod = await client.epod.get('epod-id-123');

// List tracking events
const tracking = await client.tracking.list({ trackingNo: '3SABC123456789' });

// Create an order with EPOD
const result = await client.order.createWithDocuments({
  customer_name: 'John Doe',
  items: [{ description: 'Electronics', quantity: 2, weight: 5.5 }],
});
```

## Configuration

```typescript
interface ShipzyConfig {
  apiKey: string;           // API key for authentication
  baseUrl?: string;         // API base URL (default: https://api.zymeup.com)
  role?: 'merchant' | 'carrier'; // Client role (default: 'merchant')
  carrierCode?: string;     // Required when role is 'carrier'
}
```

## API Reference

### ShipzyClient

The main entry point exposes typed sub-clients for each API domain:

| Property | Type | Description |
|----------|------|-------------|
| `epod` | `EpodClient` | EPOD management (merchant) |
| `order` | `OrderClient` | Order management |
| `ecmr` | `EcmrClient` | ECMR management |
| `address` | `AddressClient` | Merchant address book |
| `merchantAddress` | `MerchantAddressClient` | Multi-tenant address book |
| `carrierEpod` | `CarrierEpodClient` | EPOD management (carrier) |
| `carrierAddress` | `CarrierAddressClient` | Carrier address book |
| `pickupPoints` | `PickupPointClient` | Pickup point CRUD |
| `shipment` | `ShipmentClient` | Shipment management |
| `parcel` | `ParcelClient` | Parcel management |
| `tracking` | `TrackingClient` | Tracking subscriptions and events |
| `ageVerification` | `AgeVerificationClient` | Age verification |
| `activation` | `ActivationClient` | Carrier activation |
| `product` | `ProductClient` | Product catalog |
| `finance` | `FinanceClient` | Invoices and subscriptions |
| `compliance` | `ComplianceClient` | Customs and compliance |
| `cpsc` | `CPSCClient` | CPSC compliance (US) |
| `carrier` | `CarrierClient` | Carrier configuration |
| `platformConfig` | `PlatformConfigClient` | Platform configuration |
| `upload` | `UploadClient` | File uploads |
| `publicEpod` | `PublicEpodClient` | Public EPOD signing (no auth) |

### Method signatures

All authenticated clients extend `HttpClient` and expose:

```typescript
// GET request
client.epod.list({ page: 1, pageSize: 20 });
client.epod.get(id);

// POST request
client.epod.create({ ... });
client.epod.generateFromOrder(orderId);

// PUT request
client.epod.update(id, { ... });
```

### Error handling

```typescript
import { ShipzyError, ShipzyAuthError } from '@zymeup/sdk';

try {
  await client.order.list();
} catch (err) {
  if (err instanceof ShipzyAuthError) {
    console.error('Invalid API key');
  } else if (err instanceof ShipzyError) {
    console.error(`API error: ${err.message}`);
  }
}
```

### Dynamic token update

```typescript
client.updateToken('new-api-key');
client.updateConfig({ baseUrl: 'https://staging-api.zymeup.com' });
```

## Web Components

The SDK includes browser-native Web Components for EPOD workflows. No framework required.

```typescript
import '@zymeup/sdk/epod-elements';
```

### Available elements

| Element | Description |
|---------|-------------|
| `<zymeup-epod-list>` | Paginated EPOD list with status filter |
| `<zymeup-epod-detail>` | EPOD detail view with actions |
| `<zymeup-epod-create>` | EPOD creation form |
| `<zymeup-epod-signature>` | Signature capture (public, token-based) |
| `<zymeup-epod-login>` | EPOD login |
| `<zymeup-tracking-list>` | Tracking event list |
| `<zymeup-tracking-detail>` | Tracking event detail |

### Usage

```html
<zymeup-epod-list
  token="your-api-key"
  base-url="https://api.zymeup.com"
  page-size="10"
  status-filter="pending"
></zymeup-epod-list>

<script type="module">
  import '@zymeup/sdk/epod-elements';
</script>
```

### Events

Elements emit custom events:

- `epod-select` — `detail.epodId`
- `sign-url-generated` — `detail.signUrl`
- `signature-capture` — `detail.signatureData`
- `created` — `detail.epodId`
- `error` — `detail.message`

## Framework Wrappers

### Vue 3

```bash
# No extra install needed — included in @zymeup/sdk
```

```typescript
import { EpodList, EpodDetail, EpodCreate, EpodSignature } from '@zymeup/sdk/epod-elements/wrappers/vue';
```

```vue
<template>
  <EpodList token="your-api-key" @select="onSelect" />
</template>

<script setup>
import { EpodList } from '@zymeup/sdk/epod-elements/wrappers/vue';

function onSelect(epodId) {
  console.log('Selected:', epodId);
}
</script>
```

**Available components:** `EpodList`, `EpodDetail`, `EpodCreate`, `EpodSignature`

**Vue 3 bindings** (composition API helper):

```typescript
import { useZymeup } from '@zymeup/sdk/vue';

const client = useZymeup({ apiKey: 'your-api-key' });
```

### Solid.js

```typescript
import { createZymeup } from '@zymeup/sdk/solid';

const client = createZymeup({ apiKey: 'your-api-key' });
```

### React

```typescript
import { ShipzyClient } from '@zymeup/sdk/react';

const client = new ShipzyClient({ apiKey: 'your-api-key' });
```

### React Native

```typescript
import { ShipzyProvider, useShipzy, EpodList } from '@zymeup/sdk/rn';
```

Requires `react-native-webview` as a peer dependency.

## Building

```bash
npm run build
```

## Testing

```bash
npm test
```

## License

MIT
