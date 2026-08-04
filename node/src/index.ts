// ============ Core imports ============

import { HttpClient, ShipzyError, ShipzyAuthError } from './http-client';
import type { ShipzyConfig, UserRole } from './http-client';
import { DEFAULT_CONFIG } from './http-client';

// ============ Public exports ============

export { HttpClient, ShipzyError, ShipzyAuthError, DEFAULT_CONFIG };
export type { ShipzyConfig, UserRole };

// ============ API Result ============

export interface ApiResult<T> {
    code: number;
    data: T;
    message?: string;
}

// ============ EPOD Client ============

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
}

// ============ Public EPOD Client (no auth) ============

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

// ============ Order Client ============

export interface OrderListItem {
    id: string;
    order_no: string;
    status: string;
    customer_name?: string;
    total_amount?: number;
    currency?: string;
    created_at: string;
}

export interface OrderListResponse {
    data: OrderListItem[];
    total: number;
    page: number;
    page_size: number;
}

export interface OrderDetail {
    id: string;
    order_no: string;
    status: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    total_amount?: number;
    currency?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export class OrderClient extends HttpClient {
    async list(params: { page?: number; pageSize?: number; status?: string } = {}): Promise<ApiResult<OrderListResponse>> {
        const q = this.buildQuery({ page: params.page, page_size: params.pageSize, status: params.status });
        return this.request(`/api/v1/order/list${q}`);
    }

    async get(id: string): Promise<ApiResult<OrderDetail>> {
        return this.request(`/api/v1/order/${id}`);
    }

    async create(data: Record<string, unknown>): Promise<ApiResult<OrderDetail>> {
        return this.request('/api/v1/order/create', 'POST', data);
    }

    async createWithDocuments(data: Record<string, unknown>): Promise<ApiResult<OrderDetail & { epod_id?: string; ecmr_id?: string }>> {
        return this.request('/api/v1/order/create-with-documents', 'POST', data);
    }

    async update(id: string, data: Record<string, unknown>): Promise<ApiResult<OrderDetail>> {
        return this.request(`/api/v1/order/${id}/update`, 'POST', data);
    }

    async cancel(id: string): Promise<ApiResult<OrderDetail>> {
        return this.request(`/api/v1/order/${id}/cancel`, 'POST', {});
    }
}

// ============ ECMR Client ============

export interface EcmrListItem {
    id: string;
    document_no: string;
    status: string;
    created_at: string;
}

export interface EcmrListResponse {
    data: EcmrListItem[];
    total: number;
    page: number;
    page_size: number;
}

export class EcmrClient extends HttpClient {
    async list(params: { page?: number; pageSize?: number } = {}): Promise<ApiResult<EcmrListResponse>> {
        const q = this.buildQuery({ page: params.page, page_size: params.pageSize });
        return this.request(`/api/v1/shipment/ecmr/list${q}`);
    }

    async get(id: string): Promise<ApiResult<Record<string, any>>> {
        return this.request(`/api/v1/shipment/ecmr/${id}`);
    }

    async create(data: Record<string, unknown>): Promise<ApiResult<Record<string, any>>> {
        return this.request('/api/v1/shipment/ecmr/create', 'POST', data);
    }

    async generateFromOrder(orderId: string): Promise<ApiResult<Record<string, any>>> {
        return this.request('/api/v1/shipment/ecmr/generate-from-order', 'POST', { order_id: orderId });
    }

    async sign(id: string): Promise<ApiResult<Record<string, any>>> {
        return this.request(`/api/v1/shipment/ecmr/${id}/sign`, 'POST', {});
    }

    async pdf(id: string): Promise<ApiResult<{ status: string; pdf_url?: string }>> {
        return this.request(`/api/v1/shipment/ecmr/${id}/pdf`, 'POST', {});
    }
}

// ============ Address Client (Merchant) ============

export interface Address {
    id: string;
    full_name?: string;
    company_name?: string;
    street?: string;
    house_number?: string;
    postal_code?: string;
    city?: string;
    country_code?: string;
    phone?: string;
    email?: string;
    is_default?: boolean;
}

export interface AddressListResponse {
    data: Address[];
    total: number;
}

export class AddressClient extends HttpClient {
    async list(params: Record<string, unknown> = {}): Promise<ApiResult<AddressListResponse>> {
        return this.request('/api/v1/merchant/addresses/list', 'POST', params);
    }

    async create(data: Record<string, unknown>): Promise<ApiResult<Address>> {
        return this.request('/api/v1/merchant/addresses/create', 'POST', data);
    }

    async update(id: string, data: Record<string, unknown>): Promise<ApiResult<Address>> {
        return this.request(`/api/v1/merchant/addresses/${id}/update`, 'POST', data);
    }

