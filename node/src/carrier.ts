import { HttpClient } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface Carrier {
    id: number;
    name: string;
    code: string;
    carrier_type: string;
    tracking_type: string;
    tracking_provider?: string;
    tracking_slug?: string;
    business_type: string;
    state: 'active' | 'pending' | 'suspended';
    description: string;
    website: string;
    contact_email?: string;
    contact_phone?: string;
    created_at: string;
    updated_at: string;
}

// ============ Carrier Client ============

export class CarrierClient extends HttpClient {
    async list(filter: { page?: number; page_size?: number; state?: string } = {}): Promise<ApiResult<Carrier[]>> {
        const q = this.buildQuery(filter);
        const result = await this.request(`/api/v1/carrier/list${q}`) as any;
        return result as ApiResult<Carrier[]>;
    }

    async get(id: string): Promise<ApiResult<Carrier>> {
        const result = await this.request(`/api/v1/carrier/${encodeURIComponent(id)}`) as any;
        return result as ApiResult<Carrier>;
    }

    async create(data: { name: string; code: string; carrier_type?: string; tracking_type?: string; business_type?: string }): Promise<ApiResult<Carrier>> {
        const result = await this.request('/api/v1/carrier/register', 'POST', data) as any;
        return result as ApiResult<Carrier>;
    }

    async update(id: string, data: Partial<Carrier>): Promise<ApiResult<Carrier>> {
        const result = await this.request(`/api/v1/carrier/${encodeURIComponent(id)}`, 'PUT', data) as any;
        return result as ApiResult<Carrier>;
    }

    async delete(id: string): Promise<ApiResult<{ deleted: boolean }>> {
        const result = await this.request(`/api/v1/carrier/${encodeURIComponent(id)}`, 'DELETE') as any;
        return result as ApiResult<{ deleted: boolean }>;
    }
}
