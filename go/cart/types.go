package cart

import "github.com/alaikis/shipzy-sdks/go/shared"

type Product struct {
	ID          string  `json:"id"`
	MerchantID  string  `json:"merchant_id"`
	SKU         string  `json:"sku"`
	Name        string  `json:"name"`
	Description string  `json:"description,omitempty"`
	Category    string  `json:"category"`
	HsCode      string  `json:"hs_code,omitempty"`
	Weight      float64 `json:"weight,omitempty"`
	Volume      float64 `json:"volume,omitempty"`
	UnitPrice   float64 `json:"unit_price"`
	Currency    string  `json:"currency"`
	Status      string  `json:"status"`
	CreatedAt   string  `json:"created_at"`
	UpdatedAt   string  `json:"updated_at"`
}

type ProductFilter struct {
	Category string
	Search   string
	Status   string
	Page     int
	PageSize int
}

type ProductListResponse struct {
	Data     []Product `json:"data"`
	Total    int       `json:"total"`
	Page     int       `json:"page"`
	PageSize int       `json:"page_size"`
}

type ProductCreateRequest struct {
	SKU       string  `json:"sku"`
	Name      string  `json:"name"`
	Category  string  `json:"category"`
	UnitPrice float64 `json:"unit_price"`
	Currency  string  `json:"currency"`
	HsCode    string  `json:"hs_code,omitempty"`
	Weight    float64 `json:"weight,omitempty"`
	Volume    float64 `json:"volume,omitempty"`
}

type Order struct {
	ID              string             `json:"id"`
	OrderNo         string             `json:"order_no"`
	CustomerName    string             `json:"customer_name"`
	CustomerEmail   string             `json:"customer_email"`
	CustomerPhone   string             `json:"customer_phone,omitempty"`
	ShippingAddress *shared.Address    `json:"shipping_address,omitempty"`
	TotalAmount     float64            `json:"total_amount"`
	Currency        string             `json:"currency"`
	Status          string             `json:"status"`
	Items           []OrderItem        `json:"items,omitempty"`
	Notes           string             `json:"notes,omitempty"`
	CreatedAt       string             `json:"created_at"`
	UpdatedAt       string             `json:"updated_at"`
}

type OrderItem struct {
	ProductID   string  `json:"product_id,omitempty"`
	Name        string  `json:"name"`
	ProductType string  `json:"product_type,omitempty"`
	Quantity    int     `json:"quantity"`
	UnitPrice   float64 `json:"unit_price"`
	TotalPrice  float64 `json:"total_price,omitempty"`
	Currency    string  `json:"currency,omitempty"`
	HsCode      string  `json:"hs_code,omitempty"`
}

type OrderFilter struct {
	Status string
	Page   int
	PageSize int
}

type OrderListResponse struct {
	Data     []Order `json:"data"`
	Total    int     `json:"total"`
	Page     int     `json:"page"`
	PageSize int     `json:"page_size"`
}

type OrderCreateRequest struct {
	OrderNo       string             `json:"order_no"`
	CustomerName  string             `json:"customer_name"`
	CustomerEmail string             `json:"customer_email"`
	CustomerPhone string             `json:"customer_phone,omitempty"`
	Currency      string             `json:"currency,omitempty"`
	TotalAmount   float64            `json:"total_amount,omitempty"`
	ShippingAddress *shared.Address  `json:"shipping_address,omitempty"`
	SenderAddress   *shared.Address  `json:"sender_address,omitempty"`
	Items         []OrderItem        `json:"items,omitempty"`
	Notes         string             `json:"notes,omitempty"`
}

type CheckoutRequest struct {
	OrderID      string   `json:"order_id"`
	Channel      string   `json:"channel,omitempty"`
	Lang         string   `json:"lang,omitempty"`
	AutoGenerate struct {
		Ecmr bool `json:"ecmr,omitempty"`
		Epod bool `json:"epod,omitempty"`
	} `json:"auto_generate,omitempty"`
}

type CheckoutResult struct {
	Order  *Order   `json:"order"`
	Ecmr   *Ecmr    `json:"ecmr,omitempty"`
	Epod   *Epod    `json:"epod,omitempty"`
	SignURL string  `json:"sign_url,omitempty"`
}

type Ecmr struct {
	ID              string `json:"id"`
	TrackingNo      string `json:"tracking_no"`
	Status          string `json:"status"`
	GoodsDescription string `json:"goods_description,omitempty"`
	HsCode          string `json:"hs_code,omitempty"`
	SignURL         string `json:"sign_url,omitempty"`
	PdfURL          string `json:"pdf_url,omitempty"`
}

type Epod struct {
	ID              string `json:"id"`
	TrackingNo      string `json:"tracking_no"`
	RecipientName   string `json:"recipient_name"`
	Status          string `json:"status"`
	DeliveryMode    string `json:"delivery_mode,omitempty"`
	SignURL         string `json:"sign_url,omitempty"`
	PdfURL          string `json:"pdf_url,omitempty"`
	DocumentHash    string `json:"document_hash,omitempty"`
}