    async delete(id: string): Promise<ApiResult<{ deleted: boolean }>> {
        return this.request(`/api/v1/merchant/addresses/${id}/delete`, 'POST', {});
    }

    async setDefault(id: string): Promise<ApiResult<Address>> {
        return this.request(`/api/v1/merchant/addresses/${id}/set-default`, 'POST', {});
    }
}

// ============ Carrier EPOD Client ============

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

// ============ Carrier Address Client ============

export class CarrierAddressClient extends HttpClient {
    async list(params: Record<string, unknown> = {}): Promise<ApiResult<AddressListResponse>> {
        return this.request('/api/v1/carrier/sdk/addresses/list', 'POST', params);
    }

    async create(data: Record<string, unknown>): Promise<ApiResult<Address>> {
        return this.request('/api/v1/carrier/sdk/addresses/create', 'POST', data);
    }

    async update(id: string, data: Record<string, unknown>): Promise<ApiResult<Address>> {
        return this.request(`/api/v1/carrier/sdk/addresses/${id}/update`, 'POST', data);
    }

    async delete(id: string): Promise<ApiResult<{ deleted: boolean }>> {
        return this.request(`/api/v1/carrier/sdk/addresses/${id}/delete`, 'POST', {});
    }

    async setDefault(id: string): Promise<ApiResult<Address>> {
        return this.request(`/api/v1/carrier/sdk/addresses/${id}/set-default`, 'POST', {});
    }
}

// ============ VERSION ============

export const VERSION = '2.0.0';

// ============ Module Imports ============

import { PickupPointClient } from './pickup-points';
import { ShipmentClient } from './shipment';
import { ParcelClient } from './parcel';
import { AgeVerificationClient } from './age-verification';
import { ActivationClient } from './activation';
import { ProductClient } from './product';
import { MerchantAddressClient } from './merchant-address';
import { TrackingClient } from './tracking';
import { FinanceClient } from './finance';
import { ComplianceClient } from './compliance';
import { CPSCClient } from './lib/cpsc/client';
import { DELIVERY_MODES, NOTIFICATION_CHANNELS, validateChannelRequirements } from './notification';
import type { DeliveryMode, ChannelType, NotificationResult } from './notification';
import { CarrierClient } from './carrier';
import { PlatformConfigClient } from './platform';
import { UploadClient } from './upload';

// ============ Main SDK ============

export class ShipzyClient {
    public epod: EpodClient;
    public order: OrderClient;
    public ecmr: EcmrClient;
    public address: AddressClient;
    public carrierEpod: CarrierEpodClient;
    public carrierAddress: CarrierAddressClient;
    public pickupPoints: PickupPointClient;
    public shipment: ShipmentClient;
    public parcel: ParcelClient;
    public ageVerification: AgeVerificationClient;
    public activation: ActivationClient;
    public product: ProductClient;
    public merchantAddress: MerchantAddressClient;
    public tracking: TrackingClient;
    public finance: FinanceClient;
    public compliance: ComplianceClient;
    public publicEpod: PublicEpodClient;
    public cpsc: CPSCClient;
    public role: UserRole;
    public carrier: CarrierClient;
    public platformConfig: PlatformConfigClient;
    public upload: UploadClient;
    private config: ShipzyConfig;

    constructor(config: Partial<ShipzyConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config } as ShipzyConfig;
        this.role = this.config.role || 'merchant';
        this.epod = new EpodClient(this.config);
        this.order = new OrderClient(this.config);
        this.ecmr = new EcmrClient(this.config);
        this.address = new AddressClient(this.config);
        this.carrierEpod = new CarrierEpodClient(this.config);
        this.carrierAddress = new CarrierAddressClient(this.config);
        this.pickupPoints = new PickupPointClient(this.config);
        this.shipment = new ShipmentClient(this.config);
        this.parcel = new ParcelClient(this.config);
        this.ageVerification = new AgeVerificationClient(this.config);
        this.activation = new ActivationClient(this.config);
        this.product = new ProductClient(this.config);
        this.merchantAddress = new MerchantAddressClient(this.config);
        this.tracking = new TrackingClient(this.config);
        this.finance = new FinanceClient(this.config);
        this.compliance = new ComplianceClient(this.config);
        this.publicEpod = new PublicEpodClient(this.config.baseUrl);
        this.cpsc = new CPSCClient(this.config);
        this.carrier = new CarrierClient(this.config);
        this.platformConfig = new PlatformConfigClient(this.config);
        this.upload = new UploadClient(this.config);
    }

