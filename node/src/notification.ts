// ============ Notification Constants ============

export type DeliveryMode = 'carrier' | 'self-delivery' | 'self-pickup';
export type ChannelType = 'email' | 'copy_url' | 'sms' | 'whatsapp';

export interface NotificationResult {
    channel: ChannelType;
    status: 'sent' | 'skipped' | 'failed' | 'url_only';
    message?: string;
    url?: string;
    error?: string;
}

export const DELIVERY_MODES: Array<{
    key: DeliveryMode;
    label: string;
    description: string;
}> = [
    { key: 'carrier', label: 'Carrier', description: 'Third-party carrier delivery (default)' },
    { key: 'self-delivery', label: 'Self-delivery', description: 'Merchant staff delivers' },
    { key: 'self-pickup', label: 'Self-pickup', description: 'Customer picks up at store/locker' },
];

export const NOTIFICATION_CHANNELS: Array<{
    key: ChannelType;
    label: string;
    icon: string;
    description: string;
    requires: 'email' | 'phone' | 'none';
}> = [
    { key: 'email', label: 'Email', icon: '\u{1F4E7}', description: 'Send signing invitation email (recommended)', requires: 'email' },
    { key: 'copy_url', label: 'Copy URL', icon: '\u{1F517}', description: 'Generate signing URL for manual sharing', requires: 'none' },
    { key: 'sms', label: 'SMS', icon: '\u{1F4F1}', description: 'Requires activated SMS provider', requires: 'phone' },
    { key: 'whatsapp', label: 'WhatsApp', icon: '\u{1F4AC}', description: 'Requires activated WhatsApp provider', requires: 'phone' },
];

export function validateChannelRequirements(
    channels: ChannelType[],
    recipient: { email?: string; phone?: string }
): string[] {
    const missing: string[] = [];
    const needEmail = channels.includes('email');
    const needPhone = channels.some((c) => c === 'sms' || c === 'whatsapp');
    if (needEmail && !recipient.email) missing.push('email');
    if (needPhone && !recipient.phone) missing.push('phone');
    return missing;
}
