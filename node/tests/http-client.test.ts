import { describe, it, expect } from 'vitest';
import { HttpClient, ZymeupError, ZymeupAuthError, DEFAULT_CONFIG } from '../src/http-client';
import { BASE_URL, skipIfDown, SKIP_REASON } from './live-helpers';

class TestHttpClient extends HttpClient {
    public async testRequest<T>(path: string, method?: string, body?: unknown): Promise<T> {
        return this.request<T>(path, method, body);
    }

    public testBuildQuery(params: Record<string, unknown>): string {
        return this.buildQuery(params);
    }
}

describe('DEFAULT_CONFIG', () => {
    it('has correct default values', () => {
        expect(DEFAULT_CONFIG.baseUrl).toBe('https://api.zymeup.com');
        expect(DEFAULT_CONFIG.timeout).toBe(30000);
        expect(DEFAULT_CONFIG.role).toBe('merchant');
        expect(DEFAULT_CONFIG.maxRetries).toBe(3);
        expect(DEFAULT_CONFIG.retryDelayMs).toBe(1000);
    });
});

describe('ZymeupError', () => {
    it('stores message and statusCode', () => {
        const err = new ZymeupError('not found', 404);
        expect(err.message).toBe('not found');
        expect(err.statusCode).toBe(404);
        expect(err.name).toBe('ZymeupError');
        expect(err).toBeInstanceOf(Error);
    });

    it('is not an AuthError', () => {
        const err = new ZymeupError('forbidden', 403);
        expect(err).not.toBeInstanceOf(ZymeupAuthError);
    });
});

describe('ZymeupAuthError', () => {
    it('defaults to 401', () => {
        const err = new ZymeupAuthError('token expired');
        expect(err.statusCode).toBe(401);
        expect(err.name).toBe('ZymeupAuthError');
        expect(err).toBeInstanceOf(ZymeupError);
        expect(err).toBeInstanceOf(Error);
    });
});

describe('buildQuery', () => {
    let client: TestHttpClient;

    it('builds query string from params', () => {
        client = new TestHttpClient({ token: 'tok' });
        expect(client.testBuildQuery({ page: 1, status: 'active' })).toBe('?page=1&status=active');
    });

    it('skips null and undefined values', () => {
        client = new TestHttpClient({ token: 'tok' });
        expect(client.testBuildQuery({ page: 1, status: null, q: undefined })).toBe('?page=1');
    });

    it('returns empty string for empty params', () => {
        client = new TestHttpClient({ token: 'tok' });
        expect(client.testBuildQuery({})).toBe('');
    });

    it('encodes special characters', () => {
        client = new TestHttpClient({ token: 'tok' });
        const result = client.testBuildQuery({ q: 'hello world' });
        expect(result).toBe('?q=hello%20world');
    });
});

// Live (mock-free) HttpClient behaviour against the running API server.
describe.skipIf(skipIfDown())('HttpClient (LIVE)', () => {
    it('fetches a real public endpoint and returns the ApiResult envelope', async () => {
        const client = new TestHttpClient({ baseUrl: BASE_URL });
        const result = await client.testRequest<Record<string, unknown>>(
            '/api/v1/config/map-provider?region=EU'
        );
        // Authenticated endpoints wrap responses in { code, data, ... }
        expect(result).toHaveProperty('code');
        expect(result).toHaveProperty('data');
    });

    it('throws ZymeupAuthError on 401 for an authenticated endpoint', async () => {
        const client = new TestHttpClient({ baseUrl: BASE_URL });
        await expect(client.testRequest('/api/v1/shipment/epod/list', 'POST', {})).rejects.toThrow(
            ZymeupAuthError
        );
    });

    it('throws ZymeupError on 404', async () => {
        const client = new TestHttpClient({ baseUrl: BASE_URL });
        await expect(client.testRequest('/api/v1/this/does/not/exist')).rejects.toThrow(ZymeupError);
    });
});