    updateToken(token: string): void {
        this.config.token = token;
        this.epod.setToken(token);
        this.order.setToken(token);
        this.ecmr.setToken(token);
        this.address.setToken(token);
        this.carrierEpod.setToken(token);
        this.carrierAddress.setToken(token);
        this.pickupPoints.setToken(token);
        this.shipment.setToken(token);
        this.parcel.setToken(token);
        this.ageVerification.setToken(token);
        this.activation.setToken(token);
        this.product.setToken(token);
        this.merchantAddress.setToken(token);
        this.tracking.setToken(token);
        this.finance.setToken(token);
        this.compliance.setToken(token);
        this.cpsc.setToken(token);
        this.carrier.setToken(token);
        this.platformConfig.setToken(token);
        this.upload.setToken(token);
    }

    updateConfig(config: Partial<ShipzyConfig>): void {
        if (config.baseUrl) {
            this.config.baseUrl = config.baseUrl;
        }
        if (config.role) {
            this.role = config.role;
            this.config.role = config.role;
        }
        if (config.carrierCode) {
            this.config.carrierCode = config.carrierCode;
        }
        // 同步更新所有子客户端的配置
        this.epod.setConfig(config);
        this.order.setConfig(config);
        this.ecmr.setConfig(config);
        this.address.setConfig(config);
        this.carrierEpod.setConfig(config);
        this.carrierAddress.setConfig(config);
        if (this.pickupPoints) this.pickupPoints.setConfig(config);
        if (this.parcel) this.parcel.setConfig(config);
        if (this.ageVerification) this.ageVerification.setConfig(config);
        if (this.activation) this.activation.setConfig(config);
        if (this.product) this.product.setConfig(config);
        if (this.merchantAddress) this.merchantAddress.setConfig(config);
        if (this.tracking) this.tracking.setConfig(config);
        if (this.finance) this.finance.setConfig(config);
        if (this.compliance) this.compliance.setConfig(config);
        if (this.cpsc) this.cpsc.setConfig(config);
        if (this.carrier) this.carrier.setConfig(config);
        if (this.platformConfig) this.platformConfig.setConfig(config);
        if (this.upload) this.upload.setConfig(config);
    }

    isMerchant(): boolean {
        return this.role === 'merchant';
    }

    isCarrier(): boolean {
        return this.role === 'carrier';
    }
}

// ============ Re-exports ============

export { DELIVERY_MODES, NOTIFICATION_CHANNELS, validateChannelRequirements };
export type { DeliveryMode, ChannelType, NotificationResult };
export type { PickupPoint, PickupPointType, PickupPointStatus, CreatePickupPointRequest, PickupPointListResponse } from './pickup-points';
export type { Shipment, ShipmentDetail, CreateShipmentRequest, ShipmentListResponse } from './shipment';
export type { Parcel } from './parcel';
export type { AgeVerificationEvent, AgeVerificationMethod, AgeMinAge, CreateAgeVerificationRequest } from './age-verification';
export type { Provider, ProviderActivation, Capability, ActivateRequest } from './activation';
export type { Product, ProductStatus, ProductCategory, CreateProductRequest, ProductListResponse } from './product';
export type { TenantAddress, TenantAddressListResponse } from './merchant-address';
export type { TrackingEvent, TrackingDetail, TrackingListItem, TrackingListResponse } from './tracking';
export type { Invoice, Subscription } from './finance';
export type { CustomsDeclaration, CreateCustomsRequest, ComplianceCheckRequest, ComplianceCheckResult, CountryRequirements } from './compliance';
export type {
    CertificateType,
    IdentifierType,
    LabType,
    POCType,
    ProductIdentifier,
    Manufacturer,
    Lab,
    PointOfContact,
    CoreProduct,
    ProductEntry,
    TradePartyEntry,
    Collection,
    APIResponse,
    CollectionsResponse,
    ImportLogResponse,
    ExportResponse,
    TradePartyListResponse,
    ExportFilter,
    CertificateQuery,
    CPSCSettings,
    SaveCredentialRequest,
    ImportRequest,
    CertificatesRequest
} from './lib/cpsc/types';
export { CPSCClient } from './lib/cpsc/client';
export type { Carrier } from './carrier';
export type { PlatformConfig } from './platform';

// ============ RN (React Native / Expo) ============
// Note: RN module is not re-exported from the main entry point to avoid
// requiring react-native as a dependency. Import directly from '@shipzy/sdk/rn'.
// export { ShipzyProvider, useShipzy, EpodList, EpodDetail, EpodCreate, EpodSignature } from './rn';
// export type { EpodListProps, EpodDetailProps, EpodCreateProps, EpodSignatureProps } from './rn';
