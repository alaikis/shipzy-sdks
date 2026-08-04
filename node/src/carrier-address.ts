import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';
import type { Address, AddressListResponse } from './address';

// ============ Client ============

export class CarrierAddressClient extends HttpClient {
    async list(params: Record<string, unknown> = {}): Promise<ApiResult<AddressListResponse>> {
        return this.request('/api/v1/carrier/sdk/addresses/list', 'POST', params);
    }

    async create(data: Record<string, unknown>): Promise<ApiResult<Address>> {
        return this.request('/api/v1/carrier/sdk/addresses/create', 'POST', data);
    }

    async update(id: string, data: Record<string, unknown>): Promise<ApiResult<Address>> {
        return this.request(`/api/v1/carrier/sdk/addresses/${id}/update`, 'POST', data);
    }

    async delete(id: string): Promise<ApiResult<{ deleted: boolean }>> {
        return this.request(`/api/v1/carrier/sdk/addresses/${id}/delete`, 'POST', {});
    }

    async setDefault(id: string): Promise<ApiResult<Address>> {
        return this.request(`/api/v1/carrier/sdk/addresses/${id}/set-default`, 'POST', {});
    }
}
