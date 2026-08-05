export type UserRole = 'merchant' | 'carrier';

export interface RequestInterceptor {
    onRequest?: (url: string, options: RequestInit) => RequestInit | Promise<RequestInit>;
    onResponse?: (response: Response) => Response | Promise<Response>;
    onError?: (error: Error) => void;
}

export interface ZymeupConfig {
    baseUrl: string;
    token?: string;
    timeout: number;
    role?: UserRole;
    carrierCode?: string;
    maxRetries?: number;
    retryDelayMs?: number;
    interceptors?: RequestInterceptor;
}

// Backward compatibility alias
export type ShipzyConfig = ZymeupConfig;

export const DEFAULT_CONFIG: Partial<ZymeupConfig> = {
    baseUrl: 'https://api.zymeup.com',
    timeout: 30000,
    role: 'merchant',
    maxRetries: 3,
    retryDelayMs: 1000,
};

export class ZymeupError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
        this.name = 'ZymeupError';
    }
}

export class ZymeupAuthError extends ZymeupError {
    constructor(message: string) {
        super(message, 401);
        this.name = 'ZymeupAuthError';
    }
}

export class HttpClient {
    protected config: ZymeupConfig;

    constructor(config: Partial<ZymeupConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config } as ZymeupConfig;
    }

    setToken(token: string): void {
        this.config.token = token;
    }

    setConfig(config: Partial<ZymeupConfig>): void {
        if (config.baseUrl) {
            this.config.baseUrl = config.baseUrl;
        }
        if (config.token) {
            this.config.token = config.token;
        }
        if (config.timeout) {
            this.config.timeout = config.timeout;
        }
        if (config.role) {
            this.config.role = config.role;
        }
        if (config.carrierCode) {
            this.config.carrierCode = config.carrierCode;
        }
        if (config.maxRetries !== undefined) {
            this.config.maxRetries = config.maxRetries;
        }
        if (config.retryDelayMs !== undefined) {
            this.config.retryDelayMs = config.retryDelayMs;
        }
        if (config.interceptors !== undefined) {
            this.config.interceptors = config.interceptors;
        }
    }

    protected getAuthHeader(): string {
        if (this.config.role === 'carrier' && this.config.carrierCode && this.config.token) {
            return `Bearer ${this.config.carrierCode}:${this.config.token}`;
        }
        return `Bearer ${this.config.token || ''}`;
    }

    protected async request<T>(path: string, method: string = 'GET', body?: unknown, isFormData?: boolean): Promise<T> {
        const maxRetries = this.config.maxRetries ?? 3;
        const retryDelayMs = this.config.retryDelayMs ?? 1000;
        const interceptor = this.config.interceptors;
        const url = `${this.config.baseUrl.replace(/\/$/, '')}${path}`;

        let lastError: Error | undefined;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            const headers: Record<string, string> = {};
            if (!isFormData) {
                headers['Content-Type'] = 'application/json';
            }
            if (this.config.token) {
                headers['Authorization'] = this.getAuthHeader();
            }

            let options: RequestInit = {
                method,
                headers,
                body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
            };

            if (interceptor?.onRequest) {
                options = await interceptor.onRequest(url, options);
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

            try {
                let response = await fetch(url, {
                    ...options,
                    signal: controller.signal,
                });

                if (interceptor?.onResponse) {
                    response = await interceptor.onResponse(response);
                }

                if (response.status === 401) throw new ZymeupAuthError('Unauthorized');

                if (response.status >= 500 && attempt < maxRetries) {
                    await this.sleep(retryDelayMs * 2 ** attempt);
                    continue;
                }

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new ZymeupError(errorData.message || `HTTP ${response.status}`, response.status);
                }

                return response.json();
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));

                const isNetworkError = lastError.name === 'AbortError' || lastError.message.includes('fetch');
                const isServerError = lastError instanceof ZymeupError && lastError.statusCode >= 500;

                if ((isNetworkError || isServerError) && attempt < maxRetries) {
                    await this.sleep(retryDelayMs * 2 ** attempt);
                    continue;
                }

                if (interceptor?.onError) {
                    interceptor.onError(lastError);
                }

                throw lastError;
            } finally {
                clearTimeout(timeoutId);
            }
        }

        if (interceptor?.onError && lastError) {
            interceptor.onError(lastError);
        }

        throw lastError;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
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
