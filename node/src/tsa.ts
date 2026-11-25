/**
 * Platform self-hosted TSA client (RFC3161 timestamps).
 * Change: base-full-process A7
 *
 * Endpoints:
 *   POST /api/v1/tsa/timestamp    external (Enterprise; UserAuth + quota)
 *   GET  /api/v1/tsa/certificates public key publication
 */
import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';
import type { TSATimestamp } from './tracking';

export interface TSACertificates {
    provider: string;
    public_keys?: Record<string, string>;
}

// ============ Client ============

export class TSAClient extends HttpClient {
    /** Issue a platform timestamp over an imprint (hash chosen by caller). */
    async timestamp(imprint: string): Promise<ApiResult<TSATimestamp>> {
        return this.request('/api/v1/tsa/timestamp', 'POST', { imprint });
    }

    /** Published TSA public keys (PEM) for third-party verification. */
    async certificates(): Promise<ApiResult<TSACertificates>> {
        return this.request('/api/v1/tsa/certificates');
    }
}
