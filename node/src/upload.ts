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
        const result = await this.request(endpoint, 'POST', formData as unknown as Record<string, unknown>) as any;
        return result as ApiResult<{ url: string }>;
    }

    async brandingUploadLogo(file: File): Promise<ApiResult<{ logo_url: string }>> {
        const result = await this.uploadFile('/api/v1/merchant/branding/logo', file) as any;
        return result as ApiResult<{ logo_url: string }>;
    }
}
