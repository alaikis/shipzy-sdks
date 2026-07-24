import { EpodBaseComponent } from './base';
import { EpodAuthError } from '../api-client';

export class EpodCreateComponent extends EpodBaseComponent {
    static get observedAttributes() {
        return ['token', 'base-url', 'order-id'];
    }

    private submitting = false;
    private error: string | null = null;
    private success = false;
    private createdEpodId: string = '';

    private form = {
        recipient_name: '',
        recipient_phone: '',
        tracking_no: '',
        street: '',
        house_number: '',
        postal_code: '',
        city: '',
        country_code: 'NL',
        remark: '',
    };

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
    }

    private updateField(field: string, value: string) {
        (this.form as any)[field] = value;
        this.render();
    }

    private async handleSubmit() {
        this.submitting = true;
        this.error = null;
        this.render();

        try {
            const orderId = this.getAttribute('order-id');
            const body: Record<string, any> = {
                recipient_name: this.form.recipient_name,
                recipient_phone: this.form.recipient_phone,
                tracking_no: this.form.tracking_no,
                delivery_address: {
                    street: this.form.street,
                    house_number: this.form.house_number,
                    postal_code: this.form.postal_code,
                    city: this.form.city,
                    country_code: this.form.country_code,
                },
                remark: this.form.remark,
            };

            if (orderId) {
                body.order_id = orderId;
            }

            const response = await fetch(this.apiClient['baseUrl'] + '/api/v1/shipment/epod/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + (this.config.token || ''),
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new EpodAuthError('Unauthorized');
                }
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to create EPOD');
            }

            const result = await response.json();
            this.createdEpodId = result.data?.id || '';
            this.success = true;

            this.dispatchEvent(new CustomEvent('created', {
                detail: { epodId: this.createdEpodId },
                bubbles: true,
                composed: true,
            }));
        } catch (err) {
            if (err instanceof EpodAuthError) {
                this.error = 'Authentication required.';
            } else {
                this.error = err instanceof Error ? err.message : 'Failed to create EPOD';
            }
            this.dispatchEvent(new CustomEvent('error', {
                detail: { message: this.error },
                bubbles: true,
                composed: true,
            }));
        } finally {
            this.submitting = false;
            this.render();
        }
    }

    render() {
        this.shadow.innerHTML = '';
        this.injectStyles();

        const container = this.createElement('div', 'epod-container');

        if (this.success) {
            container.appendChild(this.renderSuccess());
        } else {
            container.appendChild(this.renderForm());
        }

        this.shadow.appendChild(container);
    }

    private renderSuccess(): HTMLElement {
        const wrapper = this.createElement('div');
        wrapper.style.padding = '48px 16px';
        wrapper.style.textAlign = 'center';

        const msg = this.createElement('div');
        msg.style.fontSize = '18px';
        msg.style.fontWeight = '600';
        msg.style.color = 'var(--epod-success)';
        msg.textContent = 'EPOD created successfully!';
        wrapper.appendChild(msg);

        const idEl = this.createElement('div');
        idEl.style.marginTop = '12px';
        idEl.style.fontSize = '14px';
        idEl.style.color = 'var(--epod-text-secondary)';
        idEl.textContent = 'EPOD ID: ' + this.createdEpodId;
        wrapper.appendChild(idEl);

        return wrapper;
    }

    private renderForm(): HTMLElement {
        const wrapper = this.createElement('div');
        wrapper.style.padding = '16px';

        const header = this.createElement('div', 'epod-header');
        header.style.margin = '-16px -16px 16px -16px';
        const title = this.createElement('h3', 'epod-title');
        title.textContent = 'Create EPOD';
        header.appendChild(title);
        wrapper.appendChild(header);

        if (this.error) {
            const errorEl = this.createElement('div', 'epod-error');
            errorEl.style.marginBottom = '16px';
            errorEl.textContent = this.error;
            wrapper.appendChild(errorEl);
        }

        const fields: Array<[string, string, string]> = [
            ['recipient_name', 'Recipient Name', 'text'],
            ['recipient_phone', 'Recipient Phone', 'tel'],
            ['tracking_no', 'Tracking No', 'text'],
            ['street', 'Street', 'text'],
            ['house_number', 'House Number', 'text'],
            ['postal_code', 'Postal Code', 'text'],
            ['city', 'City', 'text'],
            ['country_code', 'Country Code', 'text'],
            ['remark', 'Remark', 'text'],
        ];

        const self = this;

        for (const [field, label, type] of fields) {
            const fieldEl = this.createElement('div');
            fieldEl.style.marginBottom = '12px';

            const labelEl = this.createElement('label');
            labelEl.style.display = 'block';
            labelEl.style.fontSize = '14px';
            labelEl.style.fontWeight = '500';
            labelEl.style.marginBottom = '4px';
            labelEl.textContent = label;
            fieldEl.appendChild(labelEl);

            const input = this.createElement('input');
            input.type = type;
            input.value = (this.form as any)[field];
            input.style.width = '100%';
            input.style.padding = '8px 12px';
            input.style.border = '1px solid var(--epod-border)';
            input.style.borderRadius = 'calc(var(--epod-radius) / 2)';
            input.style.fontSize = '14px';
            input.style.boxSizing = 'border-box';
            input.oninput = function() {
                self.updateField(field, input.value);
            };
            fieldEl.appendChild(input);

            wrapper.appendChild(fieldEl);
        }

        const submitBtn = this.createElement('button', 'epod-btn epod-btn-primary');
        submitBtn.textContent = this.submitting ? 'Creating...' : 'Create EPOD';
        submitBtn.disabled = this.submitting;
        submitBtn.style.width = '100%';
        submitBtn.style.marginTop = '8px';
        submitBtn.onclick = function() {
            self.handleSubmit();
        };
        wrapper.appendChild(submitBtn);

        return wrapper;
    }
}

customElements.define('shipzy-epod-create', EpodCreateComponent);
