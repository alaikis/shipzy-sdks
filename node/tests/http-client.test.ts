import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient, ShipzyError, ShipzyAuthError, DEFAULT_CONFIG } from '../src/http-client';

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
        expect(DEFAULT_CONFIG.baseUrl).toBe('https://api.shipzy.me');
        expect(DEFAULT_CONFIG.timeout).toBe(30000);
        expect(DEFAULT_CONFIG.role).toBe('merchant');
        expect(DEFAULT_CONFIG.maxRetries).toBe(3);
        expect(DEFAULT_CONFIG.retryDelayMs).toBe(1000);
    });
});

describe('ShipzyError', () => {
    it('stores message and statusCode', () => {
        const err = new ShipzyError('not found', 404);
        expect(err.message).toBe('not found');
        expect(err.statusCode).toBe(404);
        expect(err.name).toBe('ShipzyError');
        expect(err).toBeInstanceOf(Error);
    });

    it('is not an AuthError', () => {
        const err = new ShipzyError('forbidden', 403);
        expect(err).not.toBeInstanceOf(ShipzyAuthError);
    });
});

describe('ShipzyAuthError', () => {
    it('defaults to 401', () => {
        const err = new ShipzyAuthError('token expired');
        expect(err.statusCode).toBe(401);
        expect(err.name).toBe('ShipzyAuthError');
        expect(err).toBeInstanceOf(ShipzyError);
        expect(err).toBeInstanceOf(Error);
    });
});

describe('buildQuery', () => {
    let client: TestHttpClient;

    beforeEach(() => {
        client = new TestHttpClient({ token: 'tok' });
    });

    it('builds query string from params', () => {
        expect(client.testBuildQuery({ page: 1, status: 'active' })).toBe('?page=1&status=active');
    });

    it('skips null and undefined values', () => {
        expect(client.testBuildQuery({ page: 1, status: null, q: undefined })).toBe('?page=1');
    });

    it('returns empty string for empty params', () => {
        expect(client.testBuildQuery({})).toBe('');
    });

    it('encodes special characters', () => {
        const result = client.testBuildQuery({ q: 'hello world' });
        expect(result).toBe('?q=hello%20world');
    });
});

describe('HttpClient request (mocked fetch)', () => {
    const mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);

    beforeEach(() => {
        mockFetch.mockReset();
    });

    it('sends GET request with auth header', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ code: 0, data: 'ok' }),
        });

        const client = new TestHttpClient({ token: 'my-token', baseUrl: 'https://api.example.com' });
        const result = await client.testRequest('/test');

        expect(mockFetch).toHaveBeenCalledOnce();
        const [url, opts] = mockFetch.mock.calls[0];
        expect(url).toBe('https://api.example.com/test');
        expect(opts.method).toBe('GET');
        expect(opts.headers['Authorization']).toBe('Bearer my-token');
        expect(result).toEqual({ code: 0, data: 'ok' });
    });

    it('throws ShipzyAuthError on 401', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 401,
            json: () => Promise.resolve({ message: 'Unauthorized' }),
        });

        const client = new TestHttpClient({ token: 'bad-token' });
        await expect(client.testRequest('/secure')).rejects.toThrow(ShipzyAuthError);
    });

    it('throws ShipzyError on non-401 error', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ message: 'Internal Server Error' }),
        });

        const client = new TestHttpClient({ token: 'tok' });
        try {
            await client.testRequest('/crash');
            expect.fail('should have thrown');
        } catch (e) {
            expect(e).toBeInstanceOf(ShipzyError);
            expect((e as ShipzyError).statusCode).toBe(500);
            expect((e as ShipzyError).message).toBe('Internal Server Error');
        }
    }, 10000);

    it('sends POST with JSON body', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ code: 0 }),
        });

        const client = new TestHttpClient({ token: 'tok' });
        await client.testRequest('/create', 'POST', { name: 'test' });

        const [, opts] = mockFetch.mock.calls[0];
        expect(opts.method).toBe('POST');
        expect(opts.body).toBe(JSON.stringify({ name: 'test' }));
    });

    it('carrier role includes carrierCode in auth header', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({}),
        });

        const client = new TestHttpClient({ token: 'tok', role: 'carrier', carrierCode: 'DHL' });
        await client.testRequest('/carrier');

        const [, opts] = mockFetch.mock.calls[0];
        expect(opts.headers['Authorization']).toBe('Bearer DHL:tok');
    });
});
