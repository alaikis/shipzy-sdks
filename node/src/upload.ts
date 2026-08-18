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
        const resp = await fetch(`${this.config.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${this.config.token}` },
            body: formData,
        });
        return resp.json();
    }
}
