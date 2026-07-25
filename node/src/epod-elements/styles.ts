export const epodSharedStyles = `
:host {
    --epod-primary: #3b82f6;
    --epod-primary-hover: #2563eb;
    --epod-success: #22c55e;
    --epod-warning: #f59e0b;
    --epod-danger: #ef4444;
    --epod-bg: #ffffff;
    --epod-bg-secondary: #f9fafb;
    --epod-text: #1f2937;
    --epod-text-secondary: #6b7280;
    --epod-border: #e5e7eb;
    --epod-radius: 8px;
    --epod-font: system-ui, -apple-system, sans-serif;
    --epod-shadow: 0 1px 3px rgba(0,0,0,0.1);

    display: block;
    font-family: var(--epod-font);
    color: var(--epod-text);
    line-height: 1.5;
}

.epod-container {
    background: var(--epod-bg);
    border: 1px solid var(--epod-border);
    border-radius: var(--epod-radius);
    box-shadow: var(--epod-shadow);
    overflow: hidden;
}

.epod-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid var(--epod-border);
    background: var(--epod-bg-secondary);
}

.epod-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
}

.epod-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: none;
    border-radius: calc(var(--epod-radius) / 2);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s;
}

.epod-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.epod-btn-primary {
    background: var(--epod-primary);
    color: white;
}
.epod-btn-primary:hover:not(:disabled) {
    background: var(--epod-primary-hover);
}

.epod-btn-outline {
    background: transparent;
    border: 1px solid var(--epod-border);
    color: var(--epod-text);
}

.epod-btn-outline:hover:not(:disabled) {
    background: var(--epod-bg-secondary);
}

.epod-table {
    width: 100%;
    border-collapse: collapse;
}

.epod-table th,
.epod-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid var(--epod-border);
}

.epod-table th {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--epod-text-secondary);
    background: var(--epod-bg-secondary);
}

.epod-table tr:hover td {
    background: var(--epod-bg-secondary);
}

.epod-status {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 500;
}

.epod-status-pending { background: #fef3c7; color: #92400e; }
.epod-status-delivered { background: #dcfce7; color: #166534; }
.epod-status-failed { background: #fee2e2; color: #991b1b; }
.epod-status-partial { background: #ffedd5; color: #9a3412; }
.epod-status-in_transit { background: #dbeafe; color: #1e40af; }
.epod-status-out_for_delivery { background: #ffedd5; color: #9a3412; }
.epod-status-exception { background: #fee2e2; color: #991b1b; }

.epod-timeline {
    position: relative;
    padding-left: 24px;
    border-left: 2px solid var(--epod-border);
}

.epod-timeline-item {
    position: relative;
    padding-bottom: 20px;
}

.epod-timeline-item:last-child {
    padding-bottom: 0;
}

.epod-timeline-item::before {
    content: '';
    position: absolute;
    left: -29px;
    top: 4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--epod-primary);
    border: 2px solid var(--epod-bg);
}

.epod-timeline-time {
    font-size: 12px;
    color: var(--epod-text-secondary);
    margin-top: 4px;
}

.epod-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid var(--epod-border);
}

.epod-empty {
    padding: 48px 16px;
    text-align: center;
    color: var(--epod-text-secondary);
}

.epod-error {
    padding: 16px;
    background: #fee2e2;
    color: #991b1b;
    border-radius: var(--epod-radius);
    margin: 16px;
}

.epod-loading {
    padding: 48px 16px;
    text-align: center;
    color: var(--epod-text-secondary);
}

@media (prefers-color-scheme: dark) {
    :host {
        --epod-bg: #1f2937;
        --epod-bg-secondary: #111827;
        --epod-text: #f9fafb;
        --epod-text-secondary: #9ca3af;
        --epod-border: #374151;
        --epod-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }
    .epod-status-pending { background: #78350f; color: #fde68a; }
    .epod-status-delivered { background: #14532d; color: #bbf7d0; }
    .epod-status-failed { background: #7f1d1d; color: #fecaca; }
    .epod-status-partial { background: #7c2d12; color: #fed7aa; }
}
`;
