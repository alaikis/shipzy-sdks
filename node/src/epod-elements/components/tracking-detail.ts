import { EpodBaseComponent } from './base';
import { EpodAuthError, TrackingDetail, TrackingEvent } from '../api-client';

export class TrackingDetailComponent extends EpodBaseComponent {
    static get observedAttributes() {
        return ['token', 'base-url', 'tracking-no'];
    }

    private trackingNo: string = '';
    private detail: TrackingDetail | null = null;
    private loading = true;
    private error: string | null = null;

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'tracking-no' && newValue && newValue !== oldValue) {
            this.trackingNo = newValue;
            this.loadDetail();
        }
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.trackingNo) {
            this.loadDetail();
        }
    }

    private async loadDetail() {
        if (!this.trackingNo) return;

        this.loading = true;
        this.error = null;
        this.render();

        try {
            this.detail = await this.apiClient.trackingDetail(this.trackingNo);
        } catch (err) {
            this.error = err instanceof Error ? err.message : 'Failed to load tracking detail';
            if (err instanceof EpodAuthError) {
                this.error = 'Authentication required.';
            }
            this.dispatchErrorEvent(err);
        } finally {
            this.loading = false;
            this.render();
        }
    }

    private dispatchErrorEvent(err: unknown) {
        this.dispatchEvent(new CustomEvent('error', {
            detail: {
                message: err instanceof Error ? err.message : 'Unknown error',
                code: (err as any)?.code || 0,
            },
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
            this.renderDetail(container);
        }

        this.shadow.appendChild(container);
    }

    private renderDetail(container: HTMLElement) {
        const detail = this.detail!;

        const header = this.createElement('div', 'epod-header');
        const title = this.createElement('h3', 'epod-title');
        title.textContent = detail.tracking_no;
        header.appendChild(title);

        const statusBadge = this.createElement('span', 'epod-status epod-status-' + (detail.status || 'unknown'));
        statusBadge.textContent = detail.status || 'unknown';
        header.appendChild(statusBadge);
        container.appendChild(header);

        const content = this.createElement('div');
        content.style.padding = '16px';

        const infoGrid = this.createElement('div');
        infoGrid.style.display = 'grid';
        infoGrid.style.gridTemplateColumns = '1fr 1fr';
        infoGrid.style.gap = '16px';
        infoGrid.style.marginBottom = '24px';

        if (detail.carrier_name) {
            infoGrid.appendChild(this.renderInfoItem('Carrier', detail.carrier_name));
        }
        if (detail.origin?.city) {
            infoGrid.appendChild(this.renderInfoItem('Origin', detail.origin.city));
        }
        if (detail.destination?.city) {
            infoGrid.appendChild(this.renderInfoItem('Destination', detail.destination.city));
        }
        if (detail.estimated_delivery) {
            infoGrid.appendChild(this.renderInfoItem('Estimated Delivery', new Date(detail.estimated_delivery).toLocaleDateString()));
        }

        content.appendChild(infoGrid);

        if (detail.events && detail.events.length > 0) {
            const timelineTitle = this.createElement('h4');
            timelineTitle.style.fontSize = '14px';
            timelineTitle.style.fontWeight = '600';
            timelineTitle.style.marginBottom = '12px';
            timelineTitle.textContent = 'Tracking History';
            content.appendChild(timelineTitle);

            const timeline = this.createElement('div', 'epod-timeline');
            for (const event of detail.events) {
                timeline.appendChild(this.renderTimelineItem(event));
            }
            content.appendChild(timeline);
        }

        container.appendChild(content);
    }

    private renderInfoItem(label: string, value: string): HTMLElement {
        const item = this.createElement('div');
        const labelEl = this.createElement('div');
        labelEl.style.fontSize = '12px';
        labelEl.style.color = 'var(--epod-text-secondary)';
        labelEl.style.marginBottom = '4px';
        labelEl.textContent = label;
        item.appendChild(labelEl);

        const valueEl = this.createElement('div');
        valueEl.style.fontSize = '14px';
        valueEl.style.fontWeight = '500';
        valueEl.textContent = value;
        item.appendChild(valueEl);

        return item;
    }

    private renderTimelineItem(event: TrackingEvent): HTMLElement {
        const item = this.createElement('div', 'epod-timeline-item');

        const remark = this.createElement('div');
        remark.style.fontSize = '14px';
        remark.style.fontWeight = '500';
        remark.textContent = event.remark;
        item.appendChild(remark);

        const time = this.createElement('div', 'epod-timeline-time');
        time.textContent = new Date(event.event_time).toLocaleString();
        item.appendChild(time);

        return item;
    }
}

customElements.define('zymeup-tracking-detail', TrackingDetailComponent);
