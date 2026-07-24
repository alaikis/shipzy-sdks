import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export type AgeVerificationMethod = 'visual' | 'id_scan_no_copy' | 'digital_id_wallet' | 'other';
export type AgeMinAge = 18 | 21 | 25;

export interface AgeVerificationEvent {
    id: string;
    merchant_id: string;
    parcel_id: string;
    order_id?: string;
    epod_id?: string;
    method: AgeVerificationMethod;
    pass: boolean;
    min_age_required: number;
    checker_user_id: string;
    checked_at: string;
    remark?: string;
    country_code?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateAgeVerificationRequest {
    parcel_id: string;
    order_id?: string;
    epod_id?: string;
    method: AgeVerificationMethod;
    pass: boolean;
    min_age_required: number;
    remark?: string;
    country_code?: string;
}

// ============ Client ============

export class AgeVerificationClient extends HttpClient {
    async create(req: CreateAgeVerificationRequest): Promise<ApiResult<AgeVerificationEvent>> {
        return this.request('/api/v1/age-verifications', 'POST', req);
    }

    async listByParcel(parcelId: string): Promise<ApiResult<{ data: AgeVerificationEvent[] }>> {
        return this.request(`/api/v1/age-verifications?parcel_id=${encodeURIComponent(parcelId)}`);
    }

    async listByOrder(orderId: string): Promise<ApiResult<{ data: AgeVerificationEvent[] }>> {
        return this.request(`/api/v1/age-verifications?order_id=${encodeURIComponent(orderId)}`);
    }
}
