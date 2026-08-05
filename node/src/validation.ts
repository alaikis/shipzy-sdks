import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface PhoneVerifyResult {
    valid: boolean;
    formatted: string;
    country_code: string;
}

export interface PhoneFormatResult {
    formatted: string;
}

export interface PostalCodeResult {
    valid: boolean;
    message: string;
    source: string;
}

export interface EmailValidationResult {
    valid: boolean;
    status: string;
    message: string;
    source: string;
    formatted: string;
}

export interface TaxIdValidationResult {
    valid: boolean;
    message: string;
    source: string;
}

// ============ Client ============

export class ValidationClient extends HttpClient {
    constructor(config: ShipzyConfig) {
        super(config);
    }

    async verifyPhone(countryCode: string, phone: string): Promise<ApiResult<PhoneVerifyResult>> {
        return this.request('/api/v1/validation/phone', 'POST', { country_code: countryCode, phone });
    }

    async formatPhone(countryCode: string, phone: string): Promise<ApiResult<PhoneFormatResult>> {
        return this.request('/api/v1/validation/phone/format', 'POST', { country_code: countryCode, phone });
    }

    async validatePostalCode(countryCode: string, code: string): Promise<ApiResult<PostalCodeResult>> {
        return this.request('/api/v1/validation/postal-code', 'POST', { country_code: countryCode, code });
    }

    async validateEmail(email: string): Promise<ApiResult<EmailValidationResult>> {
        return this.request('/api/v1/validation/email', 'POST', { email });
    }

    async validateTaxId(countryCode: string, taxId: string): Promise<ApiResult<TaxIdValidationResult>> {
        return this.request('/api/v1/validation/tax-id', 'POST', { country_code: countryCode, tax_id: taxId });
    }
}
