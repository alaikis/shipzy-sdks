.PHONY: build test lint fmt clean cross-build version

VERSION := $(shell cat VERSION)
LDFLAGS := -ldflags "-X github.com/alaikis/shipzy-sdks/go/shared.version=$(VERSION)"

build:
	go build $(LDFLAGS) -o dist/shipzy-sdk-$(VERSION) ./...

test:
	go test ./... -v -cover

lint:
	golangci-lint run ./...

fmt:
	go fmt ./...

clean:
	rm -rf dist/

cross-build:
	@mkdir -p dist
	GOOS=linux GOARCH=amd64 go build $(LDFLAGS) -o dist/shipzy-sdk-$(VERSION)-linux-amd64 ./...
	GOOS=linux GOARCH=arm64 go build $(LDFLAGS) -o dist/shipzy-sdk-$(VERSION)-linux-arm64 ./...
	GOOS=darwin GOARCH=amd64 go build $(LDFLAGS) -o dist/shipzy-sdk-$(VERSION)-darwin-amd64 ./...
	GOOS=darwin GOARCH=arm64 go build $(LDFLAGS) -o dist/shipzy-sdk-$(VERSION)-darwin-arm64 ./...
	GOOS=windows GOARCH=amd64 go build $(LDFLAGS) -o dist/shipzy-sdk-$(VERSION)-windows-amd64.exe ./...

version:
	@bash scripts/version.sh $(VERSION)

tidy:
	go mod tidy
	go mod download all
