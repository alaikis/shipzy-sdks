import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import http from 'node:http'
import { UploadClient } from '../src/upload'
import { BASE_URL, skipIfDown, SKIP_REASON } from './live-helpers'

// Mock-free upload test. Instead of stubbing fetch, we spin up a REAL local
// HTTP server that captures the incoming request so we can assert the
// multipart FormData body, the Authorization header, and the absence of a
// manual Content-Type header (the boundary must be set by the browser/Node).
describe.skipIf(skipIfDown())('UploadClient (LIVE capture server)', () => {
    let server: http.Server
    let port: number
    let captured: { method?: string; headers: http.IncomingHttpHeaders; body: Buffer } | null = null

    beforeAll(
        () =>
            new Promise<void>((resolve) => {
                server = http.createServer((req, res) => {
                    const chunks: Buffer[] = []
                    req.on('data', (c: Buffer) => chunks.push(c))
                    req.on('end', () => {
                        captured = {
                            method: req.method,
                            headers: req.headers,
                            body: Buffer.concat(chunks),
                        }
                        res.writeHead(200, { 'content-type': 'application/json' })
                        res.end(JSON.stringify({ code: 0, data: { url: 'https://cdn.example.com/file.png' } }))
                    })
                })
                server.listen(0, '127.0.0.1', () => {
                    port = (server.address() as any).port
                    resolve()
                })
            })
    )

    afterAll(
        () =>
            new Promise<void>((resolve) => {
                server.close(() => resolve())
            })
    )

    it('uploadFile() sends a multipart FormData body with Authorization and no manual Content-Type', async () => {
        const client = new UploadClient({
            baseUrl: `http://127.0.0.1:${port}`,
            token: 'test-token',
        })
        const file = new File(['hello-upload'], 'test.png', { type: 'image/png' })

        await client.uploadFile('/upload', file)

        expect(captured).not.toBeNull()
        expect(captured!.method).toBe('POST')
        expect(captured!.headers.authorization).toBe('Bearer test-token')
        // Content-Type must be multipart/form-data (auto-set), never application/json
        expect(captured!.headers['content-type']?.toString().startsWith('multipart/form-data')).toBe(true)
        // Body must contain the file content + boundary, not a JSON string
        expect(captured!.body.toString()).toContain('hello-upload')
        expect(captured!.body.toString().trim().startsWith('{')).toBe(false)
    })

    it('uploadFile() against the real API throws on 401 without a token', async () => {
        const client = new UploadClient({ baseUrl: BASE_URL })
        const file = new File(['x'], 'test.png', { type: 'image/png' })
        await expect(client.uploadFile('/upload', file)).rejects.toThrow()
    })
})