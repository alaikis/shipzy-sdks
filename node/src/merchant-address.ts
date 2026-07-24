import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface TenantAddress {
    id: string;
    full_name?: string;
    company_name?: string;
    street?: string;
    house_number?: string;
    postal_code?: string;
    city?: string;
    country_code?: string;
    phone?: string;
    email?: string;
    is_default?: boolean;
    created_at: string;
    updated_at: string;
}

export interface TenantAddressListResponse {
    data: TenantAddress[];
    total: number;
    page: number;
    page_size: number;
}

// ============ Client ============

export class MerchantAddressClient extends HttpClient {
    async list(filter: { page?: number; page_size?: number; role_tag?: string } = {}): Promise<ApiResult<TenantAddressListResponse>> {
        return this.request('/api/v1/merchant/addresses/list', 'POST', filter);
    }

    async create(body: Partial<TenantAddress>): Promise<ApiResult<TenantAddress>> {
        return this.request('/api/v1/merchant/addresses/create', 'POST', body);
    }

    async update(id: string, updates: Partial<TenantAddress>): Promise<ApiResult<{ id: string }>> {
        return this.request(`/api/v1/merchant/addresses/${id}/update`, 'POST', updates);
    }

    async delete(id: string): Promise<ApiResult<{ id: string }>> {
        return this.request(`/api/v1/merchant/addresses/${id}/delete`, 'POST', {});
    }

    async setDefault(id: string, type: 'sender' | 'return' | 'contact' | 'warehouse'): Promise<ApiResult<{ id: string; type: string }>> {
        return this.request(`/api/v1/merchant/addresses/${id}/set-default`, 'POST', { type });
    }
}
