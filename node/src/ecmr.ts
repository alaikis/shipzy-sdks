import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface EcmrListItem {
    id: string;
    document_no: string;
    status: string;
    created_at: string;
}

export interface EcmrListResponse {
    data: EcmrListItem[];
    total: number;
    page: number;
    page_size: number;
}

// ============ Client ============

export class EcmrClient extends HttpClient {
    async list(params: { page?: number; pageSize?: number } = {}): Promise<ApiResult<EcmrListResponse>> {
        const q = this.buildQuery({ page: params.page, page_size: params.pageSize });
        return this.request(`/api/v1/shipment/ecmr/list${q}`);
    }

    async get(id: string): Promise<ApiResult<Record<string, any>>> {
        return this.request(`/api/v1/shipment/ecmr/${id}`);
    }

    async create(data: Record<string, unknown>): Promise<ApiResult<Record<string, any>>> {
        return this.request('/api/v1/shipment/ecmr/create', 'POST', data);
    }

    async generateFromOrder(orderId: string): Promise<ApiResult<Record<string, any>>> {
        return this.request('/api/v1/shipment/ecmr/generate-from-order', 'POST', { order_id: orderId });
    }

    async sign(id: string): Promise<ApiResult<Record<string, any>>> {
        return this.request(`/api/v1/shipment/ecmr/${id}/sign`, 'POST', {});
    }

    async update(id: string, data: Record<string, unknown>): Promise<ApiResult<Record<string, any>>> {
        return this.request(`/api/v1/shipment/ecmr/${id}/update`, 'POST', data);
    }

    async cancel(id: string): Promise<ApiResult<Record<string, any>>> {
        return this.request(`/api/v1/shipment/ecmr/${id}/cancel`, 'POST', {});
    }

    async validate(id: string): Promise<ApiResult<Record<string, any>>> {
        return this.request(`/api/v1/shipment/ecmr/${id}/validate`, 'POST', {});
    }

    async submitToAuthority(id: string): Promise<ApiResult<Record<string, any>>> {
        return this.request(`/api/v1/shipment/ecmr/${id}/submit-to-authority`, 'POST', {});
    }

    async pdf(id: string): Promise<ApiResult<{ status: string; pdf_url?: string }>> {
        return this.request(`/api/v1/shipment/ecmr/${id}/pdf`, 'POST', {});
    }
}
