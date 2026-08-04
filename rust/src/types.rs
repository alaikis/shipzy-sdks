use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PaginatedResponse<T> {
    pub data: Vec<T>,
    pub total: i64,
    pub page: i32,
    #[serde(rename = "page_size")]
    pub page_size: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ListResponse<T> {
    pub data: Vec<T>,
    pub total: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AddressItem {
    pub id: String,
    #[serde(rename = "full_name")]
    pub full_name: Option<String>,
    #[serde(rename = "company_name")]
    pub company_name: Option<String>,
    pub street: Option<String>,
    #[serde(rename = "house_number")]
    pub house_number: Option<String>,
    pub unit: Option<String>,
    pub building: Option<String>,
    pub district: Option<String>,
    pub city: Option<String>,
    pub province: Option<String>,
    #[serde(rename = "province_code")]
    pub province_code: Option<String>,
    #[serde(rename = "country_code")]
    pub country_code: Option<String>,
    #[serde(rename = "postal_code")]
    pub postal_code: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    #[serde(rename = "formatted_address")]
    pub formatted_address: Option<String>,
    #[serde(rename = "is_default")]
    pub is_default: Option<bool>,
    #[serde(rename = "created_at")]
    pub created_at: Option<String>,
    #[serde(rename = "updated_at")]
    pub updated_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TenantAddress {
    pub id: String,
    #[serde(rename = "full_name")]
    pub full_name: Option<String>,
    #[serde(rename = "company_name")]
    pub company_name: Option<String>,
    pub street: Option<String>,
    #[serde(rename = "house_number")]
    pub house_number: Option<String>,
    #[serde(rename = "postal_code")]
    pub postal_code: Option<String>,
    pub city: Option<String>,
    #[serde(rename = "country_code")]
    pub country_code: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    #[serde(rename = "is_default")]
    pub is_default: Option<bool>,
    #[serde(rename = "created_at")]
    pub created_at: Option<String>,
    #[serde(rename = "updated_at")]
    pub updated_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OrderListItem {
    pub id: String,
    #[serde(rename = "order_no")]
    pub order_no: String,
    pub status: String,
    #[serde(rename = "customer_name")]
    pub customer_name: Option<String>,
    #[serde(rename = "total_amount")]
    pub total_amount: Option<f64>,
    pub currency: Option<String>,
    #[serde(rename = "created_at")]
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EpodListItem {
    pub id: String,
    #[serde(rename = "tracking_no")]
    pub tracking_no: String,
    pub status: String,
    #[serde(rename = "recipient_name")]
    pub recipient_name: Option<String>,
    #[serde(rename = "created_at")]
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EpodDetail {
    pub id: String,
    #[serde(rename = "tracking_no")]
    pub tracking_no: String,
    pub status: String,
    #[serde(rename = "recipient_name")]
    pub recipient_name: Option<String>,
    #[serde(rename = "recipient_phone")]
    pub recipient_phone: Option<String>,
    #[serde(rename = "created_at")]
    pub created_at: String,
    #[serde(rename = "updated_at")]
    pub updated_at: String,
    #[serde(rename = "sign_url")]
    pub sign_url: Option<String>,
    #[serde(rename = "evidence_hash")]
    pub evidence_hash: Option<String>,
    #[serde(rename = "document_hash")]
    pub document_hash: Option<String>,
    #[serde(rename = "signature_data")]
    pub signature_data: Option<String>,
    #[serde(rename = "photo_url")]
    pub photo_url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SignUrlResponse {
    #[serde(rename = "sign_url")]
    pub sign_url: String,
    #[serde(rename = "sign_token_expires_at")]
    pub sign_token_expires_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PdfResponse {
    pub status: String,
    #[serde(rename = "pdf_url")]
    pub pdf_url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EcmrListItem {
    pub id: String,
    #[serde(rename = "document_no")]
    pub document_no: String,
    pub status: String,
    #[serde(rename = "created_at")]
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PickupPoint {
    pub id: String,
    #[serde(rename = "merchant_id")]
    pub merchant_id: Option<String>,
    #[serde(rename = "point_type")]
    #[serde(alias = "type")]
    pub point_type: String,
    pub name: String,
    pub address: Option<String>,
    #[serde(rename = "contact_phone")]
    pub contact_phone: Option<String>,
    #[serde(rename = "contact_email")]
    pub contact_email: Option<String>,
    #[serde(rename = "opening_hours")]
    pub opening_hours: Option<String>,
    pub status: String,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    #[serde(rename = "country_code")]
    pub country_code: Option<String>,
    #[serde(rename = "created_at")]
    pub created_at: Option<String>,
    #[serde(rename = "updated_at")]
    pub updated_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Product {
    pub id: String,
    #[serde(rename = "merchant_id")]
    pub merchant_id: Option<String>,
    pub name: String,
    pub sku: Option<String>,
    pub description: Option<String>,
    pub category: Option<String>,
    pub status: String,
    pub price: Option<f64>,
    pub currency: Option<String>,
    #[serde(rename = "age_restricted")]
    pub age_restricted: Option<bool>,
    #[serde(rename = "created_at")]
    pub created_at: Option<String>,
    #[serde(rename = "updated_at")]
    pub updated_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Invoice {
    pub id: String,
    #[serde(rename = "invoice_number")]
    pub invoice_number: String,
    pub amount: f64,
    pub currency: String,
    pub status: String,
    pub description: Option<String>,
    #[serde(rename = "created_at")]
    pub created_at: String,
    #[serde(rename = "paid_at")]
    pub paid_at: Option<String>,
    #[serde(rename = "download_url")]
    pub download_url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Subscription {
    pub id: String,
    pub status: String,
    pub plan: String,
    pub price: f64,
    pub currency: String,
    #[serde(rename = "start_date")]
    pub start_date: String,
    #[serde(rename = "next_billing_date")]
    pub next_billing_date: Option<String>,
    #[serde(rename = "cancel_at_period_end")]
    pub cancel_at_period_end: bool,
    #[serde(rename = "created_at")]
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AgeVerificationEvent {
    pub id: String,
    #[serde(rename = "merchant_id")]
    pub merchant_id: String,
    #[serde(rename = "parcel_id")]
    pub parcel_id: String,
    #[serde(rename = "order_id")]
    pub order_id: Option<String>,
    #[serde(rename = "epod_id")]
    pub epod_id: Option<String>,
    pub method: String,
    pub pass: bool,
    #[serde(rename = "min_age_required")]
    pub min_age_required: i32,
    #[serde(rename = "checker_user_id")]
    pub checker_user_id: Option<String>,
    #[serde(rename = "checked_at")]
    pub checked_at: String,
    pub remark: Option<String>,
    #[serde(rename = "country_code")]
    pub country_code: Option<String>,
    #[serde(rename = "created_at")]
    pub created_at: String,
    #[serde(rename = "updated_at")]
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Provider {
    pub slug: String,
    pub name: String,
    pub capabilities: Vec<String>,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProviderActivation {
    pub id: String,
    #[serde(rename = "provider_slug")]
    pub provider_slug: String,
    #[serde(rename = "merchant_id")]
    pub merchant_id: String,
    pub status: String,
    #[serde(rename = "created_at")]
    pub created_at: String,
    #[serde(rename = "updated_at")]
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupportTicket {
    pub id: String,
    pub subject: String,
    pub status: String,
    pub priority: Option<String>,
    #[serde(rename = "category")]
    pub category: Option<String>,
    #[serde(rename = "created_at")]
    pub created_at: String,
    #[serde(rename = "updated_at")]
    pub updated_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TicketMessage {
    pub id: String,
    #[serde(rename = "ticket_id")]
    pub ticket_id: String,
    pub sender: String,
    pub message: String,
    #[serde(rename = "created_at")]
    pub created_at: String,
}
