import { createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { JSX } from 'solid-js';
import { ZymeupClient } from '../src/index';
import type { ZymeupConfig } from '../src/http-client';

// ============ Re-export epod elements (Web Components work natively in Solid.js) ============

export { EpodApiClient, EpodAuthError, EpodApiError } from '../src/epod-elements/api-client';
export type { EpodApiClientConfig, TrackingEvent, TrackingDetail, TrackingListItem, TrackingListResponse } from '../src/epod-elements/api-client';
export { epodAuth, EpodAuthManager } from '../src/epod-elements/auth';
export type { AuthState } from '../src/epod-elements/auth';
export { Epod } from '../src/epod-elements/imperative-api';
export type { ShowListOptions, ShowDetailOptions, ShowCreateOptions } from '../src/epod-elements/imperative-api';
export { registerEpodElements } from '../src/epod-elements';
export { TrackingListComponent } from '../src/epod-elements/components/tracking-list';
export { TrackingDetailComponent } from '../src/epod-elements/components/tracking-detail';

// ============ Re-export main SDK clients directly from source ============

export { ZymeupClient, HttpClient, ZymeupError, ZymeupAuthError, DEFAULT_CONFIG } from '../src/index';
export { EpodClient } from '../src/epod';
export { PublicEpodClient } from '../src/public-epod';
export { OrderClient } from '../src/order';
export { EcmrClient } from '../src/ecmr';
export { AddressClient } from '../src/address';
export { CarrierEpodClient } from '../src/carrier-epod';
export { CarrierAddressClient } from '../src/carrier-address';
export { PickupPointClient } from '../src/pickup-points';
export { ShipmentClient } from '../src/shipment';
export { ParcelClient } from '../src/parcel';
export { AgeVerificationClient } from '../src/age-verification';
export { ActivationClient } from '../src/activation';
export { ProductClient } from '../src/product';
export { MerchantAddressClient } from '../src/merchant-address';
export { TrackingClient } from '../src/tracking';
export { FinanceClient } from '../src/finance';
export { ComplianceClient } from '../src/compliance';
export { CPSCClient } from '../src/lib/cpsc/client';
export { CarrierClient } from '../src/carrier';
export { PlatformConfigClient } from '../src/platform';
export { UploadClient } from '../src/upload';
export { ValidationClient } from '../src/validation';
export { SupportTicketClient } from '../src/support_ticket';
export { DELIVERY_MODES, NOTIFICATION_CHANNELS, validateChannelRequirements } from '../src/notification';

// ============ Re-export types directly from source ============

export type { ApiResult, UserRole } from '../src/index';
export type { DeliveryMode, ChannelType, NotificationResult } from '../src/notification';
export type { EpodDetail, SignUrlResponse, EpodListItem, EpodListResponse } from '../src/epod';
export type { OrderListItem, OrderListResponse, OrderDetail } from '../src/order';
export type { EcmrListItem, EcmrListResponse } from '../src/ecmr';
export type { Address, AddressListResponse } from '../src/address';
export type { PickupPoint, PickupPointType, PickupPointStatus, CreatePickupPointRequest, PickupPointListResponse } from '../src/pickup-points';
export type { Shipment, ShipmentDetail, CreateShipmentRequest, ShipmentListResponse } from '../src/shipment';
export type { Parcel } from '../src/parcel';
export type { AgeVerificationEvent, AgeVerificationMethod, AgeMinAge, CreateAgeVerificationRequest } from '../src/age-verification';
export type { Provider, ProviderActivation, Capability, ActivateRequest } from '../src/activation';
export type { Product, ProductStatus, ProductCategory, CreateProductRequest, ProductListResponse } from '../src/product';
export type { TenantAddress, TenantAddressListResponse } from '../src/merchant-address';
export type { Invoice, Subscription } from '../src/finance';
export type { CustomsDeclaration, CreateCustomsRequest, ComplianceCheckRequest, ComplianceCheckResult, CountryRequirements } from '../src/compliance';
export type { Carrier } from '../src/carrier';
export type { PlatformConfig } from '../src/platform';
export type { PhoneVerifyResult, PhoneFormatResult, PostalCodeResult, EmailValidationResult, TaxIdValidationResult } from '../src/validation';
export type { SupportTicket, TicketListResponse } from '../src/support_ticket';
export type {
    CertificateType, IdentifierType, LabType, POCType, ProductIdentifier,
    Manufacturer, Lab, PointOfContact, CoreProduct, ProductEntry, TradePartyEntry,
    Collection, APIResponse, CollectionsResponse, ImportLogResponse, ExportResponse,
    TradePartyListResponse, ExportFilter, CertificateQuery, CPSCSettings,
    SaveCredentialRequest, ImportRequest, CertificatesRequest,
} from '../src/lib/cpsc/types';
export type { PublicSignDetail, PublicConsentResponse, PublicCaptureResponse } from '../src/public-epod';
export type { ZymeupConfig } from '../src/http-client';

// ============ Solid.js Context & Provider ============

export interface ZymeupSolidContext {
    config: ZymeupConfig;
    client: ZymeupClient;
}

export interface ZymeupSolidStore {
    config: ZymeupConfig;
    client: ZymeupClient;
}

const ZymeupContext = createContext<ZymeupSolidContext>();

export interface ZymeupProviderProps {
    config: ZymeupConfig;
    children: JSX.Element;
}

export function ZymeupProvider(props: ZymeupProviderProps) {
    const [store] = createStore<ZymeupSolidContext>({
        config: { ...props.config },
        client: new ZymeupClient(props.config),
    });

    return (
        <ZymeupContext.Provider value={store}>
            {props.children}
        </ZymeupContext.Provider>
    );
}

export function createZymeup(): ZymeupSolidContext {
    const ctx = useContext(ZymeupContext);
    if (!ctx) {
        throw new Error('createZymeup must be used within a ZymeupProvider');
    }
    return ctx;
}

export { createZymeup as useZymeup };

// ============ Solid.js Web Component Bindings ============

export interface SolidEpodListProps {
    token?: string;
    baseUrl?: string;
    pageSize?: number;
    statusFilter?: string;
    onSelect?: (epodId: string) => void;
    onError?: (error: { message: string; code: number }) => void;
}

export function SolidEpodList(props: SolidEpodListProps) {
    const ref = (el: HTMLElement) => {
        const list = el as HTMLElement & {
            addEventListener: (type: string, handler: (e: Event) => void) => void;
        };
        if (props.onSelect) {
            list.addEventListener('epod-select', (e: Event) => {
                const ce = e as CustomEvent;
                props.onSelect!(ce.detail.epodId);
            });
        }
        if (props.onError) {
            list.addEventListener('error', (e: Event) => {
                const ce = e as CustomEvent;
                props.onError!(ce.detail);
            });
        }
    };

    return (
        <shipzy-epod-list
            ref={ref}
            token={props.token}
            base-url={props.baseUrl}
            page-size={props.pageSize}
            status-filter={props.statusFilter}
        />
    );
}

export interface SolidEpodDetailProps {
    token?: string;
    baseUrl?: string;
    epodId: string;
    onSignUrlGenerated?: (data: { signUrl: string }) => void;
    onError?: (error: { message: string; code: number }) => void;
}

export function SolidEpodDetail(props: SolidEpodDetailProps) {
    const ref = (el: HTMLElement) => {
        const detail = el as HTMLElement & {
            addEventListener: (type: string, handler: (e: Event) => void) => void;
        };
        if (props.onSignUrlGenerated) {
            detail.addEventListener('sign-url-generated', (e: Event) => {
                const ce = e as CustomEvent;
                props.onSignUrlGenerated!(ce.detail);
            });
        }
        if (props.onError) {
            detail.addEventListener('error', (e: Event) => {
                const ce = e as CustomEvent;
                props.onError!(ce.detail);
            });
        }
    };

    return (
        <shipzy-epod-detail
            ref={ref}
            token={props.token}
            base-url={props.baseUrl}
            epod-id={props.epodId}
        />
    );
}

export interface SolidEpodCreateProps {
    token?: string;
    baseUrl?: string;
    orderId?: string;
    onCreate?: (epodId: string) => void;
    onError?: (error: { message: string; code: number }) => void;
}

export function SolidEpodCreate(props: SolidEpodCreateProps) {
    const ref = (el: HTMLElement) => {
        const create = el as HTMLElement & {
            addEventListener: (type: string, handler: (e: Event) => void) => void;
        };
        if (props.onCreate) {
            create.addEventListener('created', (e: Event) => {
                const ce = e as CustomEvent;
                props.onCreate!(ce.detail.epodId);
            });
        }
        if (props.onError) {
            create.addEventListener('error', (e: Event) => {
                const ce = e as CustomEvent;
                props.onError!(ce.detail);
            });
        }
    };

    return (
        <shipzy-epod-create
            ref={ref}
            token={props.token}
            base-url={props.baseUrl}
            order-id={props.orderId}
        />
    );
}

export interface SolidEpodSignatureProps {
    token: string;
    baseUrl?: string;
    lang?: string;
    onComplete?: (data: { evidenceHash: string; epodId: string }) => void;
    onError?: (error: { message: string }) => void;
}

export function SolidEpodSignature(props: SolidEpodSignatureProps) {
    const ref = (el: HTMLElement) => {
        const sig = el as HTMLElement & {
            addEventListener: (type: string, handler: (e: Event) => void) => void;
        };
        if (props.onComplete) {
            sig.addEventListener('signature-complete', (e: Event) => {
                const ce = e as CustomEvent;
                props.onComplete!(ce.detail);
            });
        }
        if (props.onError) {
            sig.addEventListener('error', (e: Event) => {
                const ce = e as CustomEvent;
                props.onError!(ce.detail);
            });
        }
    };

    return (
        <shipzy-epod-signature
            ref={ref}
            token={props.token}
            base-url={props.baseUrl}
            lang={props.lang}
        />
    );
}
