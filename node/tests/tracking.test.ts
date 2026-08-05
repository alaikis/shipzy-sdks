import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrackingClient } from '../src/tracking';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('TrackingClient', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ code: 0, data: {} }) });
    });

    it('detail() calls correct public endpoint', async () => {
        const client = new TrackingClient({ token: 'tok' });
        await client.detail('3SABC123456789');

        const [url] = mockFetch.mock.calls[0];
        expect(url).toBe('https://api.zymeup.com/api/v1/tracking/3SABC123456789');
    });

    it('detail() encodes tracking number', async () => {
        const client = new TrackingClient({ token: 'tok' });
        await client.detail('ABC/DEF 123');

        const [url] = mockFetch.mock.calls[0];
        expect(url).toContain(encodeURIComponent('ABC/DEF 123'));
    });

    it('list() uses merchant path by default', async () => {
        const client = new TrackingClient({ token: 'tok', role: 'merchant' });
        await client.list({ page: 1, status: 'in_transit' });

        const [url] = mockFetch.mock.calls[0];
        expect(url).toContain('/api/v1/merchant/tracking/list');
        expect(url).toContain('page=1');
        expect(url).toContain('status=in_transit');
    });

    it('list() uses carrier path when role is carrier', async () => {
        const client = new TrackingClient({ token: 'tok', role: 'carrier', carrierCode: 'DPD' });
        await client.list({ page: 1 });

        const [url] = mockFetch.mock.calls[0];
        expect(url).toContain('/api/v1/carrier/tracking/list');
    });

    it('list() omits undefined params', async () => {
        const client = new TrackingClient({ token: 'tok' });
        await client.list({});

        const [url] = mockFetch.mock.calls[0];
        expect(url).toContain('/api/v1/merchant/tracking/list');
        expect(url).not.toContain('page=');
        expect(url).not.toContain('status=');
    });
});
