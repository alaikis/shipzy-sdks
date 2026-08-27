import { HttpClient } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface BrandingConfig {
    id: string;
    merchant_id: string;
    logo_url?: string;
    company_name?: string;
    registration_no?: string;
    tax_id?: string;
    dpo_email?: string;
    controller_contact?: string;
    created_at: string;
    updated_at: string;
}

export interface JurisdictionRule {
    country_code: string;
    signature_level: string;
    supervisory_authority: string;
    supervisory_authority_url: string;
    retention_days: number;
    policy_url: string;
}

// ============ Upload Client ============

export class UploadClient extends HttpClient {
    async uploadFile(endpoint: string, file: File): Promise<ApiResult<{ url: string }>> {
        const formData = new FormData();
        formData.append('file', file);
        // Route through HttpClient.request so non-ok responses throw
        // (ZymeupAuthError on 401, ZymeupError otherwise) and the auth
        // header / retries / interceptors are applied consistently.
        // The upload endpoint returns the standard ApiResult envelope
        // ({ code, data: { url } }), so request<T> is typed as ApiResult.
        return this.request<ApiResult<{ url: string }>>(endpoint, 'POST', formData, true)
    }
}
