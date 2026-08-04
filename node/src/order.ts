import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface OrderListItem {
    id: string;
    order_no: string;
    status: string;
    customer_name?: string;
    total_amount?: number;
    currency?: string;
    created_at: string;
}

export interface OrderListResponse {
    data: OrderListItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface OrderDetail {
    id: string;
    order_no: string;
    status: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    total_amount?: number;
    currency?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

// ============ Client ============

export class OrderClient extends HttpClient {
    async list(params: { page?: number; pageSize?: number; status?: string } = {}): Promise<ApiResult<OrderListResponse>> {
        const q = this.buildQuery({ page: params.page, page_size: params.pageSize, status: params.status });
        return this.request(`/api/v1/order/list${q}`);
    }

    async get(id: string): Promise<ApiResult<OrderDetail>> {
        return this.request(`/api/v1/order/${id}`);
    }

    async create(data: Record<string, unknown>): Promise<ApiResult<OrderDetail>> {
        return this.request('/api/v1/order/create', 'POST', data);
    }

    async createWithDocuments(data: Record<string, unknown>): Promise<ApiResult<OrderDetail & { epod_id?: string; ecmr_id?: string }>> {
        return this.request('/api/v1/order/create-with-documents', 'POST', data);
    }

    async update(id: string, data: Record<string, unknown>): Promise<ApiResult<OrderDetail>> {
        return this.request(`/api/v1/order/${id}/update`, 'POST', data);
    }

    async cancel(id: string): Promise<ApiResult<OrderDetail>> {
        return this.request(`/api/v1/order/${id}/cancel`, 'POST', {});
    }
}
