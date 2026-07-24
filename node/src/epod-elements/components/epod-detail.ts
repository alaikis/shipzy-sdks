import { EpodBaseComponent } from './base';
import { EpodAuthError, EpodDetail } from '../api-client';

export class EpodDetailComponent extends EpodBaseComponent {
    static get observedAttributes() {
        return ['token', 'base-url', 'epod-id'];
    }

    private epodId: string = '';
    private detail: EpodDetail | null = null;
    private loading = true;
    private error: string | null = null;

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'epod-id' && newValue && newValue !== oldValue) {
            this.epodId = newValue;
            this.loadDetail();
        }
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.epodId) {
            this.loadDetail();
        }
    }

    private async loadDetail() {
        if (!this.epodId) return;

        this.loading = true;
        this.error = null;
        this.render();

        try {
            this.detail = await this.apiClient.get(this.epodId);
        } catch (err) {
            this.error = err instanceof Error ? err.message : 'Failed to load EPOD detail';
            if (err instanceof EpodAuthError) {
                this.error = 'Authentication required.';
            }
            this.dispatchErrorEvent(err);
        } finally {
            this.loading = false;
            this.render();
        }
    }

    private async handleGenerateSignUrl() {
        if (!this.epodId) return;
        try {
            const result = await this.apiClient.generateSignUrl(this.epodId);
            this.dispatchEvent(new CustomEvent('sign-url-generated', {
                detail: { signUrl: result.sign_url },
                bubbles: true,
                composed: true,
            }));
        } catch (err) {
            this.dispatchErrorEvent(err);
        }
    }

    private dispatchErrorEvent(err: unknown) {
        this.dispatchEvent(new CustomEvent('error', {
            detail: { message: err instanceof Error ? err.message : 'Unknown error' },
            bubbles: true,
            composed: true,
        }));
    }

    render() {
        this.shadow.innerHTML = '';
        this.injectStyles();

        const container = this.createElement('div', 'epod-container');

        if (this.loading) {
            this.showLoading(container);
        } else if (this.error) {
            this.showError(container, this.error);
        } else if (this.detail) {
            container.appendChild(this.renderDetail());
        }

        this.shadow.appendChild(container);
    }

    private renderDetail(): HTMLElement {
        const wrapper = this.createElement('div');
        wrapper.style.padding = '16px';

        const header = this.createElement('div', 'epod-header');
        header.style.margin = '-16px -16px 16px -16px';

        const title = this.createElement('h3', 'epod-title');
        title.textContent = 'EPOD ' + (this.detail!.tracking_no || this.detail!.id);
        header.appendChild(title);

        const statusBadge = this.createElement('span', 'epod-status epod-status-' + this.detail!.status);
        statusBadge.textContent = this.detail!.status;
        header.appendChild(statusBadge);
        wrapper.appendChild(header);

        const fields: Array<[string, string]> = [
            ['Tracking No', this.detail!.tracking_no || '-'],
            ['Recipient', this.detail!.recipient_name || '-'],
            ['Phone', this.detail!.recipient_phone || '-'],
            ['Proof Type', this.detail!.proof_type || '-'],
            ['Created', this.detail!.created_at ? new Date(this.detail!.created_at).toLocaleString() : '-'],
        ];

        for (const [label, value] of fields) {
            const row = this.createElement('div');
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.style.padding = '8px 0';
            row.style.borderBottom = '1px solid var(--epod-border)';

            const labelEl = this.createElement('span');
            labelEl.style.color = 'var(--epod-text-secondary)';
            labelEl.style.fontSize = '14px';
            labelEl.textContent = label;
            row.appendChild(labelEl);

            const valueEl = this.createElement('span');
            valueEl.style.fontWeight = '500';
            valueEl.style.fontSize = '14px';
            valueEl.textContent = value;
            row.appendChild(valueEl);

            wrapper.appendChild(row);
        }

        const actions = this.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '8px';
        actions.style.marginTop = '16px';

        const self = this;
        const signBtn = this.createElement('button', 'epod-btn epod-btn-primary');
        signBtn.textContent = 'Generate Sign URL';
        signBtn.onclick = function() {
            self.handleGenerateSignUrl();
        };
        actions.appendChild(signBtn);

        wrapper.appendChild(actions);

        return wrapper;
    }
}

customElements.define('shipzy-epod-detail', EpodDetailComponent);
