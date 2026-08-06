package cart

import "context"

type ProductService interface {
	List(ctx context.Context, filter *ProductFilter) (*ProductListResponse, error)
	Get(ctx context.Context, id string) (*Product, error)
	Create(ctx context.Context, req *ProductCreateRequest) (*Product, error)
	Update(ctx context.Context, id string, updates map[string]interface{}) (*Product, error)
	Retire(ctx context.Context, id string) error
}