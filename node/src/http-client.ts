export type UserRole = 'merchant' | 'carrier';

export interface ShipzyConfig {
    baseUrl: string;
    token?: string;
    timeout: number;
    role?: UserRole;
    carrierCode?: string;
}

export const DEFAULT_CONFIG: Partial<ShipzyConfig> = {
    baseUrl: 'https://api.shipzy.me',
    timeout: 30000,
    role: 'merchant',
};

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

export class HttpClient {
    protected config: ShipzyConfig;

    constructor(config: Partial<ShipzyConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config } as ShipzyConfig;
    }

    setToken(token: string): void {
        this.config.token = token;
    }

    protected getAuthHeader(): string {
        if (this.config.role === 'carrier' && this.config.carrierCode && this.config.token) {
            return `Bearer ${this.config.carrierCode}:${this.config.token}`;
        }
        return `Bearer ${this.config.token || ''}`;
    }

    protected async request<T>(path: string, method: string = 'GET', body?: unknown): Promise<T> {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (this.config.token) {
            headers['Authorization'] = this.getAuthHeader();
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
