import 'solid-js';

declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'shipzy-epod-list': JSX.HTMLAttributes & {
                token?: string;
                'base-url'?: string;
                'page-size'?: number;
                'status-filter'?: string;
            };
            'shipzy-epod-detail': JSX.HTMLAttributes & {
                token?: string;
                'base-url'?: string;
                'epod-id': string;
            };
            'shipzy-epod-create': JSX.HTMLAttributes & {
                token?: string;
                'base-url'?: string;
                'order-id'?: string;
            };
            'shipzy-epod-login': JSX.HTMLAttributes & {
                token?: string;
                'base-url'?: string;
            };
            'shipzy-epod-signature': JSX.HTMLAttributes & {
                token: string;
                'base-url'?: string;
                lang?: string;
            };
            'shipzy-tracking-list': JSX.HTMLAttributes & {
                token?: string;
                'base-url'?: string;
                'tracking-no'?: string;
            };
            'shipzy-tracking-detail': JSX.HTMLAttributes & {
                token?: string;
                'base-url'?: string;
                'tracking-no'?: string;
            };
        }
    }
}
