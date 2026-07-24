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

    async deliver(id: string, data: Record<string, unknown> = {}): Promise<ApiResult<EpodDetail>> {
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

    async generatePdf(id: string): Promise<ApiResult<{ status: string; pdf_url?: string }>> {
        return this.request(`/api/v1/shipment/epod/${id}/pdf`, 'POST', {});
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

export const VERSION = '1.1.1';

// ============ Module Imports ============

import { PickupPointClient } from './pickup-points';
import { ShipmentClient } from './shipment';
import { ParcelClient } from './parcel';
import { AgeVerificationClient } from './age-verification';
import { ActivationClient } from './activation';
import { ProductClient } from './product';
import { MerchantAddressClient } from './merchant-address';
import { DELIVERY_MODES, NOTIFICATION_CHANNELS, validateChannelRequirements } from './notification';
import type { DeliveryMode, ChannelType, NotificationResult } from './notification';

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
    public role: UserRole;
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

// ============ epod-elements (browser-only) ============
// Re-export for convenience; users can also import from '@shipzy/sdk/epod-elements'

export { Epod, EpodApiClient, EpodAuthError, EpodApiError, epodAuth, EpodAuthManager, registerEpodElements } from './epod-elements';
export type { ShowListOptions, ShowDetailOptions, ShowCreateOptions, ShowSignatureOptions } from './epod-elements';
export type { EpodApiClientConfig } from './epod-elements';
export type { AuthState } from './epod-elements';
