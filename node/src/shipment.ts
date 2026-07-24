import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface Shipment {
    id: string;
    order_id: string;
    tracking_no?: string;
    status?: string;
    created_at: string;
    updated_at: string;
}

export interface ShipmentDetail extends Shipment {
    parcels?: any[];
    item_lines?: any[];
}

export interface CreateShipmentRequest {
    order_id: string;
    parcels?: any[];
    [key: string]: any;
}

export interface ShipmentListResponse {
    data: Shipment[];
    total: number;
    page: number;
    page_size: number;
}

// ============ Client ============

export class ShipmentClient extends HttpClient {
    async create(req: CreateShipmentRequest): Promise<ApiResult<Shipment>> {
        return this.request('/api/v1/shipments/create', 'POST', req);
    }

    async list(filter?: { order_id?: string }): Promise<ApiResult<ShipmentListResponse>> {
        const q = filter?.order_id ? `?order_id=${encodeURIComponent(filter.order_id)}` : '';
        return this.request(`/api/v1/shipments/list${q}`);
    }

    async listWithDetails(filter: { order_id: string }): Promise<ApiResult<{ data: ShipmentDetail[] }>> {
        const q = `?order_id=${encodeURIComponent(filter.order_id)}`;
        return this.request(`/api/v1/shipments/list-with-details${q}`);
    }

    async get(id: string): Promise<ApiResult<ShipmentDetail>> {
        return this.request(`/api/v1/shipments/${encodeURIComponent(id)}`);
    }

    async update(id: string, updates: Partial<Shipment>): Promise<ApiResult<{ status: string }>> {
        return this.request(`/api/v1/shipments/${encodeURIComponent(id)}/update`, 'PUT', updates);
    }

    async cancel(id: string): Promise<ApiResult<{ status: string }>> {
        return this.request(`/api/v1/shipments/${encodeURIComponent(id)}/cancel`, 'POST', {});
    }
}
