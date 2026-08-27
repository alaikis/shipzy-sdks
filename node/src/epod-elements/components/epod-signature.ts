import { EpodBaseComponent } from './base';
import { EpodAuthError } from '../api-client';

interface SignDetail {
    tracking_no: string;
    recipient_name: string;
    delivery_address_summary: string;
    destination_country_code: string;
    policy_url: string;
    allowed_proof_types: string[];
    policy_version_hash: string;
    signature_level_required: 'advanced' | 'eidas_advanced' | 'qualified';
    signature_waived: boolean;
    expires_at: string;
}

interface CaptureResponse {
    status: string;
    evidence_hash: string;
}

export class EpodSignatureComponent extends EpodBaseComponent {
    static get observedAttributes() {
        return ['token', 'base-url', 'lang', 'consent-required'];
    }

    private token: string = '';
    private _lang: string = 'en';
    private consentRequired: boolean = true;
    private detail: SignDetail | null = null;
    private loading = true;
    private error: string | null = null;
    private done = false;
    private evidenceHash: string | null = null;
    private canvasEl: HTMLCanvasElement | null = null;
    private signatureData: string = '';
    private consented = false;
    private drawing = false;
    private lastX = 0;
    private lastY = 0;
    private drawingEventsBound = false;

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'token' && newValue && newValue !== oldValue) {
            this.token = newValue;
            this.loadDetail();
        }
        if (name === 'lang' && newValue) {
            this._lang = newValue;
        }
        if (name === 'consent-required') {
            this.consentRequired = newValue !== 'false';
        }
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.token) {
            this.loadDetail();
        }
    }

    private async loadDetail() {
        if (!this.token) return;

        this.loading = true;
        this.error = null;
        this.render();

        try {
            const qs = '';
            const res = await fetch(`${this.config.baseUrl || 'https://api.zymeup.com'}/api/v1/open/epod/sign/${this.token}${qs}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            this.detail = await res.json();
        } catch (err) {
            this.error = err instanceof Error ? err.message : 'Failed to load signature details';
            this.dispatchErrorEvent(err);
        } finally {
            this.loading = false;
            this.render();
        }
    }

    private async handleCapture() {
        if (!this.token) return;

        try {
            const base = this.config.baseUrl || 'https://api.zymeup.com';
            const detail = this.detail;

            // Obtain a real consent_id from the /consent endpoint. The capture
            // endpoint rejects placeholder ids (403 invalid consent).
            let consentId = '';
            if (detail && !detail.signature_waived) {
                if (this.consentRequired && !this.consented) {
                    throw new Error('Consent is required before submitting your signature');
                }
                const consentRes = await fetch(`${base}/api/v1/open/epod/sign/${this.token}/consent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        consent_types: ['delivery'],
                        policy_version_hash: detail.policy_version_hash || '',
                    }),
                });
                if (!consentRes.ok) throw new Error(`Consent HTTP ${consentRes.status}`);
                const consentBody = await consentRes.json();
                consentId = consentBody.consent_id || '';
            }

            const res = await fetch(`${base}/api/v1/open/epod/sign/${this.token}/capture`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    consent_id: consentId,
                    signature_data: this.signatureData || undefined,
                    proof_type: 'signature'
                })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const result: CaptureResponse = await res.json();
            this.evidenceHash = result.evidence_hash;
            this.done = true;
            this.dispatchEvent(new CustomEvent('signature-capture', {
                detail: { evidenceHash: result.evidence_hash, status: result.status },
                bubbles: true,
                composed: true,
            }));
            this.render();
        } catch (err) {
            this.error = err instanceof Error ? err.message : 'Failed to capture signature';
            this.dispatchErrorEvent(err);
            this.render();
        }
    }

    private dispatchErrorEvent(err: unknown) {
        this.dispatchEvent(new CustomEvent('error', {
            detail: { message: err instanceof Error ? err.message : 'Unknown error' },
            bubbles: true,
            composed: true,
        }));
    }

    private initCanvas() {
        if (!this.canvasEl) return;
        const ctx = this.canvasEl.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        }
    }

    private attachDrawingEvents() {
        if (!this.canvasEl || this.drawingEventsBound) return;
        this.drawingEventsBound = true;

        const canvas = this.canvasEl;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const getPos = (clientX: number, clientY: number) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / (rect.width || 1);
            const scaleY = canvas.height / (rect.height || 1);
            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY,
            };
        };

        const start = (clientX: number, clientY: number) => {
            const { x, y } = getPos(clientX, clientY);
            this.drawing = true;
            this.lastX = x;
            this.lastY = y;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        };

        const move = (clientX: number, clientY: number) => {
            if (!this.drawing) return;
            const { x, y } = getPos(clientX, clientY);
            ctx.beginPath();
            ctx.moveTo(this.lastX, this.lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            this.lastX = x;
            this.lastY = y;
        };

        const stop = () => {
            this.drawing = false;
        };

        canvas.addEventListener('pointerdown', (e: PointerEvent) => {
            e.preventDefault();
            canvas.setPointerCapture(e.pointerId);
            start(e.clientX, e.clientY);
        });
        canvas.addEventListener('pointermove', (e: PointerEvent) => {
            if (!this.drawing) return;
            e.preventDefault();
            move(e.clientX, e.clientY);
        });
        canvas.addEventListener('pointerup', (e: PointerEvent) => {
            e.preventDefault();
            stop();
        });
        canvas.addEventListener('pointercancel', () => stop());
        canvas.addEventListener('pointerleave', () => stop());

        canvas.addEventListener('mousedown', (e: MouseEvent) => {
            e.preventDefault();
            start(e.clientX, e.clientY);
        });
        canvas.addEventListener('mousemove', (e: MouseEvent) => {
            if (!this.drawing) return;
            e.preventDefault();
            move(e.clientX, e.clientY);
        });
        canvas.addEventListener('mouseup', () => stop());
        canvas.addEventListener('mouseleave', () => stop());

        canvas.addEventListener('touchstart', (e: TouchEvent) => {
            e.preventDefault();
            const t = e.touches[0];
            if (t) start(t.clientX, t.clientY);
        }, { passive: false });
        canvas.addEventListener('touchmove', (e: TouchEvent) => {
            if (!this.drawing) return;
            e.preventDefault();
            const t = e.touches[0];
            if (t) move(t.clientX, t.clientY);
        }, { passive: false });
        canvas.addEventListener('touchend', (e: TouchEvent) => {
            e.preventDefault();
            stop();
        }, { passive: false });
        canvas.addEventListener('touchcancel', () => stop());
    }

    private captureSignature(): string {
        if (!this.canvasEl) return '';
        const ctx = this.canvasEl.getContext('2d');
        if (!ctx) return '';
        return this.canvasEl.toDataURL('image/png');
    }

    private clearCanvas() {
        if (!this.canvasEl) return;
        const ctx = this.canvasEl.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        }
    }

    render() {
        this.shadow.innerHTML = '';
        this.injectStyles();

        const container = this.createElement('div', 'epod-container');

        if (this.loading) {
            this.showLoading(container);
        } else if (this.error) {
            this.showError(container, this.error);
        } else if (this.done) {
            this.renderDone(container);
        } else if (this.detail) {
            this.renderSignature(container);
        }

        this.shadow.appendChild(container);
    }

    private renderSignature(container: HTMLElement) {
        const wrapper = this.createElement('div');
        wrapper.style.padding = '16px';

        const header = this.createElement('div', 'epod-header');
        header.style.margin = '-16px -16px 16px -16px';
        const title = this.createElement('h3', 'epod-title');
        title.textContent = 'Sign Delivery';
        header.appendChild(title);
        wrapper.appendChild(header);

        const tracking = this.createElement('div');
        tracking.style.fontSize = '14px';
        tracking.style.color = 'var(--epod-text-secondary)';
        tracking.style.marginBottom = '8px';
        tracking.textContent = 'Tracking: ' + (this.detail!.tracking_no || '-');
        wrapper.appendChild(tracking);

        const recipient = this.createElement('div');
        recipient.style.fontSize = '14px';
        recipient.style.fontWeight = '500';
        recipient.style.marginBottom = '16px';
        recipient.textContent = 'Recipient: ' + (this.detail!.recipient_name || '-');
        wrapper.appendChild(recipient);

        if (this.detail!.signature_waived) {
            const waived = this.createElement('div');
            waived.style.padding = '12px';
            waived.style.background = '#f0fdf4';
            waived.style.border = '1px solid #bbf7d0';
            waived.style.borderRadius = '8px';
            waived.style.marginBottom = '16px';
            waived.style.fontSize = '13px';
            waived.textContent = 'Signature waived by sender. Click confirm to accept delivery.';
            wrapper.appendChild(waived);
        } else {
            const canvasLabel = this.createElement('label');
            canvasLabel.style.display = 'block';
            canvasLabel.style.fontSize = '13px';
            canvasLabel.style.fontWeight = '500';
            canvasLabel.style.marginBottom = '8px';
            canvasLabel.textContent = 'Signature';
            wrapper.appendChild(canvasLabel);

            const canvasWrapper = this.createElement('div');
            canvasWrapper.style.border = '2px solid var(--epod-border)';
            canvasWrapper.style.borderRadius = '8px';
            canvasWrapper.style.overflow = 'hidden';
            canvasWrapper.style.marginBottom = '8px';
            canvasWrapper.style.background = '#fff';

            this.canvasEl = this.createElement('canvas');
            this.canvasEl.width = 400;
            this.canvasEl.height = 200;
            this.canvasEl.style.display = 'block';
            this.canvasEl.style.cursor = 'crosshair';
            this.canvasEl.style.touchAction = 'none';
            canvasWrapper.appendChild(this.canvasEl);
            wrapper.appendChild(canvasWrapper);

            this.initCanvas();
            this.attachDrawingEvents();

            const clearBtn = this.createElement('button', 'epod-btn epod-btn-outline');
            clearBtn.textContent = 'Clear';
            clearBtn.style.marginBottom = '16px';
            const self = this;
            clearBtn.onclick = function() { self.clearCanvas(); };
            wrapper.appendChild(clearBtn);
        }

        if (this.consentRequired && !this.detail!.signature_waived) {
            const consentBox = this.createElement('div');
            consentBox.style.display = 'flex';
            consentBox.style.alignItems = 'flex-start';
            consentBox.style.gap = '8px';
            consentBox.style.marginBottom = '16px';
            consentBox.style.padding = '12px';
            consentBox.style.background = 'var(--epod-bg-secondary)';
            consentBox.style.borderRadius = '8px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'consent-check';
            checkbox.style.marginTop = '2px';
            checkbox.onchange = () => { this.consented = checkbox.checked; };
            consentBox.appendChild(checkbox);

            const label = document.createElement('label');
            label.htmlFor = 'consent-check';
            label.style.fontSize = '12px';
            label.style.color = 'var(--epod-text-secondary)';
            label.style.cursor = 'pointer';
            label.textContent = 'I consent to the processing of my signature data for delivery proof.';
            consentBox.appendChild(label);

            wrapper.appendChild(consentBox);
        }

        const actions = this.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '8px';

        const self = this;
        const submitBtn = this.createElement('button', 'epod-btn epod-btn-primary');
        submitBtn.textContent = this.detail!.signature_waived ? 'Confirm Receipt' : 'Submit Signature';
        submitBtn.onclick = function() {
            if (!self.detail!.signature_waived) {
                self.signatureData = self.captureSignature();
            }
            self.handleCapture();
        };
        actions.appendChild(submitBtn);

        wrapper.appendChild(actions);
        container.appendChild(wrapper);
    }

    private renderDone(container: HTMLElement) {
        const wrapper = this.createElement('div');
        wrapper.style.padding = '32px 16px';
        wrapper.style.textAlign = 'center';

        const icon = this.createElement('div');
        icon.style.fontSize = '48px';
        icon.style.marginBottom = '16px';
        icon.textContent = '✓';
        wrapper.appendChild(icon);

        const title = this.createElement('h3');
        title.style.fontSize = '18px';
        title.style.fontWeight = '600';
        title.style.marginBottom = '8px';
        title.textContent = 'Signature Captured';
        wrapper.appendChild(title);

        const desc = this.createElement('div');
        desc.style.fontSize = '14px';
        desc.style.color = 'var(--epod-text-secondary)';
        desc.textContent = 'Thank you! Your signature has been recorded.';
        wrapper.appendChild(desc);

        if (this.evidenceHash) {
            const hashEl = this.createElement('div');
            hashEl.style.marginTop = '16px';
            hashEl.style.fontSize = '11px';
            hashEl.style.color = 'var(--epod-text-tertiary, #9ca3af)';
            hashEl.style.wordBreak = 'break-all';
            hashEl.textContent = 'Evidence: ' + this.evidenceHash;
            wrapper.appendChild(hashEl);
        }

        container.appendChild(wrapper);
    }
}

customElements.define('zymeup-epod-signature', EpodSignatureComponent);
