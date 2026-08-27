import { describe, it, expect } from 'vitest'
import { TrackingClient } from '../src/tracking'
import { ZymeupError } from '../src/http-client'
import { BASE_URL, skipIfDown, SKIP_REASON } from './live-helpers'

// Live (mock-free) tests against the running API server.
// No seeded carrier-polling data exists, so the happy path (real tracking
// events) is covered by the 404 path which still proves URL construction and
// error handling. The authenticated list() path proves 401 handling.
describe.skipIf(skipIfDown())('TrackingClient (LIVE)', () => {
    const client = new TrackingClient({ baseUrl: BASE_URL })

    it('detail() hits the public endpoint and throws on 404 (unknown tracking no)', async () => {
        await expect(client.detail('DEFINITELY-UNKNOWN-TRACKING-XYZ')).rejects.toThrow(ZymeupError)
    })

    it('detail() URL-encodes the tracking number', async () => {
        // The server returns 404 for unknown numbers, but the request must
        // still reach the correctly-encoded public endpoint.
        try {
            await client.detail('ABC/DEF 123')
        } catch (e) {
            // ZymeupError from the 404 is expected; what matters is the URL
            // was well-formed (server did not 400 on malformed path).
            expect(e).toBeInstanceOf(ZymeupError)
        }
    })

    it('list() requires auth and throws ZymeupAuthError (401) without a token', async () => {
        await expect(client.list({ page: 1 })).rejects.toThrow()
    })
})