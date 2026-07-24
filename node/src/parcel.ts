import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface Parcel {
    id: string;
    shipment_id: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    status?: string;
    created_at: string;
    updated_at: string;
}

// ============ Client ============

export class ParcelClient extends HttpClient {
    async get(id: string): Promise<ApiResult<Parcel>> {
        return this.request(`/api/v1/parcels/${encodeURIComponent(id)}`);
    }

    async update(id: string, updates: Partial<Parcel>): Promise<ApiResult<{ status: string }>> {
        return this.request(`/api/v1/parcels/${encodeURIComponent(id)}/update`, 'PUT', updates);
    }
}
