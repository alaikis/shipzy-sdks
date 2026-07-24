export const VERSION = '1.0.0';

// ============ Config ============

export interface ShipzyConfig {
    baseUrl: string;
    token?: string;
    timeout: number;
}

export const DEFAULT_CONFIG: Partial<ShipzyConfig> = {
    baseUrl: 'https://api.shipzy.me',
    timeout: 30000,
};

// ============ Errors ============

export class ShipzyError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = 'ShipzyError';
    }
}

export class ShipzyAuthError extends ShipzyError {
    constructor(message: string) {
        super(message, 401);
        this.name = 'ShipzyAuthError';
    }
}

// ============ HTTP Client Base ============

class HttpClient {
    protected config: ShipzyConfig;

    constructor(config: Partial<ShipzyConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config } as ShipzyConfig;
    }

    setToken(token: string): void {
        this.config.token = token;
    }

    protected async request<T>(path: string, method: string = 'GET', body?: unknown): Promise<T> {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (this.config.token) {
            headers['Authorization'] = `Bearer ${this.config.token}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
            const response = await fetch(`${this.config.baseUrl.replace(/\/$/, '')}${path}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
            });

            if (response.status === 401) throw new ShipzyAuthError('Unauthorized');
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ShipzyError(errorData.message || `HTTP ${response.status}`, response.status);
            }

            return response.json();
        } finally {
            clearTimeout(timeoutId);
        }
    }

    protected buildQuery(params: Record<string, unknown>): string {
        const parts: string[] = [];
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
                parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
            }
        }
        return parts.length ? '?' + parts.join('&') : '';
    }
}

// ============ Types ============

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

export interface SignUrlResponse {
    sign_url: string;
}

export interface ShipmentDetail {
    id: string;
    tracking_no?: string;
    status?: string;
    created_at: string;
}

export interface ApiResult<T> {
    code: number;
    data: T;
    message?: string;
}

// ============ EPOD Client ============

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

// ============ Main SDK ============

export class ShipzyClient {
    public epod: EpodClient;
    public order: OrderClient;
    public ecmr: EcmrClient;
    public address: AddressClient;
    public carrierEpod: CarrierEpodClient;
    public carrierAddress: CarrierAddressClient;

    constructor(config: Partial<ShipzyConfig> = {}) {
        this.epod = new EpodClient(config);
        this.order = new OrderClient(config);
        this.ecmr = new EcmrClient(config);
        this.address = new AddressClient(config);
        this.carrierEpod = new CarrierEpodClient(config);
        this.carrierAddress = new CarrierAddressClient(config);
    }

    updateToken(token: string): void {
        this.epod.setToken(token);
        this.order.setToken(token);
        this.ecmr.setToken(token);
        this.address.setToken(token);
        this.carrierEpod.setToken(token);
        this.carrierAddress.setToken(token);
    }

    updateConfig(config: Partial<ShipzyConfig>): void {
        if (config.baseUrl) {
            this.epod.config.baseUrl = config.baseUrl;
            this.order.config.baseUrl = config.baseUrl;
            this.ecmr.config.baseUrl = config.baseUrl;
            this.address.config.baseUrl = config.baseUrl;
            this.carrierEpod.config.baseUrl = config.baseUrl;
            this.carrierAddress.config.baseUrl = config.baseUrl;
        }
    }
}
