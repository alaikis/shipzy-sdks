import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export type PickupPointType = 'store' | 'locker' | 'counter';
export type PickupPointStatus = 'active' | 'inactive';

export interface PickupPoint {
    id: string;
    merchant_id: string;
    type: PickupPointType;
    name: string;
    address: string;
    contact_phone?: string;
    contact_email?: string;
    opening_hours?: string;
    status: PickupPointStatus;
    latitude?: number;
    longitude?: number;
    country_code?: string;
    created_at: string;
    updated_at: string;
}

export interface CreatePickupPointRequest {
    name: string;
    type?: PickupPointType;
    address?: string;
    contact_phone?: string;
    contact_email?: string;
    opening_hours?: string;
    latitude?: number;
    longitude?: number;
    country_code?: string;
}

export interface PickupPointListResponse {
    data: PickupPoint[];
    total: number;
}

// ============ Client ============

export class PickupPointClient extends HttpClient {
    async list(activeOnly = true): Promise<ApiResult<PickupPointListResponse>> {
        const q = activeOnly ? '' : '?active_only=false';
        return this.request(`/api/v1/admin/pickup-points/${q}`);
    }

    async get(id: string): Promise<ApiResult<PickupPoint>> {
        return this.request(`/api/v1/admin/pickup-points/${id}`);
    }

    async create(req: CreatePickupPointRequest): Promise<ApiResult<PickupPoint>> {
        return this.request('/api/v1/admin/pickup-points/', 'POST', req);
    }

    async update(id: string, updates: Partial<PickupPoint>): Promise<ApiResult<{ status: string }>> {
        return this.request(`/api/v1/admin/pickup-points/${id}`, 'PUT', updates);
    }

    async deactivate(id: string): Promise<ApiResult<{ status: string }>> {
        return this.request(`/api/v1/admin/pickup-points/${id}/deactivate`, 'POST', {});
    }
}
