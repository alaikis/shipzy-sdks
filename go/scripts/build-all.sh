#!/bin/bash
set -euo pipefail

VERSION=$(cat VERSION)
echo "Building shipzy-sdk-go v${VERSION}..."

mkdir -p dist
GOOS=linux GOARCH=amd64 go build -ldflags "-X github.com/alaikis/shipzy-sdks/go/shared.version=${VERSION}" -o "dist/shipzy-sdk-${VERSION}-linux-amd64" ./...
echo "  linux/amd64 ✓"

GOOS=linux GOARCH=arm64 go build -ldflags "-X github.com/alaikis/shipzy-sdks/go/shared.version=${VERSION}" -o "dist/shipzy-sdk-${VERSION}-linux-arm64" ./...
echo "  linux/arm64 ✓"

GOOS=darwin GOARCH=amd64 go build -ldflags "-X github.com/alaikis/shipzy-sdks/go/shared.version=${VERSION}" -o "dist/shipzy-sdk-${VERSION}-darwin-amd64" ./...
echo "  darwin/amd64 ✓"

GOOS=darwin GOARCH=arm64 go build -ldflags "-X github.com/alaikis/shipzy-sdks/go/shared.version=${VERSION}" -o "dist/shipzy-sdk-${VERSION}-darwin-arm64" ./...
echo "  darwin/arm64 ✓"

GOOS=windows GOARCH=amd64 go build -ldflags "-X github.com/alaikis/shipzy-sdks/go/shared.version=${VERSION}" -o "dist/shipzy-sdk-${VERSION}-windows-amd64.exe" ./...
echo "  windows/amd64 ✓"

echo "All platforms built successfully."