import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface CustomsDeclaration {
    id: string;
    shipment_id: string;
    hs_code: string;
    description: string;
    origin_country: string;
    quantity: number;
    unit_value: number;
    currency: string;
    weight?: number;
    notes?: string;
    status: 'pending' | 'submitted' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
}

export interface CreateCustomsRequest {
    shipment_id: string;
    declarations: {
        hs_code: string;
        description: string;
        origin_country: string;
        quantity: number;
        unit_value: number;
        currency: string;
        weight?: number;
        notes?: string;
    }[];
}

export interface ComplianceCheckRequest {
    recipient_country: string;
    sender_country: string;
    parcels: {
        contents: string;
        value: number;
        quantity: number;
        weight?: number;
        hs_code?: string;
    }[];
}

export interface ComplianceCheckResult {
    compliant: boolean;
    restrictions: {
        type: 'prohibited' | 'restricted' | 'requires_license';
        item: string;
        message: string;
    }[];
    required_documents: string[];
    tips: string[];
}

export interface DocumentRequirement {
    type: string;
    description: string;
    required: boolean;
}

export interface CountryRequirements {
    country_code: string;
    restrictions: string[];
    required_documents: DocumentRequirement[];
    notes: string;
}

// ============ Client ============

export class ComplianceClient extends HttpClient {
    async createCustoms(data: CreateCustomsRequest): Promise<ApiResult<CustomsDeclaration>> {
        return this.request('/api/v1/compliance/customs', 'POST', data);
    }

    async getCustoms(id: string): Promise<ApiResult<CustomsDeclaration>> {
        return this.request(`/api/v1/compliance/customs/${encodeURIComponent(id)}`);
    }

    async check(data: ComplianceCheckRequest): Promise<ApiResult<ComplianceCheckResult>> {
        return this.request('/api/v1/compliance/check', 'POST', data);
    }

    async getCountryRequirements(countryCode: string): Promise<ApiResult<CountryRequirements>> {
        return this.request(`/api/v1/compliance/requirements/${encodeURIComponent(countryCode)}`);
    }

    async validateHsCode(hsCode: string): Promise<ApiResult<{ valid: boolean; description?: string }>> {
        return this.request(`/api/v1/compliance/hscode/${encodeURIComponent(hsCode)}/validate`);
    }
}
