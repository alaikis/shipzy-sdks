import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export type Capability = 'signature' | 'timestamp' | 'identity';

export interface Provider {
    slug: string;
    name: string;
    capabilities: Capability[];
    status: string;
}

export interface ProviderActivation {
    id: string;
    provider_slug: string;
    merchant_id: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface ActivateRequest {
    provider_slug: string;
    [key: string]: any;
}

// ============ Client ============

export class ActivationClient extends HttpClient {
    async listProviders(filter?: { capability?: Capability }): Promise<ApiResult<{ data: Provider[] }>> {
        const q = filter?.capability ? `?capability=${encodeURIComponent(filter.capability)}` : '';
        return this.request(`/api/v1/marketplace/providers${q}`);
    }

    async getProvider(slug: string): Promise<ApiResult<Provider>> {
        return this.request(`/api/v1/marketplace/providers/${encodeURIComponent(slug)}`);
    }

    async list(): Promise<ApiResult<{ data: ProviderActivation[] }>> {
        return this.request('/api/v1/marketplace/activations');
    }

    async get(id: string): Promise<ApiResult<ProviderActivation>> {
        return this.request(`/api/v1/marketplace/activations/${encodeURIComponent(id)}`);
    }

    async activate(req: ActivateRequest): Promise<ApiResult<ProviderActivation>> {
        return this.request('/api/v1/marketplace/activations', 'POST', req);
    }

    async pause(id: string): Promise<ApiResult<{ status: string }>> {
        return this.request(`/api/v1/marketplace/activations/${encodeURIComponent(id)}/pause`, 'POST', {});
    }

    async resume(id: string): Promise<ApiResult<{ status: string }>> {
        return this.request(`/api/v1/marketplace/activations/${encodeURIComponent(id)}/resume`, 'POST', {});
    }

    async revoke(id: string, reason?: string): Promise<ApiResult<{ status: string }>> {
        return this.request(`/api/v1/marketplace/activations/${encodeURIComponent(id)}/revoke`, 'POST', { reason: reason || '' });
    }
}
