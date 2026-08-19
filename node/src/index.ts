// ============ Core imports ============

import { HttpClient, ZymeupError, ZymeupAuthError } from './http-client';
import type { ZymeupConfig, UserRole } from './http-client';
import { DEFAULT_CONFIG } from './http-client';

// ============ Public exports ============

export { HttpClient, ZymeupError, ZymeupAuthError, DEFAULT_CONFIG };
export type { ZymeupConfig, UserRole };

// ============ API Result ============

export interface ApiResult<T> {
    code: number;
    data: T;
    message?: string;
}

// ============ Module Imports ============

import { EpodClient } from './epod';
import { PublicEpodClient } from './public-epod';
import { OrderClient } from './order';
import { EcmrClient } from './ecmr';
import { AddressClient } from './address';
import { CarrierEpodClient } from './carrier-epod';
import { CarrierAddressClient } from './carrier-address';
import { PickupPointClient } from './pickup-points';
import { ShipmentClient } from './shipment';
import { ParcelClient } from './parcel';
import { AgeVerificationClient } from './age-verification';
import { ActivationClient } from './activation';
import { ProductClient } from './product';
import { MerchantAddressClient } from './merchant-address';
import { TrackingClient } from './tracking';
import { FinanceClient } from './finance';
import { ComplianceClient } from './compliance';
import { CPSCClient } from './lib/cpsc/client';
import { DELIVERY_MODES, NOTIFICATION_CHANNELS, validateChannelRequirements } from './notification';
import type { DeliveryMode, ChannelType, NotificationResult } from './notification';
import { CarrierClient } from './carrier';
import { PlatformConfigClient } from './platform';
import { UploadClient } from './upload';
import { ValidationClient } from './validation';
import { SupportTicketClient } from './support_ticket';

// ============ Re-exports from new modules ============

export { EpodClient } from './epod';
export type { EpodListItem, EpodListResponse, EpodDetail, SignUrlResponse } from './epod';

export { PublicEpodClient } from './public-epod';
export type { PublicSignDetail, PublicConsentResponse, PublicCaptureResponse } from './public-epod';

export { OrderClient } from './order';
export type { OrderListItem, OrderListResponse, OrderDetail } from './order';

export { EcmrClient } from './ecmr';
export type { EcmrListItem, EcmrListResponse } from './ecmr';

export { AddressClient } from './address';
export type { Address, AddressListResponse } from './address';

export { CarrierEpodClient } from './carrier-epod';
export { CarrierAddressClient } from './carrier-address';

// ============ VERSION ============

export const VERSION = '2.1.2';

// ============ Main SDK ============

export class ZymeupClient {
    public epod: EpodClient;
    public order: OrderClient;
    public ecmr: EcmrClient;
    public address: AddressClient;
    public carrierEpod: CarrierEpodClient;
    public carrierAddress: CarrierAddressClient;
    public pickupPoints: PickupPointClient;
    public shipment: ShipmentClient;
    public parcel: ParcelClient;
    public ageVerification: AgeVerificationClient;
    public activation: ActivationClient;
    public product: ProductClient;
    public merchantAddress: MerchantAddressClient;
    public tracking: TrackingClient;
    public finance: FinanceClient;
    public compliance: ComplianceClient;
    public publicEpod: PublicEpodClient;
    public cpsc: CPSCClient;
    public role: UserRole;
    public carrier: CarrierClient;
    public platformConfig: PlatformConfigClient;
    public upload: UploadClient;
    public validation: ValidationClient;
    public supportTicket: SupportTicketClient;
    private config: ZymeupConfig;

