import { useEffect, useRef, useState, createElement } from 'react';
import '../index';
import type { ShowListOptions, ShowDetailOptions, ShowCreateOptions } from '../imperative-api';

export interface EpodListProps {
    token?: string;
    baseUrl?: string;
    pageSize?: number;
    statusFilter?: string;
    onSelect?: (epodId: string) => void;
    onError?: (error: { message: string; code: number }) => void;
    className?: string;
    style?: React.CSSProperties;
}

export function EpodList(props: EpodListProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const { onSelect, onError, ...attrs } = props;

        containerRef.current.innerHTML = '';
        const el = document.createElement('shipzy-epod-list');

        if (attrs.token) el.setAttribute('token', attrs.token);
        if (attrs.baseUrl) el.setAttribute('base-url', attrs.baseUrl);
        if (attrs.pageSize) el.setAttribute('page-size', String(attrs.pageSize));
        if (attrs.statusFilter) el.setAttribute('status-filter', attrs.statusFilter);

        if (onSelect) {
            el.addEventListener('epod-select', (e: Event) => {
                onSelect((e as CustomEvent).detail.epodId);
            });
        }

        if (onError) {
            el.addEventListener('error', (e: Event) => {
                const detail = (e as CustomEvent).detail;
                setError(detail.message);
                onError(detail);
            });
        }

        containerRef.current.appendChild(el);

        return () => {
            el.remove();
        };
    }, [props.token, props.baseUrl, props.pageSize, props.statusFilter]);

    return createElement('div', {
        ref: containerRef,
        className: props.className,
        style: props.style,
    }, error ? createElement('div', { className: 'epod-error' }, error) : null);
}

export interface EpodDetailProps {
    token?: string;
    baseUrl?: string;
    epodId: string;
    onSignUrlGenerated?: (data: { signUrl: string }) => void;
    onError?: (error: { message: string; code: number }) => void;
    className?: string;
    style?: React.CSSProperties;
}

export function EpodDetail(props: EpodDetailProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const { onSignUrlGenerated, onError, ...attrs } = props;

        containerRef.current.innerHTML = '';
        const el = document.createElement('shipzy-epod-detail');

        if (attrs.token) el.setAttribute('token', attrs.token);
        if (attrs.baseUrl) el.setAttribute('base-url', attrs.baseUrl);
        el.setAttribute('epod-id', attrs.epodId);

        if (onSignUrlGenerated) {
            el.addEventListener('sign-url-generated', (e: Event) => {
                onSignUrlGenerated((e as CustomEvent).detail);
            });
        }

        if (onError) {
            el.addEventListener('error', (e: Event) => {
                onError((e as CustomEvent).detail);
            });
        }

        containerRef.current.appendChild(el);

        return () => {
            el.remove();
        };
    }, [props.token, props.baseUrl, props.epodId]);

    return createElement('div', {
        ref: containerRef,
        className: props.className,
        style: props.style,
    });
}

export interface EpodCreateProps {
    token?: string;
    baseUrl?: string;
    orderId?: string;
    onCreate?: (epodId: string) => void;
    onError?: (error: { message: string; code: number }) => void;
    className?: string;
    style?: React.CSSProperties;
}

export function EpodCreate(props: EpodCreateProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const { onCreate, onError, ...attrs } = props;

        containerRef.current.innerHTML = '';
        const el = document.createElement('shipzy-epod-create');

        if (attrs.token) el.setAttribute('token', attrs.token);
        if (attrs.baseUrl) el.setAttribute('base-url', attrs.baseUrl);
        if (attrs.orderId) el.setAttribute('order-id', attrs.orderId);

        if (onCreate) {
            el.addEventListener('created', (e: Event) => {
                onCreate((e as CustomEvent).detail.epodId);
            });
        }

        if (onError) {
            el.addEventListener('error', (e: Event) => {
                onError((e as CustomEvent).detail);
            });
        }

        containerRef.current.appendChild(el);

        return () => {
            el.remove();
        };
    }, [props.token, props.baseUrl, props.orderId]);

    return createElement('div', {
        ref: containerRef,
        className: props.className,
        style: props.style,
    });
}

export interface EpodSignatureProps {
    token: string;
    baseUrl?: string;
    lang?: string;
    consentRequired?: boolean;
    onSignatureCapture?: (data: { evidenceHash: string; status: string }) => void;
    onError?: (error: { message: string; code: number }) => void;
    className?: string;
    style?: React.CSSProperties;
}

export function EpodSignature(props: EpodSignatureProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const { onSignatureCapture, onError, ...attrs } = props;

        containerRef.current.innerHTML = '';
        const el = document.createElement('zymeup-epod-signature');

        el.setAttribute('token', attrs.token);
        if (attrs.baseUrl) el.setAttribute('base-url', attrs.baseUrl);
        if (attrs.lang) el.setAttribute('lang', attrs.lang);
        el.setAttribute('consent-required', String(attrs.consentRequired !== false));

        if (onSignatureCapture) {
            el.addEventListener('signature-capture', (e: Event) => {
                onSignatureCapture((e as CustomEvent).detail);
            });
        }

        if (onError) {
            el.addEventListener('error', (e: Event) => {
                onError((e as CustomEvent).detail);
            });
        }

        containerRef.current.appendChild(el);

        return () => {
            el.remove();
        };
    }, [props.token, props.baseUrl, props.lang, props.consentRequired]);

    return createElement('div', {
        ref: containerRef,
        className: props.className,
        style: props.style,
    });
}
