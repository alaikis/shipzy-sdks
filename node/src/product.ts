import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export type ProductStatus = 'active' | 'inactive' | 'draft';
export type ProductCategory = 'physical' | 'digital' | 'service';

export interface Product {
    id: string;
    merchant_id: string;
    name: string;
    sku?: string;
    description?: string;
    category?: ProductCategory;
    status: ProductStatus;
    price?: number;
    currency?: string;
    age_restricted?: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateProductRequest {
    name: string;
    sku?: string;
    description?: string;
    category?: ProductCategory;
    price?: number;
    currency?: string;
    age_restricted?: boolean;
}

export interface ProductListResponse {
    data: Product[];
    total: number;
    page: number;
    page_size: number;
}

// ============ Client ============

export class ProductClient extends HttpClient {
    async list(filter?: {
        status?: ProductStatus;
        category?: ProductCategory;
        search?: string;
        active_only?: boolean;
    }): Promise<ApiResult<ProductListResponse>> {
        const params = new URLSearchParams();
        if (filter?.status) params.set('status', filter.status);
        if (filter?.category) params.set('category', filter.category);
        if (filter?.search) params.set('search', filter.search);
        if (filter?.active_only) params.set('active_only', 'true');
        const q = params.toString() ? `?${params.toString()}` : '';
        return this.request(`/api/v1/products${q}`);
    }

    async get(id: string): Promise<ApiResult<Product>> {
        return this.request(`/api/v1/products/${encodeURIComponent(id)}`);
    }

    async create(req: CreateProductRequest): Promise<ApiResult<Product>> {
        return this.request('/api/v1/products', 'POST', req);
    }

    async update(id: string, updates: Partial<CreateProductRequest & { status: ProductStatus }>): Promise<ApiResult<{ status: string }>> {
        return this.request(`/api/v1/products/${encodeURIComponent(id)}`, 'PUT', updates);
    }

    async retire(id: string): Promise<ApiResult<{ status: string }>> {
        return this.request(`/api/v1/products/${encodeURIComponent(id)}/retire`, 'POST', {});
    }
}
