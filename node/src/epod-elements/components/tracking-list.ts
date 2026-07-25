import { EpodBaseComponent } from './base';
import { EpodAuthError, TrackingListItem } from '../api-client';

interface TrackingListState {
    items: TrackingListItem[];
    total: number;
    page: number;
    pageSize: number;
    loading: boolean;
    error: string | null;
}

export class TrackingListComponent extends EpodBaseComponent {
    static get observedAttributes() {
        return ['token', 'base-url', 'page-size', 'status-filter'];
    }

    private state: TrackingListState = {
        items: [],
        total: 0,
        page: 1,
        pageSize: 25,
        loading: true,
        error: null,
    };

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'page-size' && newValue) {
            this.state.pageSize = parseInt(newValue, 10) || 25;
        }
        if (name === 'status-filter' && newValue !== oldValue) {
            this.state.page = 1;
            this.loadData();
        }
    }

    private async loadData() {
        this.state.loading = true;
        this.state.error = null;
        this.render();

        try {
            const result = await this.apiClient.trackingList({
                page: this.state.page,
                page_size: this.state.pageSize,
                status: this.getAttribute('status-filter') || undefined,
            });
            this.state.items = result.data || [];
            this.state.total = result.total;
        } catch (err) {
            if (err instanceof EpodAuthError) {
                this.state.error = 'Authentication required. Please provide a valid token.';
            } else {
                this.state.error = err instanceof Error ? err.message : 'Failed to load tracking data.';
            }
            this.dispatchErrorEvent(err);
        } finally {
            this.state.loading = false;
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

    private dispatchSelectEvent(trackingNo: string) {
        this.dispatchEvent(new CustomEvent('tracking-select', {
            detail: { trackingNo },
            bubbles: true,
            composed: true,
        }));
    }

    private changePage(page: number) {
        const maxPage = Math.ceil(this.state.total / this.state.pageSize);
        if (page < 1 || page > maxPage) return;
        this.state.page = page;
        this.loadData();
    }

    render() {
        this.shadow.innerHTML = '';
        this.injectStyles();

        const container = this.createElement('div', 'epod-container');

        const header = this.createElement('div', 'epod-header');
        const title = this.createElement('h3', 'epod-title');
        title.textContent = 'Tracking';
        header.appendChild(title);

        const total = this.createElement('span');
        total.style.fontSize = '14px';
        total.style.color = 'var(--epod-text-secondary)';
        total.textContent = this.state.total + ' records';
        header.appendChild(total);
        container.appendChild(header);

        const content = this.createElement('div');
        content.style.overflow = 'auto';

        if (this.state.loading) {
            this.showLoading(content);
        } else if (this.state.error) {
            this.showError(content, this.state.error);
        } else if (this.state.items.length === 0) {
            const empty = this.createElement('div', 'epod-empty');
            empty.textContent = 'No tracking records found.';
            content.appendChild(empty);
        } else {
            content.appendChild(this.renderTable());
        }

        container.appendChild(content);

        if (this.state.total > this.state.pageSize && !this.state.loading) {
            container.appendChild(this.renderPagination());
        }

        this.shadow.appendChild(container);
    }

    private renderTable(): HTMLElement {
        const table = this.createElement('table', 'epod-table');
        const thead = this.createElement('thead');
        const headerRow = this.createElement('tr');

        ['Tracking No', 'Carrier', 'Status', 'Last Event', 'Updated', ''].forEach(function(text) {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = this.createElement('tbody');
        for (const item of this.state.items) {
            tbody.appendChild(this.renderRow(item));
        }
        table.appendChild(tbody);

        return table;
    }

    private renderRow(item: TrackingListItem): HTMLElement {
        const row = this.createElement('tr');
        row.style.cursor = 'pointer';

        const tracking = this.createElement('td');
        tracking.textContent = item.tracking_no || '-';
        row.appendChild(tracking);

        const carrier = this.createElement('td');
        carrier.textContent = item.carrier_name || '-';
        row.appendChild(carrier);

        const status = this.createElement('td');
        const statusBadge = this.createElement('span', 'epod-status epod-status-' + (item.status || 'unknown'));
        statusBadge.textContent = item.status || 'unknown';
        status.appendChild(statusBadge);
        row.appendChild(status);

        const latestEvent = this.createElement('td');
        latestEvent.textContent = item.latest_event || '-';
        latestEvent.style.maxWidth = '200px';
        latestEvent.style.overflow = 'hidden';
        latestEvent.style.textOverflow = 'ellipsis';
        latestEvent.style.whiteSpace = 'nowrap';
        row.appendChild(latestEvent);

        const updated = this.createElement('td');
        updated.textContent = item.updated_at
            ? new Date(item.updated_at).toLocaleDateString()
            : '-';
        row.appendChild(updated);

        const action = this.createElement('td');
        const viewBtn = this.createElement('button', 'epod-btn epod-btn-outline');
        viewBtn.textContent = 'View';
        viewBtn.style.padding = '4px 12px';
        viewBtn.style.fontSize = '12px';
        viewBtn.onclick = function(e) {
            e.stopPropagation();
        };
        action.appendChild(viewBtn);
        row.appendChild(action);

        const self = this;
        row.onclick = function() {
            self.dispatchSelectEvent(item.tracking_no);
        };

        return row;
    }

    private renderPagination(): HTMLElement {
        const pagination = this.createElement('div', 'epod-pagination');
        const maxPage = Math.ceil(this.state.total / this.state.pageSize);

        const info = this.createElement('span');
        info.style.fontSize = '14px';
        info.style.color = 'var(--epod-text-secondary)';
        info.textContent = 'Page ' + this.state.page + ' of ' + maxPage;
        pagination.appendChild(info);

        const buttons = this.createElement('div');
        buttons.style.display = 'flex';
        buttons.style.gap = '8px';

        const self = this;

        const prevBtn = this.createElement('button', 'epod-btn epod-btn-outline');
        prevBtn.textContent = 'Previous';
        prevBtn.disabled = this.state.page <= 1;
        prevBtn.onclick = function() {
            self.changePage(self.state.page - 1);
        };
        buttons.appendChild(prevBtn);

        const nextBtn = this.createElement('button', 'epod-btn epod-btn-outline');
        nextBtn.textContent = 'Next';
        nextBtn.disabled = this.state.page >= maxPage;
        nextBtn.onclick = function() {
            self.changePage(self.state.page + 1);
        };
        buttons.appendChild(nextBtn);

        pagination.appendChild(buttons);

        return pagination;
    }
}

customElements.define('zymeup-tracking-list', TrackingListComponent);
