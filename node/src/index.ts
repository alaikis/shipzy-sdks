export const VERSION = '0.1.0-alpha.1';

export interface ShipzyConfig {
    baseUrl: string;
    token?: string;
    timeout: number;
}

export const DEFAULT_CONFIG: Partial<ShipzyConfig> = {
    baseUrl: 'https://api.shipzy.me',
    timeout: 30000,
};

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
}

export interface SignUrlResponse {
    sign_url: string;
}

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

export class EpodClient {
    private config: ShipzyConfig;

    constructor(config: Partial<ShipzyConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config } as ShipzyConfig;
    }

    setToken(token: string): void {
        this.config.token = token;
    }

    private async request<T>(path: string, method: string = 'GET', body?: unknown): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

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

            if (response.status === 401) {
                throw new ShipzyAuthError('Unauthorized');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ShipzyError(errorData.message || `HTTP ${response.status}`, response.status);
            }

            return response.json();
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async list(params: {
        page?: number;
        pageSize?: number;
        status?: string;
        trackingNo?: string;
    } = {}): Promise<EpodListResponse> {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', String(params.page));
        if (params.pageSize) queryParams.append('page_size', String(params.pageSize));
        if (params.status) queryParams.append('status', params.status);
        if (params.trackingNo) queryParams.append('tracking_no', params.trackingNo);

        const query = queryParams.toString();
        return this.request<EpodListResponse>(`/api/v1/shipment/epod/list${query ? '?' + query : ''}`);
    }

    async get(epodId: string): Promise<EpodDetail> {
        return this.request<EpodDetail>(`/api/v1/shipment/epod/${epodId}`);
    }

    async generateSignUrl(epodId: string): Promise<SignUrlResponse> {
        return this.request<SignUrlResponse>(`/api/v1/shipment/epod/${epodId}/sign`, 'POST');
    }
}

export class ShipzyClient {
    public epod: EpodClient;

    constructor(config: Partial<ShipzyConfig> = {}) {
        this.epod = new EpodClient(config);
    }

    updateToken(token: string): void {
        this.epod.setToken(token);
    }
}
