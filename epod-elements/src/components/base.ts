import { epodSharedStyles } from '../styles';
import { EpodApiClient } from '../api-client';
import { epodAuth } from '../auth';

export interface EpodComponentConfig {
    baseUrl?: string;
    token?: string;
}

export class EpodBaseComponent extends HTMLElement {
    protected shadow: ShadowRoot;
    protected apiClient: EpodApiClient;
    protected config: EpodComponentConfig;

    constructor(config: EpodComponentConfig) {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.config = config;
        this.apiClient = new EpodApiClient({
            baseUrl: config.baseUrl || 'https://api.shipzy.me',
            token: config.token || epodAuth.getToken() || undefined,
        });
    }

    protected injectStyles(additionalStyles: string = '') {
        const style = document.createElement('style');
        style.textContent = epodSharedStyles + additionalStyles;
        this.shadow.appendChild(style);
    }

    protected createElement<K extends keyof HTMLElementTagNameMap>(
        tag: K,
        className?: string,
        textContent?: string
    ): HTMLElementTagNameMap[K] {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (textContent) el.textContent = textContent;
        return el;
    }

    protected showLoading(container: HTMLElement) {
        container.innerHTML = '';
        const loading = this.createElement('div', 'epod-loading');
        loading.textContent = 'Loading...';
        container.appendChild(loading);
    }

    protected showError(container: HTMLElement, message: string) {
        container.innerHTML = '';
        const error = this.createElement('div', 'epod-error');
        error.textContent = message;
        container.appendChild(error);
    }

    attributeChangedCallback(_name: string, _oldValue: string, newValue: string) {
        if (_name === 'token' && newValue) {
            this.apiClient.setToken(newValue);
            this.render();
        }
    }

    abstract render(): void;

    connectedCallback() {
        this.render();
    }

    disconnectedCallback(): void {
        // cleanup
    }
}
