import './components/epod-list';
import './components/epod-detail';
import './components/epod-create';
import './components/epod-login';
import { EpodListComponent } from './components/epod-list';
import { EpodDetailComponent } from './components/epod-detail';
import { EpodCreateComponent } from './components/epod-create';

export interface ShowListOptions {
    token?: string;
    baseUrl?: string;
    target: string | HTMLElement;
    pageSize?: number;
    statusFilter?: string;
    onSelect?: (epodId: string) => void;
    onError?: (error: { message: string; code: number }) => void;
}

export interface ShowDetailOptions {
    token?: string;
    baseUrl?: string;
    target: string | HTMLElement;
    epodId: string;
    onSignUrlGenerated?: (data: { signUrl: string }) => void;
    onError?: (error: { message: string; code: number }) => void;
}

export interface ShowCreateOptions {
    token?: string;
    baseUrl?: string;
    target: string | HTMLElement;
    orderId?: string;
    onCreate?: (epodId: string) => void;
    onError?: (error: { message: string; code: number }) => void;
}

export const Epod = {
    showList(options: ShowListOptions): EpodListComponent {
        const targetEl = typeof options.target === 'string'
            ? document.querySelector(options.target)
            : options.target;

        if (!targetEl) {
            throw new Error('Target element not found: ' + String(options.target));
        }

        targetEl.innerHTML = '';

        const list = document.createElement('shipzy-epod-list') as EpodListComponent;

        if (options.token) list.setAttribute('token', options.token);
        if (options.baseUrl) list.setAttribute('base-url', options.baseUrl);
        if (options.pageSize) list.setAttribute('page-size', String(options.pageSize));
        if (options.statusFilter) list.setAttribute('status-filter', options.statusFilter);

        if (options.onSelect) {
            list.addEventListener('epod-select', function(e: Event) {
                const ce = e as CustomEvent;
                options.onSelect!(ce.detail.epodId);
            });
        }

        if (options.onError) {
            list.addEventListener('error', function(e: Event) {
                const ce = e as CustomEvent;
                options.onError!(ce.detail);
            });
        }

        targetEl.appendChild(list);
        return list;
    },

    showDetail(options: ShowDetailOptions): EpodDetailComponent {
        const targetEl = typeof options.target === 'string'
            ? document.querySelector(options.target)
            : options.target;

        if (!targetEl) {
            throw new Error('Target element not found: ' + String(options.target));
        }

        targetEl.innerHTML = '';

        const detail = document.createElement('shipzy-epod-detail') as EpodDetailComponent;

        if (options.token) detail.setAttribute('token', options.token);
        if (options.baseUrl) detail.setAttribute('base-url', options.baseUrl);
        detail.setAttribute('epod-id', options.epodId);

        if (options.onSignUrlGenerated) {
            detail.addEventListener('sign-url-generated', function(e: Event) {
                const ce = e as CustomEvent;
                options.onSignUrlGenerated!(ce.detail);
            });
        }

        if (options.onError) {
            detail.addEventListener('error', function(e: Event) {
                const ce = e as CustomEvent;
                options.onError!(ce.detail);
            });
        }

        targetEl.appendChild(detail);
        return detail;
    },

    showCreate(options: ShowCreateOptions): EpodCreateComponent {
        const targetEl = typeof options.target === 'string'
            ? document.querySelector(options.target)
            : options.target;

        if (!targetEl) {
            throw new Error('Target element not found: ' + String(options.target));
        }

        targetEl.innerHTML = '';

        const create = document.createElement('shipzy-epod-create') as EpodCreateComponent;

        if (options.token) create.setAttribute('token', options.token);
        if (options.baseUrl) create.setAttribute('base-url', options.baseUrl);
        if (options.orderId) create.setAttribute('order-id', options.orderId);

        if (options.onCreate) {
            create.addEventListener('created', function(e: Event) {
                const ce = e as CustomEvent;
                options.onCreate!(ce.detail.epodId);
            });
        }

        if (options.onError) {
            create.addEventListener('error', function(e: Event) {
                const ce = e as CustomEvent;
                options.onError!(ce.detail);
            });
        }

        targetEl.appendChild(create);
        return create;
    },

    destroy() {
        document.querySelectorAll('shipzy-epod-list, shipzy-epod-detail, shipzy-epod-create, shipzy-epod-login').forEach(function(el) {
            el.remove();
        });
    },
};
