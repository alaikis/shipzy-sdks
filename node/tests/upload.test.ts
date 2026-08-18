import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UploadClient } from '../src/upload';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function makeClient() {
    return new UploadClient({ token: 'test-token', baseUrl: 'https://api.test.com' });
}

describe('UploadClient', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ code: 0, data: { url: 'https://cdn.example.com/file.png' } }) });
    });

    it('uploadFile() uses FormData body (not JSON)', async () => {
        const client = makeClient();
        const file = new File(['content'], 'test.png', { type: 'image/png' });

        await client.uploadFile('/upload', file);

        const [, opts] = mockFetch.mock.calls[0];
        expect(opts.body).toBeInstanceOf(FormData);
        expect(typeof opts.body).not.toBe('string');
        expect(opts.method).toBe('POST');
    });

    it('uploadFile() sets Authorization but not Content-Type header', async () => {
        const client = makeClient();
        const file = new File(['content'], 'test.png', { type: 'image/png' });

        await client.uploadFile('/upload', file);

        const [, opts] = mockFetch.mock.calls[0];
        expect(opts.headers['Authorization']).toBe('Bearer test-token');
        expect(opts.headers['Content-Type']).toBeUndefined();
    });

    it('uploadFile() calls correct URL', async () => {
        const client = makeClient();
        const file = new File(['data'], 'doc.pdf', { type: 'application/pdf' });

        await client.uploadFile('/uploads', file);

        const [url] = mockFetch.mock.calls[0];
        expect(url).toBe('https://api.test.com/uploads');
    });
});
