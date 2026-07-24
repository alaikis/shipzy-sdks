import { EpodBaseComponent } from './base';
import { EpodAuthError } from '../api-client';

interface SignDetail {
    id: string;
    tracking_no: string;
    recipient_name?: string;
    destination_country?: string;
    signature_waived?: boolean;
    signature_level_required?: string;
}

interface PolicyResponse {
    policy_version: string;
    content: string;
    language: string;
}

export class EpodSignatureComponent extends EpodBaseComponent {
    static get observedAttributes() {
        return ['token', 'base-url', 'lang'];
    }

    private token: string = '';
    private loading = true;
    private error: string | '';
    private detail: SignDetail | null = null;
    private policy: PolicyResponse | null = null;
    private consented = false;
    private submitting = false;
    private done = false;
    private evidenceHash: string = '';
    private lang: string = 'en';

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'token' && newValue && newValue !== oldValue) {
            this.token = newValue;
            this.loadDetail();
        }
        if (name === 'lang' && newValue) {
            this.lang = newValue;
        }
    }

    private async apiRequest<T>(path: string, method: string = 'GET', body?: unknown): Promise<T> {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        const baseUrl = this.config.baseUrl || 'https://api.shipzy.me';
        const response = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, {
            method, headers, body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    }

    private async loadDetail() {
        this.loading = true;
        this.error = '';
        this.render();
        try {
            const res = await this.apiRequest<{ code: number; data: SignDetail }>(`/api/v1/open/epod/sign/${this.token}`);
            this.detail = res.data;
            await this.loadPolicy();
        } catch (err) {
            this.error = err instanceof Error ? err.message : 'Failed to load';
            this.dispatchErrorEvent(err);
        } finally {
            this.loading = false;
            this.render();
        }
    }

    private async loadPolicy() {
        try {
            const res = await this.apiRequest<{ code: number; data: PolicyResponse }>(`/api/v1/open/epod/sign/${this.token}/policy?lang=${this.lang}`);
            this.policy = res.data;
        } catch (err) {
            // Policy load failure is non-fatal
        }
    }

    private async handleConsent() {
        if (!this.detail) return;
        try {
            const res = await this.apiRequest<{ code: number; data: { consent_id: string } }>(`/api/v1/open/epod/sign/${this.token}/consent`, 'POST', {
                policy_version: this.policy?.policy_version,
                language: this.lang,
            });
            this.consented = true;
            this.render();
        } catch (err) {
            this.dispatchErrorEvent(err);
        }
    }

    private async handleCapture() {
        if (!this.detail) return;
        this.submitting = true;
        this.render();
        try {
            const canvas = this.shadow.querySelector('canvas') as HTMLCanvasElement;
            let signatureData = '';
            if (canvas) {
                signatureData = canvas.toDataURL('image/png');
            }
            const res = await this.apiRequest<{ code: number; data: { evidence_hash: string } }>(`/api/v1/open/epod/sign/${this.token}/capture`, 'POST', {
                signature_data: signatureData,
                consent_id: '',
            });
            this.evidenceHash = res.data.evidence_hash;
            this.done = true;
            this.dispatchEvent(new CustomEvent('signature-complete', {
                detail: { evidenceHash: this.evidenceHash, epodId: this.detail.id },
                bubbles: true, composed: true,
            }));
        } catch (err) {
            this.dispatchErrorEvent(err);
        } finally {
            this.submitting = false;
            this.render();
        }
    }

    private dispatchErrorEvent(err: unknown) {
        this.dispatchEvent(new CustomEvent('error', {
            detail: { message: err instanceof Error ? err.message : 'Unknown error' },
            bubbles: true, composed: true,
        }));
    }

    render() {
        this.shadow.innerHTML = '';
        this.injectStyles();

        const container = this.createElement('div', 'epod-container');
        container.style.padding = '24px';
        container.style.maxWidth = '500px';
        container.style.margin = '0 auto';

        if (this.loading) {
            this.showLoading(container);
        } else if (this.error) {
            this.showError(container, this.error);
        } else if (this.done) {
            container.appendChild(this.renderSuccess());
        } else if (this.detail) {
            container.appendChild(this.renderSignature());
        }

        this.shadow.appendChild(container);
    }

    private renderSuccess(): HTMLElement {
        const wrapper = this.createElement('div');
        wrapper.style.textAlign = 'center';
        wrapper.style.padding = '32px 0';

        const title = this.createElement('h3');
        title.style.color = 'var(--epod-success)';
        title.style.fontSize = '20px';
        title.textContent = 'Delivery Confirmed';
        wrapper.appendChild(title);

        const msg = this.createElement('p');
        msg.style.marginTop = '12px';
        msg.style.color = 'var(--epod-text-secondary)';
        msg.textContent = 'Thank you. Your signature has been recorded.';
        wrapper.appendChild(msg);

        if (this.evidenceHash) {
            const hashLabel = this.createElement('p');
            hashLabel.style.marginTop = '16px';
            hashLabel.style.fontSize = '12px';
            hashLabel.style.color = 'var(--epod-text-secondary)';
            hashLabel.textContent = 'Evidence hash (keep this):';
            wrapper.appendChild(hashLabel);

            const hashEl = this.createElement('code');
            hashEl.style.display = 'block';
            hashEl.style.marginTop = '4px';
            hashEl.style.padding = '8px';
            hashEl.style.background = 'var(--epod-bg-secondary)';
            hashEl.style.borderRadius = '4px';
            hashEl.style.fontSize = '11px';
            hashEl.style.wordBreak = 'break-all';
            hashEl.textContent = this.evidenceHash;
            wrapper.appendChild(hashEl);
        }

        return wrapper;
    }

    private renderSignature(): HTMLElement {
        const wrapper = this.createElement('div');

        // Header
        const header = this.createElement('div', 'epod-header');
        header.style.margin = '-24px -24px 24px -24px';
        const title = this.createElement('h3', 'epod-title');
        title.textContent = `Proof of Delivery — ${this.detail!.tracking_no || ''}`;
        header.appendChild(title);
        wrapper.appendChild(header);

        // Policy consent
        if (this.policy) {
            const policyBox = this.createElement('div');
            policyBox.style.marginBottom = '16px';
            policyBox.style.padding = '12px';
            policyBox.style.background = 'var(--epod-bg-secondary)';
            policyBox.style.borderRadius = 'var(--epod-radius)';
            policyBox.style.fontSize = '13px';

            const policyText = this.createElement('p');
            policyText.style.margin = '0 0 8px 0';
            policyText.textContent = `Privacy Policy v${this.policy.policy_version}`;
            policyBox.appendChild(policyText);

            if (!this.consented) {
                const consentBtn = this.createElement('button', 'epod-btn epod-btn-primary');
                consentBtn.textContent = 'I agree to the policy';
                consentBtn.style.width = '100%';
                consentBtn.onclick = () => this.handleConsent();
                policyBox.appendChild(consentBtn);
            } else {
                const agreed = this.createElement('span');
                agreed.style.color = 'var(--epod-success)';
                agreed.textContent = '✓ Policy agreed';
                policyBox.appendChild(agreed);
            }

            wrapper.appendChild(policyBox);
        }

        // Signature canvas
        if (!this.detail!.signature_waived) {
            const canvasLabel = this.createElement('label');
            canvasLabel.style.display = 'block';
            canvasLabel.style.fontSize = '14px';
            canvasLabel.style.fontWeight = '500';
            canvasLabel.style.marginBottom = '8px';
            canvasLabel.textContent = 'Signature';
            wrapper.appendChild(canvasLabel);

            const canvas = this.createElement('canvas');
            canvas.style.width = '100%';
            canvas.style.height = '150px';
            canvas.style.border = '1px solid var(--epod-border)';
            canvas.style.borderRadius = 'var(--epod-radius)';
            canvas.style.background = '#fff';
            wrapper.appendChild(canvas);

            const clearBtn = this.createElement('button', 'epod-btn epod-btn-outline');
            clearBtn.textContent = 'Clear';
            clearBtn.style.marginTop = '8px';
            clearBtn.onclick = () => {
                const ctx = canvas.getContext('2d');
                if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            };
            wrapper.appendChild(clearBtn);
        }

        // Submit button
        const submitBtn = this.createElement('button', 'epod-btn epod-btn-primary');
        submitBtn.textContent = this.submitting ? 'Submitting...' : (this.detail!.signature_waived ? 'Confirm Delivery' : 'Sign and Confirm');
        submitBtn.style.width = '100%';
        submitBtn.style.marginTop = '16px';
        submitBtn.disabled = !this.consented || this.submitting;
        submitBtn.onclick = () => this.handleCapture();
        wrapper.appendChild(submitBtn);

        return wrapper;
    }
}

customElements.define('shipzy-epod-signature', EpodSignatureComponent);
