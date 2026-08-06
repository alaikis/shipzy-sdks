# Cart SDK

The Cart SDK provides e-commerce capabilities: product catalog, order management, and checkout flow.

## Package

```go
import "github.com/alaikis/shipzy-sdks/go/cart"
```

## Types

| Type | Description |
|------|-------------|
| `Product` | Product with SKU, category, pricing, HS code, weight/volume |
| `Order` | Order with items, shipping address, status |
| `OrderItem` | Line item with product_id, quantity, unit_price, product_type |
| `CheckoutResult` | Checkout result with Order + generated ECMR/EPOD |

## Services

### ProductService

```go
svc := cart.NewProductService(client)

// List products
products, err := svc.List(ctx, &cart.ProductFilter{Category: "physical", Page: 1})

// Get product by ID
product, err := svc.Get(ctx, "prod-123")

// Create product
product, err := svc.Create(ctx, &cart.ProductCreateRequest{
    SKU:       "SKU-001",
    Name:      "Widget",
    Category:  "physical",
    UnitPrice: 29.99,
    Currency:  "EUR",
})

// Update product
product, err := svc.Update(ctx, "prod-123", map[string]interface{}{
    "unit_price": 24.99,
})

// Retire product
err := svc.Retire(ctx, "prod-123")
```

### OrderService

```go
svc := cart.NewOrderService(client)

// List orders
orders, err := svc.List(ctx, &cart.OrderFilter{Status: "pending", Page: 1})

// Get order by ID
order, err := svc.Get(ctx, "ord-123")

// Create order
order, err := svc.Create(ctx, &cart.OrderCreateRequest{
    OrderNo:       "ORD-2026-001",
    CustomerName:  "John Doe",
    CustomerEmail: "john@example.com",
    Currency:      "EUR",
    Items: []cart.OrderItem{
        {Name: "Widget", Quantity: 2, UnitPrice: 29.99, ProductType: "physical"},
    },
})

// Cancel order
err := svc.Cancel(ctx, "ord-123")
```

### CheckoutService

```go
svc := cart.NewCheckoutService(client)

result, err := svc.CreateWithDocuments(ctx, &cart.CheckoutRequest{
    OrderID: "ord-123",
    Channel: "email",
    AutoGenerate: struct {
        Ecmr bool `json:"ecmr,omitempty"`
        Epod bool `json:"epod,omitempty"`
    }{Ecmr: false, Epod: true},
})
// result.Order, result.Epod, result.SignURL
```

## Product Types

Products support four categories:
- `physical` — Tangible goods requiring shipping and HS code
- `digital` — Downloadable/streamable products
- `service` — Non-tangible services
- `other` — Other product types