import React, { useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';

// ============ Types ============

export interface ShipzyConfig {
    baseUrl?: string;
    token?: string;
    timeout?: number;
    role?: 'merchant' | 'carrier';
    carrierCode?: string;
}

interface ShipzyContextValue {
    config: ShipzyConfig;
}

// ============ Context ============

const ShipzyContext = createContext<ShipzyContextValue>({
    config: { baseUrl: 'https://api.shipzy.me' },
});

export function useShipzy() {
    return useContext(ShipzyContext);
}

// ============ Provider ============

export interface ShipzyProviderProps {
    config: ShipzyConfig;
    children: React.ReactNode;
}

export function ShipzyProvider({ config, children }: ShipzyProviderProps) {
    return (
        <ShipzyContext.Provider value={{ config }}>
            {children}
        </ShipzyContext.Provider>
    );
}

// ============ WebView HTML Generator ============

function generateHtml(component: string, props: Record<string, any>): string {
    const attrs = Object.entries(props)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}="${v}"`)
        .join(' ');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        shipzy-epod-list, shipzy-epod-detail, shipzy-epod-create, shipzy-epod-signature { display: block; }
    </style>
</head>
<body>
    <${component} ${attrs}></${component}>
    <script>
        function postMessage(type, detail) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type, detail }));
        }

        document.addEventListener('epod-select', (e) => postMessage('epod-select', e.detail));
        document.addEventListener('sign-url-generated', (e) => postMessage('sign-url-generated', e.detail));
        document.addEventListener('created', (e) => postMessage('created', e.detail));
        document.addEventListener('signature-complete', (e) => postMessage('signature-complete', e.detail));
        document.addEventListener('error', (e) => postMessage('error', e.detail));
    </script>
</body>
</html>`;
}

// ============ EpodList ============

export interface EpodListProps {
    token?: string;
    baseUrl?: string;
    pageSize?: number;
    statusFilter?: string;
    onSelect?: (epodId: string) => void;
    onError?: (error: { message: string; code: number }) => void;
    style?: StyleProp<ViewStyle>;
}

export function EpodList({ token, baseUrl, pageSize, statusFilter, onSelect, onError, style }: EpodListProps) {
    const webViewRef = useRef<WebView>(null);
    const { config } = useShipzy();

    const onMessage = useCallback((event: WebViewMessageEvent) => {
        const { type, detail } = JSON.parse(event.nativeEvent.data);
        if (type === 'epod-select' && onSelect) onSelect(detail.epodId);
        if (type === 'error' && onError) onError(detail);
    }, [onSelect, onError]);

    const html = generateHtml('shipzy-epod-list', {
        token: token || config.token,
        'base-url': baseUrl || config.baseUrl,
        'page-size': pageSize,
        'status-filter': statusFilter,
    });

    return (
        <View style={[styles.container, style]}>
            <WebView
                ref={webViewRef}
                source={{ html }}
                onMessage={onMessage}
                javaScriptEnabled
                domStorageEnabled
                scalesPageToFit
                style={styles.webview}
            />
        </View>
    );
}

// ============ EpodDetail ============

export interface EpodDetailProps {
    token?: string;
    baseUrl?: string;
    epodId: string;
    onSignUrlGenerated?: (data: { signUrl: string }) => void;
    onError?: (error: { message: string; code: number }) => void;
    style?: StyleProp<ViewStyle>;
}

export function EpodDetail({ token, baseUrl, epodId, onSignUrlGenerated, onError, style }: EpodDetailProps) {
    const webViewRef = useRef<WebView>(null);
    const { config } = useShipzy();

    const onMessage = useCallback((event: WebViewMessageEvent) => {
        const { type, detail } = JSON.parse(event.nativeEvent.data);
        if (type === 'sign-url-generated' && onSignUrlGenerated) onSignUrlGenerated(detail);
        if (type === 'error' && onError) onError(detail);
    }, [onSignUrlGenerated, onError]);

    const html = generateHtml('shipzy-epod-detail', {
        token: token || config.token,
        'base-url': baseUrl || config.baseUrl,
        'epod-id': epodId,
    });

    return (
        <View style={[styles.container, style]}>
            <WebView
                ref={webViewRef}
                source={{ html }}
                onMessage={onMessage}
                javaScriptEnabled
                domStorageEnabled
                scalesPageToFit
                style={styles.webview}
            />
        </View>
    );
}

// ============ EpodCreate ============

export interface EpodCreateProps {
    token?: string;
    baseUrl?: string;
    orderId?: string;
    onCreate?: (epodId: string) => void;
    onError?: (error: { message: string; code: number }) => void;
    style?: StyleProp<ViewStyle>;
}

export function EpodCreate({ token, baseUrl, orderId, onCreate, onError, style }: EpodCreateProps) {
    const webViewRef = useRef<WebView>(null);
    const { config } = useShipzy();

    const onMessage = useCallback((event: WebViewMessageEvent) => {
        const { type, detail } = JSON.parse(event.nativeEvent.data);
        if (type === 'created' && onCreate) onCreate(detail.epodId);
        if (type === 'error' && onError) onError(detail);
    }, [onCreate, onError]);

    const html = generateHtml('shipzy-epod-create', {
        token: token || config.token,
        'base-url': baseUrl || config.baseUrl,
        'order-id': orderId,
    });

    return (
        <View style={[styles.container, style]}>
            <WebView
                ref={webViewRef}
                source={{ html }}
                onMessage={onMessage}
                javaScriptEnabled
                domStorageEnabled
                scalesPageToFit
                style={styles.webview}
            />
        </View>
    );
}

// ============ EpodSignature ============

export interface EpodSignatureProps {
    token: string;
    baseUrl?: string;
    lang?: string;
    onComplete?: (data: { evidenceHash: string; epodId: string }) => void;
    onError?: (error: { message: string }) => void;
    style?: StyleProp<ViewStyle>;
}

export function EpodSignature({ token, baseUrl, lang, onComplete, onError, style }: EpodSignatureProps) {
    const webViewRef = useRef<WebView>(null);
    const { config } = useShipzy();

    const onMessage = useCallback((event: WebViewMessageEvent) => {
        const { type, detail } = JSON.parse(event.nativeEvent.data);
        if (type === 'signature-complete' && onComplete) onComplete(detail);
        if (type === 'error' && onError) onError(detail);
    }, [onComplete, onError]);

    const html = generateHtml('shipzy-epod-signature', {
        token: token || config.token,
        'base-url': baseUrl || config.baseUrl,
        lang,
    });

    return (
        <View style={[styles.container, style]}>
            <WebView
                ref={webViewRef}
                source={{ html }}
                onMessage={onMessage}
                javaScriptEnabled
                domStorageEnabled
                scalesPageToFit
                style={styles.webview}
            />
        </View>
    );
}

// ============ Styles ============

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 200,
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});
