export type CertificateType = 'GCC' | 'CPC';
export type IdentifierType = 'GTIN' | 'UPC' | 'SKU' | 'Model #' | 'Serial #' | 'Registered #' | 'Alternate ID';
export type LabType = 'ITL' | 'LAB';
export type LotAssignedBy = 'Manufacturer' | 'Seller';
export type POCType = 'Importer' | 'Manufacturer' | 'Laboratory' | 'Broker' | 'Other';
export type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type ExportStatus = 'Started' | 'Completed' | 'Failed' | '';

export interface ProductIdentifier {
    identifier: string;
    identType: IdentifierType;
}

export interface Manufacturer {
    gln?: string;
    alternateId: string;
    sbmId?: string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    aptNumber?: string;
    city: string;
    stateProvince: string;
    country: string;
    postalCode: string;
    phone: string;
    email: string;
}

export interface Lab {
    type: LabType;
    cpscId?: string;
    gln?: string;
    alternateId?: string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    aptNumber?: string;
    city: string;
    stateProvince: string;
    country: string;
    postalCode: string;
    phone: string;
    email: string;
    citationCodes: string[];
    testReportId?: string;
    testURL?: string;
    testReportAccessKey?: string;
    isComponent?: string;
    componentDescription?: string;
}

export interface PointOfContact {
    type: POCType;
    gln?: string;
    alternateId?: string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    aptNumber?: string;
    city: string;
    stateProvince: string;
    country: string;
    postalCode: string;
    phone: string;
    email: string;
}

export interface DirectiveParty {
    isNew?: string;
    gln?: string;
    alternateId?: string;
}

export interface DirectiveLabParty extends DirectiveParty {}

export interface Directives {
    productUpdate: string;
    versionIdToUpdate?: string;
    manufacturer: DirectiveParty;
    labs: DirectiveLabParty[];
    poc: DirectiveParty;
}

export interface ProductMetadata {
    isLatestVersion: string;
    status: string;
    isArchived: string;
    completedVersions: string[];
}

export interface CPSCError {
    errorCode: string;
    errorField: string;
    errorMessage: string;
}

export interface Validations {
    importedInd: string;
    errorDetectedInd: string;
    errors: CPSCError[];
}

export interface CoreProduct {
    versionId?: string;
    primaryProductId: string;
    primaryProductIdType: IdentifierType;
    identifiers?: ProductIdentifier[];
    certificateType: CertificateType;
    name: string;
    tradeBrandName?: string;
    description?: string;
    color?: string;
    style?: string;
    manufacturer: Manufacturer;
    manufactureDate: string;
    productionStartDate?: string;
    productionEndDate?: string;
    lotNumber?: string;
    lotNumberAssignedBy?: LotAssignedBy;
    lastTestDate: string;
    labs: Lab[];
    exemptions?: string[];
    poc: PointOfContact;
}

export interface ProductEntry {
    coreProduct: CoreProduct;
    directives?: Directives;
    productMetadata?: ProductMetadata;
    validations?: Validations;
}

export interface ProductListEnvelope {
    productList: ProductEntry[];
}

export interface TradePartyEntry {
    tradePartyType: string;
    tradePartyName: string;
    division?: string;
    gln?: string;
    alternateId?: string;
    email?: string;
    website?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    stateProvince?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    smallBatchManufacturerId?: string;
    aptNumber?: string;
}

export interface Collection {
    collectionId: string;
    collectionName: string;
    userRole: string[];
}

export interface BusinessAccount {
    certifierId: string;
    companyName: string;
    collectionList: Collection[];
}

export interface APIResponse {
    statusCode: string;
    statusMessage: string;
    importId?: string;
    importStatus?: string;
    percentComplete?: string;
    exportId?: string;
    exportStatus?: ExportStatus;
    tokenExpiration?: string;
}

export interface CollectionsResponse extends APIResponse {
    businessAccountList: BusinessAccount[];
}

export interface ImportLogResponse extends APIResponse {
    productList: ProductEntry[];
}

export interface ExportResponse extends APIResponse {
    productList: ProductEntry[];
}

export interface TradePartyListResponse extends APIResponse {
    tradePartyList: TradePartyEntry[];
}

export interface ExportFilter {
    typeOfDate?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    visibility?: string;
    searchTerm?: string;
    searchOn?: string;
}

export interface CertificateQuery {
    productId: string;
    version?: string;
}

export interface CPSCSettings {
    certifierId: string;
    collectionId: string;
    isProduction: boolean;
    status?: string;
    tokenExpiresAt?: string;
    lastVerifiedAt?: string;
}

export interface SaveCredentialRequest {
    certifierId: string;
    collectionId: string;
    jwtSecret: string;
    apiSecret: string;
    isProduction: boolean;
}

export interface ImportRequest {
    entries: ProductEntry[];
    doCertify?: boolean;
}

export interface CertificatesRequest {
    queries: CertificateQuery[];
}
