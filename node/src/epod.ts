import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface EpodListItem {
    id: string;
    tracking_no: string;
    status: string;
    recipient_name?: string;
    created_at: string;
}

export interface EpodListResponse {
    data: EpodListItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface EpodDetail {
    id: string;
    tracking_no: string;
    status: string;
    recipient_name?: string;
    recipient_phone?: string;
    delivery_address?: Record<string, any>;
    sender_address?: Record<string, any>;
    proof_type?: string;
    created_at: string;
    updated_at: string;
    sign_url?: string;
    evidence_hash?: string;
    document_hash?: string;
    signature_data?: string;
    photo_url?: string;
}

export interface SignUrlResponse {
    sign_url: string;
}

// ============ Client ============

export class EpodClient extends HttpClient {
    async list(params: { page?: number; pageSize?: number; status?: string; trackingNo?: string } = {}): Promise<ApiResult<EpodListResponse>> {
        const q = this.buildQuery({ page: params.page, page_size: params.pageSize, status: params.status, tracking_no: params.trackingNo });
        return this.request(`/api/v1/shipment/epod/list${q}`);
    }

    async get(id: string): Promise<ApiResult<EpodDetail>> {
        return this.request(`/api/v1/shipment/epod/${id}`);
    }

    async create(data: Record<string, unknown>): Promise<ApiResult<EpodDetail>> {
        return this.request('/api/v1/shipment/epod/create', 'POST', data);
    }

    async generateFromOrder(orderId: string, options: Record<string, unknown> = {}): Promise<ApiResult<EpodDetail>> {
        return this.request('/api/v1/shipment/epod/generate-from-order', 'POST', { order_id: orderId, ...options });
    }

    async update(id: string, data: Record<string, unknown>): Promise<ApiResult<EpodDetail>> {
        return this.request(`/api/v1/shipment/epod/${id}/update`, 'PUT', data);
    }

    async deliver(id: string, data: Record<string, unknown> = {}): Promise<ApiResult<SignUrlResponse & { sign_token_expires_at?: string }>> {
        return this.request(`/api/v1/shipment/epod/${id}/delivery`, 'POST', data);
    }

    async fail(id: string, data: { remark: string }): Promise<ApiResult<EpodDetail>> {
        return this.request(`/api/v1/shipment/epod/${id}/fail`, 'POST', data);
    }

    async captureProof(id: string, data: Record<string, unknown>): Promise<ApiResult<EpodDetail>> {
        return this.request(`/api/v1/shipment/epod/${id}/capture-proof`, 'POST', data);
    }

    async verify(id: string): Promise<ApiResult<{ verified: boolean; error?: string }>> {
        return this.request(`/api/v1/shipment/epod/${id}/verify`, 'POST', {});
    }

    async generateSignUrl(id: string): Promise<ApiResult<SignUrlResponse>> {
        return this.request(`/api/v1/shipment/epod/${id}/sign`, 'POST', {});
    }

    async generatePdf(id: string): Promise<ApiResult<{ pdf_url?: string }>> {
        return this.request(`/api/v1/shipment/epod/${id}/pdf`, 'POST', {});
    }

    async uploadPhoto(id: string, file: File): Promise<ApiResult<{ photo_url: string }>> {
        const formData = new FormData();
        formData.append('file', file);
        return this.request(`/api/v1/shipment/epod/${id}/upload-photo`, 'POST', formData, true) as Promise<ApiResult<{ photo_url: string }>>;
    }
}
