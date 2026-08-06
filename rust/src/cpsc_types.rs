use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Collection {
    #[serde(rename = "collectionId")]
    pub collection_id: String,
    #[serde(rename = "collectionName")]
    pub collection_name: String,
    #[serde(rename = "userRole")]
    pub user_role: Vec<String>,
}

#[derive(Debug, Deserialize)]
pub struct BusinessAccount {
    #[serde(rename = "certifierId")]
    pub certifier_id: String,
    #[serde(rename = "companyName")]
    pub company_name: String,
    #[serde(rename = "collectionList")]
    pub collection_list: Vec<Collection>,
}

#[derive(Debug, Deserialize)]
pub struct CollectionsResponse {
    #[serde(rename = "statusCode")]
    pub status_code: String,
    #[serde(rename = "statusMessage")]
    pub status_message: String,
    #[serde(rename = "businessAccountList")]
    pub business_account_list: Vec<BusinessAccount>,
}

#[derive(Debug, Deserialize)]
pub struct TokenExpirationResponse {
    #[serde(rename = "expiration")]
    pub expiration: String,
}

#[derive(Debug, Deserialize)]
pub struct ImportLogResponse {
    #[serde(rename = "statusCode")]
    pub status_code: String,
    #[serde(rename = "statusMessage")]
    pub status_message: String,
    #[serde(rename = "importId")]
    pub import_id: Option<String>,
    #[serde(rename = "importStatus")]
    pub import_status: Option<String>,
    #[serde(rename = "percentComplete")]
    pub percent_complete: Option<String>,
    #[serde(rename = "productList")]
    pub product_list: Vec<serde_json::Value>,
}

#[derive(Debug, Deserialize)]
pub struct ExportResponse {
    #[serde(rename = "statusCode")]
    pub status_code: String,
    #[serde(rename = "statusMessage")]
    pub status_message: String,
    #[serde(rename = "exportId")]
    pub export_id: Option<String>,
    #[serde(rename = "exportStatus")]
    pub export_status: Option<String>,
    #[serde(rename = "productList")]
    pub product_list: Vec<serde_json::Value>,
}

#[derive(Debug, Deserialize)]
pub struct TradePartyEntry {
    #[serde(rename = "tradePartyType")]
    pub trade_party_type: String,
    #[serde(rename = "tradePartyName")]
    pub trade_party_name: String,
    #[serde(rename = "division")]
    pub division: Option<String>,
    #[serde(rename = "gln")]
    pub gln: Option<String>,
    #[serde(rename = "alternateId")]
    pub alternate_id: Option<String>,
    pub email: Option<String>,
    pub website: Option<String>,
    #[serde(rename = "addressLine1")]
    pub address_line1: Option<String>,
    #[serde(rename = "addressLine2")]
    pub address_line2: Option<String>,
    pub city: Option<String>,
    #[serde(rename = "stateProvince")]
    pub state_province: Option<String>,
    #[serde(rename = "postalCode")]
    pub postal_code: Option<String>,
    pub country: Option<String>,
    pub phone: Option<String>,
    #[serde(rename = "smallBatchManufacturerId")]
    pub small_batch_manufacturer_id: Option<String>,
    #[serde(rename = "aptNumber")]
    pub apt_number: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct TradePartyListResponse {
    #[serde(rename = "statusCode")]
    pub status_code: String,
    #[serde(rename = "statusMessage")]
    pub status_message: String,
    #[serde(rename = "tradePartyList")]
    pub trade_party_list: Vec<TradePartyEntry>,
}

#[derive(Debug, Deserialize)]
pub struct CPSCSettings {
    #[serde(rename = "certifierId")]
    pub certifier_id: String,
    #[serde(rename = "collectionId")]
    pub collection_id: String,
    #[serde(rename = "isProduction")]
    pub is_production: bool,
    pub status: Option<String>,
    #[serde(rename = "tokenExpiresAt")]
    pub token_expires_at: Option<String>,
    #[serde(rename = "lastVerifiedAt")]
    pub last_verified_at: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct SaveCredentialResponse {
    #[serde(rename = "statusCode")]
    pub status_code: String,
    #[serde(rename = "statusMessage")]
    pub status_message: String,
    #[serde(rename = "tokenExpiration")]
    pub token_expiration: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ImportResponse {
    #[serde(rename = "importId")]
    pub import_id: String,
    #[serde(rename = "statusCode")]
    pub status_code: String,
    #[serde(rename = "statusMessage")]
    pub status_message: String,
}

#[derive(Debug, Deserialize)]
pub struct CertificatesResponse {
    #[serde(rename = "statusCode")]
    pub status_code: String,
    #[serde(rename = "statusMessage")]
    pub status_message: String,
    #[serde(rename = "productList")]
    pub product_list: Vec<serde_json::Value>,
}
