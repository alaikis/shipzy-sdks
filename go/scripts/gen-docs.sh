#!/bin/bash
set -euo pipefail

OUTPUT_DIR="${1:-docs/api}"
mkdir -p "$OUTPUT_DIR"

echo "Generating Go SDK API documentation..."

# Generate package docs
for pkg in . ./shared ./tms ./cart; do
  pkg_name=$(basename "$pkg" | sed 's/\./root/')
  if [ "$pkg" = "." ]; then
    pkg_name="zymeup"
  fi
  echo "  Processing $pkg_name..."
  go doc -all "$pkg" > "$OUTPUT_DIR/$pkg_name.txt" 2>/dev/null || true
done

# Generate markdown overview
{
  echo "# Zymeup Go SDK API Reference"
  echo ""
  echo "Generated from source code on $(date -u '+%Y-%m-%d')"
  echo ""
  echo "## Packages"
  echo ""
  echo "| Package | Description |"
  echo "|---------|-------------|"
  echo "| \`zymeup\` | Root package with Client, domain clients (Order, Epod, Ecmr, etc.) |"
  echo "| \`shared\` | Shared core: Config, Auth, HTTP Client, Error types, Version |"
  echo "| \`tms\` | Transport Management: Shipment, Tracking, Carrier services |"
  echo "| \`cart\` | E-commerce: Product, Order, Checkout services |"
  echo ""
  echo "## Installation"
  echo ""
  echo '```bash'
  echo 'go get github.com/alaikis/shipzy-sdks/go'
  echo '```'
  echo ""
  echo "## Quick Start"
  echo ""
  echo '```go'
  echo "package main"
  echo ""
  echo 'import ('
  echo '    "context"'
  echo '    "github.com/alaikis/shipzy-sdks/go/shared"'
  echo '    "github.com/alaikis/shipzy-sdks/go/cart"'
  echo ')'
  echo ""
  echo 'func main() {'
  echo '    cfg := shared.NewConfig().WithBaseURL("https://api.zymeup.com").WithAPIKey("your-key")'
  echo '    client := shared.NewClient(cfg, shared.NewAPIKeyAuth(cfg.APIKey))'
  echo '    svc := cart.NewProductService(client)'
  echo '    products, _ := svc.List(context.Background(), &cart.ProductFilter{})'
  echo '    println(products.Total)'
  echo '}'
  echo '```'
  echo ""
} > "$OUTPUT_DIR/README.md"

echo "Documentation generated in $OUTPUT_DIR/"
echo "  - README.md (overview)"
echo "  - zymeup.txt (root package)"
echo "  - shared.txt"
echo "  - tms.txt"
echo "  - cart.txt"