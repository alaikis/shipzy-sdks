import { HttpClient } from '../../http-client';
import type { ShipzyConfig } from '../../http-client';
import type {
    CoreProduct,
    ProductEntry,
    TradePartyEntry,
    ExportFilter,
    CertificateQuery,
    APIResponse,
    CollectionsResponse,
    ImportLogResponse,
    ExportResponse,
    TradePartyListResponse,
    SaveCredentialRequest,
    ImportRequest,
    CertificatesRequest
} from './types';

const CPSC_BASE = '/api/v1/cpsc';

export class CPSCClient extends HttpClient {
    constructor(config: Partial<ShipzyConfig> = {}) {
        super(config);
    }

    async getCollections(): Promise<APIResponse & { businessAccountList: any[] }> {
        return this.request(`${CPSC_BASE}/collections`);
    }

    async getCredential(): Promise<any> {
        return this.request(`${CPSC_BASE}/credential`);
    }

    async saveCredential(req: SaveCredentialRequest): Promise<any> {
        return this.request(`${CPSC_BASE}/credential`, 'POST', req);
    }

    async importCertificates(req: ImportRequest): Promise<{ importId: string }> {
        return this.request(`${CPSC_BASE}/import`, 'POST', req);
    }

    async getImportStatus(importId: string): Promise<APIResponse> {
        return this.request(`${CPSC_BASE}/import/${encodeURIComponent(importId)}/status`);
    }

    async getImportLog(importId: string, errorsOnly = false): Promise<ImportLogResponse> {
        return this.request(`${CPSC_BASE}/import/${encodeURIComponent(importId)}/log?errorsOnly=${errorsOnly}`);
    }

    async exportCertificates(filter: ExportFilter): Promise<ExportResponse> {
        const qs = this.buildQuery(filter as Record<string, unknown>);
        return this.request(`${CPSC_BASE}/export${qs}`);
    }

    async exportAsync(filter: ExportFilter): Promise<{ exportId: string }> {
        const qs = this.buildQuery(filter as Record<string, unknown>);
        return this.request(`${CPSC_BASE}/export-async${qs}`);
    }

    async getExportAsyncStatus(exportId: string): Promise<APIResponse> {
        return this.request(`${CPSC_BASE}/export-async/${encodeURIComponent(exportId)}/status`);
    }

    async getExportAsyncData(exportId: string): Promise<ExportResponse> {
        return this.request(`${CPSC_BASE}/export-async/${encodeURIComponent(exportId)}/data`);
    }

    async getCertificates(req: CertificatesRequest): Promise<ExportResponse> {
        return this.request(`${CPSC_BASE}/certificates`, 'POST', req);
    }

    async getTradeParties(partyType?: string): Promise<TradePartyEntry[]> {
        const qs = partyType ? `?tradePartyType=${encodeURIComponent(partyType)}` : '';
        return this.request(`${CPSC_BASE}/trade-parties${qs}`);
    }

    async getTokenExpiration(): Promise<{ expiration: string }> {
        return this.request(`${CPSC_BASE}/token-expiration`);
    }
}
