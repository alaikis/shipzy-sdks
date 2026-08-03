import { HttpClient } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface PlatformConfig {
    id: string;
    key: string;
    value: string;
    is_secret: boolean;
    category: string;
    description: string;
    updated_at: string;
}

// ============ Platform Config Client ============

export class PlatformConfigClient extends HttpClient {
    async list(): Promise<ApiResult<PlatformConfig[]>> {
        const result = await this.request('/api/v1/admin/platform-configs') as any;
        return result as ApiResult<PlatformConfig[]>;
    }

    async update(id: string, data: Record<string, unknown>): Promise<ApiResult<PlatformConfig>> {
        const result = await this.request(`/api/v1/admin/platform-configs/${encodeURIComponent(id)}`, 'PUT', data) as any;
        return result as ApiResult<PlatformConfig>;
    }
}
