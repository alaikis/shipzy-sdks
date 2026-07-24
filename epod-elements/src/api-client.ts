export interface EpodApiClientConfig {
    baseUrl: string;
    token?: string;
    tenantType?: 'merchant' | 'carrier';
}

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

export class EpodApiClient {
    private baseUrl: string;
    private token?: string;
    private tenantType: string;

    constructor(config: EpodApiClientConfig) {
        this.baseUrl = config.baseUrl.replace(/\/$/, '');
        this.token = config.token;
        this.tenantType = config.tenantType || 'merchant';
    }

    setToken(token: string) {
        this.token = token;
    }

    private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers as Record<string, string>,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new EpodAuthError('Unauthorized');
            }
            const error = await response.json().catch(() => ({}));
            throw new EpodApiError(error.message || `HTTP ${response.status}`, response.status);
        }

        return response.json().catch(() => ({})) as Promise<T>;
    }

    async list(params: {
        page?: number;
        page_size?: number;
        status?: string;
        tracking_no?: string;
    } = {}): Promise<EpodListResponse> {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', String(params.page));
        if (params.page_size) searchParams.append('page_size', String(params.page_size));
        if (params.status) searchParams.append('status', params.status);
        if (params.tracking_no) searchParams.append('tracking_no', params.tracking_no);

        const query = searchParams.toString();
        const path = `/api/v1/shipment/epod/list${query ? '?' + query : ''}`;
        return this.request<EpodListResponse>(path);
    }

    async get(epodId: string): Promise<EpodDetail> {
        return this.request<EpodDetail>(`/api/v1/shipment/epod/${epodId}`);
    }

    async generateSignUrl(epodId: string): Promise<{ sign_url: string }> {
        return this.request<{ sign_url: string }>(`/api/v1/shipment/epod/${epodId}/sign`, {
            method: 'POST',
        });
    }
}

export class EpodAuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EpodAuthError';
    }
}

export class EpodApiError extends Error {
    code: number;
    constructor(message: string, code: number) {
        super(message);
        this.name = 'EpodApiError';
        this.code = code;
    }
}
