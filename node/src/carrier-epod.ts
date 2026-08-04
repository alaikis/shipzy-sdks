import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';
import type { EpodListResponse, EpodDetail } from './epod';

// ============ Client ============

export class CarrierEpodClient extends HttpClient {
    async list(params: { page?: number; pageSize?: number; status?: string } = {}): Promise<ApiResult<EpodListResponse>> {
        const q = this.buildQuery({ page: params.page, page_size: params.pageSize, status: params.status });
        return this.request(`/api/v1/carrier/epod/list${q}`);
    }

    async get(id: string): Promise<ApiResult<EpodDetail>> {
        return this.request(`/api/v1/carrier/epod/${id}`);
    }

    async deliver(id: string, data: Record<string, unknown> = {}): Promise<ApiResult<EpodDetail>> {
        return this.request(`/api/v1/carrier/epod/${id}/delivery`, 'POST', data);
    }

    async fail(id: string, data: { remark: string }): Promise<ApiResult<EpodDetail>> {
        return this.request(`/api/v1/carrier/epod/${id}/fail`, 'POST', data);
    }

    async captureProof(id: string, data: Record<string, unknown>): Promise<ApiResult<EpodDetail>> {
        return this.request(`/api/v1/carrier/epod/${id}/capture-proof`, 'POST', data);
    }

    async uploadPhoto(id: string, data: { photo_url: string }): Promise<ApiResult<EpodDetail>> {
        return this.request(`/api/v1/carrier/epod/${id}/photo`, 'POST', data);
    }
}
