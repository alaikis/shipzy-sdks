import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderClient } from '../src/index';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function makeClient(extra: Record<string, unknown> = {}) {
    return new OrderClient({ token: 'test-token', baseUrl: 'https://api.test.com', ...extra });
}

describe('OrderClient', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ code: 0, data: {} }) });
    });

    it('inherits config from parent', () => {
        const client = new OrderClient({ baseUrl: 'https://custom.api.com', token: 'tok', timeout: 5000 });
        expect(client.config.baseUrl).toBe('https://custom.api.com');
        expect(client.config.token).toBe('tok');
        expect(client.config.timeout).toBe(5000);
    });

    it('list() builds correct URL with params', async () => {
        const client = makeClient();
        await client.list({ page: 2, pageSize: 10, status: 'pending' });

        const [url] = mockFetch.mock.calls[0];
        expect(url).toContain('/api/v1/order/list');
        expect(url).toContain('page=2');
        expect(url).toContain('page_size=10');
        expect(url).toContain('status=pending');
    });

    it('list() omits undefined params', async () => {
        const client = makeClient();
        await client.list({ page: 1 });

        const [url] = mockFetch.mock.calls[0];
        expect(url).toContain('page=1');
        expect(url).not.toContain('page_size');
        expect(url).not.toContain('status');
    });

    it('create() sends POST with body', async () => {
        const client = makeClient();
        const payload = { order_no: 'ORD-001', customer_name: 'Acme' };
        await client.create(payload);

        const [url, opts] = mockFetch.mock.calls[0];
        expect(url).toBe('https://api.test.com/api/v1/order/create');
        expect(opts.method).toBe('POST');
        expect(opts.body).toBe(JSON.stringify(payload));
    });

    it('cancel() calls correct endpoint', async () => {
        const client = makeClient();
        await client.cancel('order-123');

        const [url, opts] = mockFetch.mock.calls[0];
        expect(url).toBe('https://api.test.com/api/v1/order/order-123/cancel');
        expect(opts.method).toBe('POST');
    });

    it('get() calls correct endpoint', async () => {
        const client = makeClient();
        await client.get('order-456');

        const [url] = mockFetch.mock.calls[0];
        expect(url).toBe('https://api.test.com/api/v1/order/order-456');
    });
});
