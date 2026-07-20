# Shipzy SDK

Official multi-language SDK for the Shipzy logistics platform.

**Current version:** `0.1.0-alpha.1` (early alpha, API not stable)

## Install

| Language | Command |
|----------|---------|
| Go | `go get github.com/alaikis/shipzy-sdks/go@v0.1.0-alpha.1` |
| PHP | `composer require shipzy/sdk:0.1.0-alpha.1` |
| Node / TypeScript | `npm i @shipzy/sdk@0.1.0-alpha.1` |
| Python | `pip install shipzy-sdk==0.1.0-alpha.1` |

Package names finalized in `.naming.md`.

## Structure

- `go/` — Go SDK (`shared`, `multilang`, `tms`)
- `php/` — PHP SDK (PSR-4, PHP 8.2+)
- `node/` — TypeScript SDK (ESM + CJS, Node 20+)
- `python/` — Python SDK (Python 3.10+)

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
