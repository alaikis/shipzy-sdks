import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface Invoice {
    id: string;
    invoice_number: string;
    amount: number;
    currency: string;
    status: 'paid' | 'pending' | 'failed' | 'refunded';
    description: string;
    created_at: string;
    paid_at?: string;
    download_url?: string;
}

export interface Subscription {
    id: string;
    status: string;
    plan: string;
    price: number;
    currency: string;
    start_date: string;
    next_billing_date: string;
    cancel_at_period_end: boolean;
    created_at: string;
}

// ============ Client ============

export class FinanceClient extends HttpClient {
    async getInvoices(): Promise<ApiResult<Invoice[]>> {
        return this.request('/api/finance/invoices');
    }

    async listSubscriptions(): Promise<ApiResult<Subscription[]>> {
        return this.request('/api/finance/subscriptions');
    }

    async cancelSubscription(id: string): Promise<ApiResult<{ status: string }>> {
        return this.request(`/api/finance/subscriptions/${encodeURIComponent(id)}/cancel`, 'POST');
    }
}
