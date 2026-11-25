import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface TrackingEvent {
    remark: string;
    event_time: string;
    event_type: string;
    location?: {
        lat: number;
        lng: number;
        label?: string;
    };
    // Non-API scrape metadata (optional, backward compatible; omitted when absent).
    data_source?: string;
    last_scrape_at?: string;
    scrape_status?: string;
    raw_status_text?: string;
}

export interface TrackingDetail {
    tracking_no: string;
    status: string;
    carrier_name: string;
    latest_event?: string;
    estimated_delivery?: string;
    actual_delivery?: string;
    origin?: {
        full_name?: string;
        city?: string;
        country_code?: string;
        latitude?: number;
        longitude?: number;
    };
    destination?: {
        full_name?: string;
        city?: string;
        country_code?: string;
        latitude?: number;
        longitude?: number;
    };
    events: TrackingEvent[];
    // Non-API scrape metadata (optional, backward compatible; omitted when absent).
    data_source?: string;
    last_scrape_at?: string;
    scrape_status?: string;
    raw_status_text?: string;
    // EU compliance — public view (Change: eu-tracking-compliance-integration; omitted when absent).
    eu_compliance?: TrackingEuCompliancePublic;
}

export interface TrackingListItem {
    tracking_no: string;
    status: string;
    carrier_name: string;
    latest_event?: string;
    updated_at: string;
    // Non-API scrape metadata (optional, backward compatible; omitted when absent).
    data_source?: string;
    last_scrape_at?: string;
    scrape_status?: string;
}

export interface TrackingListResponse {
    data: TrackingListItem[];
    total: number;
    page: number;
    page_size: number;
}

// ============ EU Compliance (Change: eu-tracking-compliance-integration) ============

/**
 * EU compliance fields — public view (carbon + customs only).
 * GDPR governance fields (data_retention_until / lawful_basis / personal_data_minimized)
 * are NEVER present in the public endpoint response.
 */
export interface TrackingEuCompliancePublic {
    co2e_kg?: number;
    co2e_methodology?: string;      // glec | env_freight | carrier_reported | estimated
    co2e_calculated_at?: string;
    co2e_source_provider?: string;  // transporeon | carrier_reported | ship24 | platform
    customs_mrn?: string;
    customs_eori?: string;
    transit_document_type?: string; // t1 | t2 | t2f | tir | none
    transit_document_ref?: string;
    ens_declaration_ref?: string;
}

/** EU compliance fields — merchant/admin view (full, incl. GDPR governance group). */
export interface TrackingEuCompliance extends TrackingEuCompliancePublic {
    data_retention_until?: string;
    lawful_basis?: string;          // contract | legal_obligation | legitimate_interest | consent
    personal_data_minimized?: boolean;
    compliance_metadata?: string;
}

/** Order-level CO2e summary (GET /order/:id/co2e-summary). */
export interface OrderCo2eSummary {
    order_id: string;
    total_co2e_kg: number;
    by_methodology: Record<string, number>;
    coverage: { with_value: number; total: number };
}

// ============ Signer Identity (eID) / eSeal / Evidence (Change: base-full-process) ============

/** eIDAS LoA (assurance level). */
export type AssuranceLevel = 'low' | 'substantial' | 'high';

/** Identity verification method. */
export type IdentityMethod = 'eid' | 'wallet' | 'video' | 'otp';

/** Identity verification status. */
export type IdentityStatus = 'pending' | 'verified' | 'failed';

/** Signer identity verification record (platform stores the verification
 *  reference only — raw identity data stays at the QTSP). */
export interface IdentityVerification {
    verification_id: string;
    provider: string; // signicat_id | itsme | bankid | eu_digital_wallet(draft)
    method: IdentityMethod;
    assurance_level: AssuranceLevel;
    /** HMAC pseudonymous signer reference (irreversible) */
    signer_ref: string;
    qtsp_verification_ref?: string;
    verified_at?: string;
    status: IdentityStatus;
}

/** QTSP identity verification session (async: redirect/QR). */
export interface IdentityVerifySession {
    verification_id: string;
    redirect_url?: string;
    qr_code_payload?: string;
    status: string;
    expires_at?: string;
}

/** Signer type for eSeal (legal entity) signing. */
export type SignerType = 'person' | 'legal_entity';

/** Evidence bundle schema version (M1/M2 dual-read). */
export type EvidenceSchemaVersion = 'phase-b-m1-v1' | 'm2-v1';

/** Platform self-hosted RFC3161 TSA timestamp token. */
export interface TSATimestamp {
    token: string;
    time: string;
    root_hash?: string;
}

// ============ Client ============

export class TrackingClient extends HttpClient {
    async detail(trackingNo: string): Promise<ApiResult<TrackingDetail>> {
        return this.request(`/api/v1/tracking/${encodeURIComponent(trackingNo)}`);
    }

    async list(params: {
        page?: number;
        pageSize?: number;
        status?: string;
        trackingNo?: string;
    } = {}): Promise<ApiResult<TrackingListResponse>> {
        const q = this.buildQuery({ page: params.page, page_size: params.pageSize, status: params.status, tracking_no: params.trackingNo });
        const basePath = this.config.role === 'carrier' ? '/api/v1/carrier/tracking/list' : '/api/v1/merchant/tracking/list';
        return this.request(`${basePath}${q}`);
    }
}
