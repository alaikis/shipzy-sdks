import { describe, it, expect } from 'vitest'
import { PublicEpodClient } from '../src/public-epod'
import { LIVE, BASE_URL, skipIfDown, SKIP_REASON } from './live-helpers'

// Live (mock-free) integration tests against the running API server.
// These validate the real public EPOD signing flow end-to-end:
//   getSignDetail -> recordConsent -> captureSignature
describe.skipIf(skipIfDown())('PublicEpodClient (LIVE)', () => {
    const client = new PublicEpodClient(BASE_URL)
    const token = LIVE.token
    const policyHash = LIVE.policyHash

    it('getSignDetail() returns the raw sign detail (no ApiResult envelope)', async () => {
        const detail = await client.getSignDetail(token)

        // Backend returns a RAW object, NOT { code, data, ... }
        expect(detail).toBeTruthy()
        expect((detail as any).code).toBeUndefined()
        expect((detail as any).data).toBeUndefined()
        expect(detail.epod_id).toBeTruthy()
        expect(detail.tracking_no).toBeTruthy()
        expect(detail.signature_waived).toBe(true)
        expect(detail.policy_url).toContain(`/api/v1/open/epod/sign/${token}/policy`)
        expect(detail.allowed_proof_types).toEqual(
            expect.arrayContaining(['signature', 'photo', 'both'])
        )
    })

    it('recordConsent() returns a real consent_id', async () => {
        const res = await client.recordConsent(token, ['delivery'], policyHash)
        expect(res.consent_id).toBeTruthy()
        expect(res.consent_id.length).toBeGreaterThan(8)
        expect(res.policy_version_hash).toBe(policyHash)
    }, 20000)

    it('captureSignature() returns evidence_hash + status delivered', async () => {
        // Need a fresh consent_id for this EPOD (consents are single-use per capture)
        const consent = await client.recordConsent(token, ['delivery'], policyHash)
        const res = await client.captureSignature(
            token,
            consent.consent_id,
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
        )
        expect(res.evidence_hash).toBeTruthy()
        expect(res.evidence_hash.length).toBe(64) // sha256 hex
        expect(res.status).toBe('delivered')
    }, 20000)

    it('throws on unknown token (404)', async () => {
        await expect(client.getSignDetail('definitely-not-a-real-token-xyz')).rejects.toThrow()
    })
})