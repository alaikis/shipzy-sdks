import { HttpClient } from './http-client';
import type { ShipzyConfig } from './http-client';
import type { ApiResult } from './index';

// ============ Types ============

export interface TrackingEvent {
    remark: string;
    event_time: string;
    event_type: string;
    location?: {
        lat: number;
        lng: number;
        label?: string;
    };
}

export interface TrackingDetail {
    tracking_no: string;
    status: string;
    carrier_name: string;
    latest_event?: string;
    estimated_delivery?: string;
    actual_delivery?: string;
    origin?: {
        full_name?: string;
        city?: string;
        country_code?: string;
        latitude?: number;
        longitude?: number;
    };
    destination?: {
        full_name?: string;
        city?: string;
        country_code?: string;
        latitude?: number;
        longitude?: number;
    };
    events: TrackingEvent[];
}

export interface TrackingListItem {
    tracking_no: string;
    status: string;
    carrier_name: string;
    latest_event?: string;
    updated_at: string;
}

export interface TrackingListResponse {
    data: TrackingListItem[];
    total: number;
    page: number;
    page_size: number;
}

// ============ Client ============

export class TrackingClient extends HttpClient {
    async detail(trackingNo: string): Promise<ApiResult<TrackingDetail>> {
        return this.request(`/api/v1/tracking/${encodeURIComponent(trackingNo)}`);
    }

    async list(params: {
        page?: number;
        pageSize?: number;
        status?: string;
        trackingNo?: string;
    } = {}): Promise<ApiResult<TrackingListResponse>> {
        const q = this.buildQuery({ page: params.page, page_size: params.pageSize, status: params.status, tracking_no: params.trackingNo });
        const basePath = this.config.role === 'carrier' ? '/api/v1/carrier/tracking/list' : '/api/v1/merchant/tracking/list';
        return this.request(`${basePath}${q}`);
    }
}
