import { HttpClient } from './http-client';
import type { ZymeupConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'closed' | 'pending';

export interface SupportTicketMessage {
    id: string;
    content: string;
    sender_name: string;
    sender_id: string;
    created_at: string;
}

export interface SupportTicket {
    id: string;
    subject: string;
    description: string;
    priority: TicketPriority;
    status: TicketStatus;
    tenant_id: string;
    tenant_type: string;
    owner_id: string;
    owner_name: string;
    created_at: string;
    updated_at: string;
    messages?: SupportTicketMessage[];
}

export interface CreateTicketRequest {
    subject: string;
    description: string;
    priority?: TicketPriority;
}

export interface ListTicketsFilter {
    status?: TicketStatus;
    page?: number;
    page_size?: number;
}

export interface TicketListResponse {
    data: SupportTicket[];
    total: number;
    page: number;
    page_size: number;
}

// ============ Client ============

export class SupportTicketClient extends HttpClient {
    constructor(config: Partial<ZymeupConfig> = {}) {
        super(config);
    }

    async create(req: CreateTicketRequest): Promise<ApiResult<SupportTicket>> {
        return this.request('/api/v1/shipment/support/tickets', 'POST', req);
    }

    async list(filter: ListTicketsFilter = {}): Promise<ApiResult<TicketListResponse>> {
        const params: Record<string, string> = {};
        if (filter.status) params.status = filter.status;
        if (filter.page) params.page = String(filter.page);
        if (filter.page_size) params.page_size = String(filter.page_size);
        const q = this.buildQuery(params);
        return this.request(`/api/v1/shipment/support/tickets${q}`);
    }

    async get(id: string): Promise<ApiResult<SupportTicket>> {
        return this.request(`/api/v1/shipment/support/tickets/${encodeURIComponent(id)}`);
    }

    async addMessage(id: string, content: string): Promise<ApiResult<SupportTicketMessage>> {
        return this.request(`/api/v1/shipment/support/tickets/${encodeURIComponent(id)}/messages`, 'POST', { content });
    }
}
