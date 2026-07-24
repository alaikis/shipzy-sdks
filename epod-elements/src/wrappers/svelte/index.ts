import { onMount, onDestroy } from 'svelte';
import '../index';

export interface EpodListProps {
    token?: string;
    baseUrl?: string;
    pageSize?: number;
    statusFilter?: string;
    onSelect?: (epodId: string) => void;
    onError?: (error: { message: string; code: number }) => void;
}

export class EpodListWrapper {
    private el: HTMLElement | null = null;
    private target: HTMLElement | null = null;
    private props: EpodListProps;

    constructor(target: HTMLElement, props: EpodListProps) {
        this.target = target;
        this.props = props;
        this.create();
    }

    private create() {
        if (!this.target) return;
        this.target.innerHTML = '';

        this.el = document.createElement('shipzy-epod-list');
        if (this.props.token) this.el.setAttribute('token', this.props.token);
        if (this.props.baseUrl) this.el.setAttribute('base-url', this.props.baseUrl);
        if (this.props.pageSize) this.el.setAttribute('page-size', String(this.props.pageSize));
        if (this.props.statusFilter) this.el.setAttribute('status-filter', this.props.statusFilter);

        if (this.props.onSelect) {
            this.el.addEventListener('epod-select', (e: Event) => {
                this.props.onSelect!((e as CustomEvent).detail.epodId);
            });
        }

        if (this.props.onError) {
            this.el.addEventListener('error', (e: Event) => {
                this.props.onError!((e as CustomEvent).detail);
            });
        }

        this.target.appendChild(this.el);
    }

    destroy() {
        if (this.el) {
            this.el.remove();
            this.el = null;
        }
    }
}

export interface EpodDetailProps {
    token?: string;
    baseUrl?: string;
    epodId: string;
    onSignUrlGenerated?: (data: { signUrl: string }) => void;
    onError?: (error: { message: string; code: number }) => void;
}

export class EpodDetailWrapper {
    private el: HTMLElement | null = null;
    private target: HTMLElement | null = null;
    private props: EpodDetailProps;

    constructor(target: HTMLElement, props: EpodDetailProps) {
        this.target = target;
        this.props = props;
        this.create();
    }

    private create() {
        if (!this.target) return;
        this.target.innerHTML = '';

        this.el = document.createElement('shipzy-epod-detail');
        if (this.props.token) this.el.setAttribute('token', this.props.token);
        if (this.props.baseUrl) this.el.setAttribute('base-url', this.props.baseUrl);
        this.el.setAttribute('epod-id', this.props.epodId);

        if (this.props.onSignUrlGenerated) {
            this.el.addEventListener('sign-url-generated', (e: Event) => {
                this.props.onSignUrlGenerated!((e as CustomEvent).detail);
            });
        }

        if (this.props.onError) {
            this.el.addEventListener('error', (e: Event) => {
                this.props.onError!((e as CustomEvent).detail);
            });
        }

        this.target.appendChild(this.el);
    }

    destroy() {
        if (this.el) {
            this.el.remove();
            this.el = null;
        }
    }
}

export interface EpodCreateProps {
    token?: string;
    baseUrl?: string;
    orderId?: string;
    onCreate?: (epodId: string) => void;
    onError?: (error: { message: string; code: number }) => void;
}

export class EpodCreateWrapper {
    private el: HTMLElement | null = null;
    private target: HTMLElement | null = null;
    private props: EpodCreateProps;

    constructor(target: HTMLElement, props: EpodCreateProps) {
        this.target = target;
        this.props = props;
        this.create();
    }

    private create() {
        if (!this.target) return;
        this.target.innerHTML = '';

        this.el = document.createElement('shipzy-epod-create');
        if (this.props.token) this.el.setAttribute('token', this.props.token);
        if (this.props.baseUrl) this.el.setAttribute('base-url', this.props.baseUrl);
        if (this.props.orderId) this.el.setAttribute('order-id', this.props.orderId);

        if (this.props.onCreate) {
            this.el.addEventListener('created', (e: Event) => {
                this.props.onCreate!((e as CustomEvent).detail.epodId);
            });
        }

        if (this.props.onError) {
            this.el.addEventListener('error', (e: Event) => {
                this.props.onError!((e as CustomEvent).detail);
            });
        }

        this.target.appendChild(this.el);
    }

    destroy() {
        if (this.el) {
            this.el.remove();
            this.el = null;
        }
    }
}

export interface EpodSignatureProps {
    token: string;
    baseUrl?: string;
    lang?: string;
    onComplete?: (data: { evidenceHash: string; epodId: string }) => void;
    onError?: (error: { message: string }) => void;
}

export class EpodSignatureWrapper {
    private el: HTMLElement | null = null;
    private target: HTMLElement | null = null;
    private props: EpodSignatureProps;

    constructor(target: HTMLElement, props: EpodSignatureProps) {
        this.target = target;
        this.props = props;
        this.create();
    }

    private create() {
        if (!this.target) return;
        this.target.innerHTML = '';

        this.el = document.createElement('shipzy-epod-signature');
        this.el.setAttribute('token', this.props.token);
        if (this.props.baseUrl) this.el.setAttribute('base-url', this.props.baseUrl);
        if (this.props.lang) this.el.setAttribute('lang', this.props.lang);

        if (this.props.onComplete) {
            this.el.addEventListener('signature-complete', (e: Event) => {
                this.props.onComplete!((e as CustomEvent).detail);
            });
        }

        if (this.props.onError) {
            this.el.addEventListener('error', (e: Event) => {
                this.props.onError!((e as CustomEvent).detail);
            });
        }

        this.target.appendChild(this.el);
    }

    destroy() {
        if (this.el) {
            this.el.remove();
            this.el = null;
        }
    }
}
