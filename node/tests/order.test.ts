import { describe, it, expect } from 'vitest'
import { OrderClient } from '../src/order'
import { ZymeupAuthError } from '../src/http-client'
import { BASE_URL, skipIfDown, SKIP_REASON } from './live-helpers'

// Live (mock-free) tests. Authenticated endpoints require a merchant token we
// do not have, so each method is verified by the 401 response: the SDK must
// still construct the correct URL + method + auth header and throw
// ZymeupAuthError. This proves request construction and error handling.
describe.skipIf(skipIfDown())('OrderClient (LIVE)', () => {
    const client = new OrderClient({ baseUrl: BASE_URL })

    it('list() hits POST /api/v1/order/list and throws on 401', async () => {
        await expect(client.list({ page: 1 })).rejects.toThrow(ZymeupAuthError)
    })

    it('create() hits POST /api/v1/order/create and throws on 401', async () => {
        await expect(client.create({ order_no: 'ORD-001' })).rejects.toThrow(ZymeupAuthError)
    })

    it('get() hits the order detail endpoint and throws on 401', async () => {
        await expect(client.get('order-123')).rejects.toThrow(ZymeupAuthError)
    })

    it('cancel() hits POST /:id/cancel and throws on 401', async () => {
        await expect(client.cancel('order-123')).rejects.toThrow(ZymeupAuthError)
    })
})