import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface Address {
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
}

export interface AddressListResponse {
    data: Address[];
    total: number;
}

// ============ Client ============

export class AddressClient extends HttpClient {
    async list(params: Record<string, unknown> = {}): Promise<ApiResult<AddressListResponse>> {
        return this.request('/api/v1/merchant/addresses/list', 'POST', params);
    }

    async create(data: Record<string, unknown>): Promise<ApiResult<Address>> {
        return this.request('/api/v1/merchant/addresses/create', 'POST', data);
    }

    async update(id: string, data: Record<string, unknown>): Promise<ApiResult<Address>> {
        return this.request(`/api/v1/merchant/addresses/${id}/update`, 'POST', data);
    }

    async delete(id: string): Promise<ApiResult<{ deleted: boolean }>> {
        return this.request(`/api/v1/merchant/addresses/${id}/delete`, 'POST', {});
    }

    async setDefault(id: string): Promise<ApiResult<Address>> {
        return this.request(`/api/v1/merchant/addresses/${id}/set-default`, 'POST', {});
    }
}
