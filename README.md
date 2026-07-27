# Zymeup SDK

Official multi-language SDK for the Zymeup logistics platform.

**Current version:** `1.2.0`

## Install

| Language | Command |
|----------|---------|
| Go | `go get github.com/alaikis/shipzy-sdks/go@v1.2.0` |
| PHP | `composer require alaikas/zymeup-sdk:1.2.0` |
| Node / TypeScript | `npm i @zymeup/sdk@1.2.0` |
| Python | `pip install zymeup-sdk==1.2.0` |

## Structure

- `go/` — Go SDK (`shared`, `multilang`, `tms`)
- `php/` — PHP SDK (PSR-4, PHP 8.0+)
- `node/` — TypeScript SDK (ESM + CJS, Node 20+)
  - `src/` — Core SDK (ShipzyClient, EpodClient, OrderClient, etc.)
  - `src/epod-elements/` — Web Components (EPOD list, detail, create, login, signature)
  - `src/rn/` — React Native components (ShipzyProvider, EpodList, EpodDetail, EpodSignature)

## Features

| Feature | Node.js | Go | PHP | Python |
|---------|---------|-----|-----|--------|
| Order Management | ✅ | ❌ | ❌ | ❌ |
| EPOD (Electronic Proof of Delivery) | ✅ | ❌ | ❌ | ❌ |
| ECMR (Electronic Consignment Note) | ✅ | ❌ | ❌ | ❌ |
| Tracking | ✅ | ❌ | ❌ | ❌ |
| Address Book | ✅ | ❌ | ❌ | ❌ |
| Web Components | ✅ | ❌ | ❌ | ❌ |
| React Native | ✅ | ❌ | ❌ | ❌ |

## CI

| Workflow | Status |
|---|---|
| ci | ![ci](https://github.com/alaikis/shipzy-sdks/actions/workflows/ci.yml/badge.svg) |
| release-go | ![release-go](https://github.com/alaikis/shipzy-sdks/actions/workflows/release-go.yml/badge.svg) |
| release-php | ![release-php](https://github.com/alaikis/shipzy-sdks/actions/workflows/release-php.yml/badge.svg) |
| release-node | ![release-node](https://github.com/alaikis/shipzy-sdks/actions/workflows/release-node.yml/badge.svg) |
| release-python | ![release-python](https://github.com/alaikis/shipzy-sdks/actions/workflows/release-python.yml/badge.svg) |

## License

MIT