    constructor(config: Partial<ZymeupConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config } as ZymeupConfig;
        this.role = this.config.role || 'merchant';
        this.epod = new EpodClient(this.config);
        this.order = new OrderClient(this.config);
        this.ecmr = new EcmrClient(this.config);
        this.address = new AddressClient(this.config);
        this.carrierEpod = new CarrierEpodClient(this.config);
        this.carrierAddress = new CarrierAddressClient(this.config);
        this.pickupPoints = new PickupPointClient(this.config);
        this.shipment = new ShipmentClient(this.config);
        this.parcel = new ParcelClient(this.config);
        this.ageVerification = new AgeVerificationClient(this.config);
        this.activation = new ActivationClient(this.config);
        this.product = new ProductClient(this.config);
        this.merchantAddress = new MerchantAddressClient(this.config);
        this.tracking = new TrackingClient(this.config);
        this.finance = new FinanceClient(this.config);
        this.compliance = new ComplianceClient(this.config);
        this.publicEpod = new PublicEpodClient(this.config.baseUrl);
        this.cpsc = new CPSCClient(this.config);
        this.carrier = new CarrierClient(this.config);
        this.platformConfig = new PlatformConfigClient(this.config);
        this.upload = new UploadClient(this.config);
        this.validation = new ValidationClient(this.config);
        this.supportTicket = new SupportTicketClient(this.config);
    }

    updateToken(token: string): void {
        this.config.token = token;
        this.epod.setToken(token);
        this.order.setToken(token);
        this.ecmr.setToken(token);
        this.address.setToken(token);
        this.carrierEpod.setToken(token);
        this.carrierAddress.setToken(token);
        this.pickupPoints.setToken(token);
        this.shipment.setToken(token);
        this.parcel.setToken(token);
        this.ageVerification.setToken(token);
        this.activation.setToken(token);
        this.product.setToken(token);
        this.merchantAddress.setToken(token);
        this.tracking.setToken(token);
        this.finance.setToken(token);
        this.compliance.setToken(token);
        this.cpsc.setToken(token);
        this.carrier.setToken(token);
        this.platformConfig.setToken(token);
        this.upload.setToken(token);
        this.validation.setToken(token);
        this.supportTicket.setToken(token);
    }

    updateConfig(config: Partial<ZymeupConfig>): void {
        if (config.baseUrl) {
            this.config.baseUrl = config.baseUrl;
        }
        if (config.role) {
            this.role = config.role;
            this.config.role = config.role;
        }
        if (config.carrierCode) {
            this.config.carrierCode = config.carrierCode;
        }
        // 同步更新所有子客户端的配置
        this.epod.setConfig(config);
        this.order.setConfig(config);
        this.ecmr.setConfig(config);
        this.address.setConfig(config);
        this.carrierEpod.setConfig(config);
        this.carrierAddress.setConfig(config);
        if (this.pickupPoints) this.pickupPoints.setConfig(config);
        if (this.parcel) this.parcel.setConfig(config);
        if (this.ageVerification) this.ageVerification.setConfig(config);
        if (this.activation) this.activation.setConfig(config);
        if (this.product) this.product.setConfig(config);
        if (this.merchantAddress) this.merchantAddress.setConfig(config);
        if (this.tracking) this.tracking.setConfig(config);
        if (this.finance) this.finance.setConfig(config);
        if (this.compliance) this.compliance.setConfig(config);
        if (this.cpsc) this.cpsc.setConfig(config);
        if (this.carrier) this.carrier.setConfig(config);
        if (this.platformConfig) this.platformConfig.setConfig(config);
        if (this.upload) this.upload.setConfig(config);
        if (this.validation) this.validation.setConfig(config);
    }

    isMerchant(): boolean {
        return this.role === 'merchant';
    }

    isCarrier(): boolean {
        return this.role === 'carrier';
    }
}

// ============ Re-exports ============

export { DELIVERY_MODES, NOTIFICATION_CHANNELS, validateChannelRequirements };
export type { DeliveryMode, ChannelType, NotificationResult };
export type { PickupPoint, PickupPointType, PickupPointStatus, CreatePickupPointRequest, PickupPointListResponse } from './pickup-points';
export type { Shipment, ShipmentDetail, CreateShipmentRequest, ShipmentListResponse } from './shipment';
export type { Parcel } from './parcel';
export type { AgeVerificationEvent, AgeVerificationMethod, AgeMinAge, CreateAgeVerificationRequest } from './age-verification';
export type { Provider, ProviderActivation, Capability, ActivateRequest } from './activation';
export type { Product, ProductStatus, ProductCategory, CreateProductRequest, ProductListResponse } from './product';
export type { TenantAddress, TenantAddressListResponse } from './merchant-address';
export type { TrackingEvent, TrackingDetail, TrackingListItem, TrackingListResponse } from './tracking';
export type { Invoice, Subscription } from './finance';
export type { CustomsDeclaration, CreateCustomsRequest, ComplianceCheckRequest, ComplianceCheckResult, CountryRequirements } from './compliance';
export type {
    CertificateType,
    IdentifierType,
    LabType,
    POCType,
    ProductIdentifier,
    Manufacturer,
    Lab,
    PointOfContact,
    CoreProduct,
    ProductEntry,
    TradePartyEntry,
    Collection,
    APIResponse,
    CollectionsResponse,
    ImportLogResponse,
    ExportResponse,
    TradePartyListResponse,
    ExportFilter,
    CertificateQuery,
    CPSCSettings,
    SaveCredentialRequest,
    ImportRequest,
    CertificatesRequest
} from './lib/cpsc/types';
export { CPSCClient } from './lib/cpsc/client';
export type { Carrier } from './carrier';
export type { PlatformConfig } from './platform';
export { ValidationClient } from './validation';
export type { PhoneVerifyResult, PhoneFormatResult, PostalCodeResult, EmailValidationResult, TaxIdValidationResult } from './validation';
export { SupportTicketClient } from './support_ticket';
export type { SupportTicket, TicketListResponse } from './support_ticket';

// ============ Backward compatibility aliases ============

/** @deprecated Use `ZymeupClient` instead. Alias for backward compatibility. */
export const ShipzyClient = ZymeupClient;
export type { ZymeupConfig as ShipzyConfig } from './http-client';
export { ZymeupError as ShipzyError, ZymeupAuthError as ShipzyAuthError } from './http-client';

// ============ RN (React Native / Expo) ============
// Note: RN module is not re-exported from the main entry point to avoid
// requiring react-native as a dependency. Import directly from '@zymeup/sdk/rn'.
// export { ZymeupProvider, useZymeup, EpodList, EpodDetail, EpodCreate, EpodSignature } from './rn';
// export type { EpodListProps, EpodDetailProps, EpodCreateProps, EpodSignatureProps } from './rn';
