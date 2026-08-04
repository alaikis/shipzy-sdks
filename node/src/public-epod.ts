import { DEFAULT_CONFIG } from './http-client';

// ============ Types ============

export interface PublicSignDetail {
    tracking_no: string;
    recipient_name: string;
    delivery_address_summary: string;
    destination_country_code: string;
    policy_url: string;
    policy_version_hash: string;
    signature_level_required: string;
    allowed_proof_types: string[];
    signature_waived: boolean;
    expires_at: string;
}

export interface PublicConsentResponse {
    consent_id: string;
    policy_version_hash: string;
}

export interface PublicCaptureResponse {
    evidence_hash: string;
    status: string;
    hash_locked: boolean;
}

// ============ Client ============

/**
 * PublicEpodClient provides access to public EPOD signing endpoints.
 * These endpoints use token-based auth (sign_token) and do not require API keys.
 */
export class PublicEpodClient {
    private baseUrl: string;

    constructor(baseUrl: string = DEFAULT_CONFIG.baseUrl!) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }

    async getSignDetail(signToken: string): Promise<PublicSignDetail> {
        const response = await fetch(`${this.baseUrl}/api/v1/open/epod/sign/${signToken}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    }

    async getPolicy(signToken: string, lang = 'en'): Promise<any> {
        const response = await fetch(`${this.baseUrl}/api/v1/open/epod/sign/${signToken}/policy?lang=${lang}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    }

    async recordConsent(signToken: string, consentTypes: string[], policyVersionHash: string): Promise<PublicConsentResponse> {
        const response = await fetch(`${this.baseUrl}/api/v1/open/epod/sign/${signToken}/consent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ consent_types: consentTypes, policy_version_hash: policyVersionHash }),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    }

    async captureSignature(signToken: string, consentId: string, signatureData: string, proofType = 'signature'): Promise<PublicCaptureResponse> {
        const response = await fetch(`${this.baseUrl}/api/v1/open/epod/sign/${signToken}/capture`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ consent_id: consentId, signature_data: signatureData, proof_type: proofType }),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    }
}
