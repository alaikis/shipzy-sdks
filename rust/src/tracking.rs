use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;

#[derive(Debug, serde::Deserialize)]
pub struct TrackingLocation {
    pub lat: f64,
    pub lng: f64,
    pub label: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
pub struct TrackingEvent {
    pub remark: Option<String>,
    #[serde(rename = "event_time")]
    pub event_time: String,
    #[serde(rename = "event_type")]
    pub event_type: String,
    pub location: Option<TrackingLocation>,
    #[serde(rename = "data_source")]
    pub data_source: Option<String>,
    #[serde(rename = "last_scrape_at")]
    pub last_scrape_at: Option<String>,
    #[serde(rename = "scrape_status")]
    pub scrape_status: Option<String>,
    #[serde(rename = "raw_status_text")]
    pub raw_status_text: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
pub struct TrackingAddress {
    #[serde(rename = "full_name")]
    pub full_name: Option<String>,
    pub city: Option<String>,
    #[serde(rename = "country_code")]
    pub country_code: Option<String>,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
}

#[derive(Debug, serde::Deserialize)]
pub struct TrackingDetail {
    #[serde(rename = "tracking_no")]
    pub tracking_no: String,
    pub status: String,
    #[serde(rename = "carrier_name")]
    pub carrier_name: Option<String>,
    #[serde(rename = "latest_event")]
    pub latest_event: Option<String>,
    #[serde(rename = "estimated_delivery")]
    pub estimated_delivery: Option<String>,
    #[serde(rename = "actual_delivery")]
    pub actual_delivery: Option<String>,
    pub origin: Option<TrackingAddress>,
    pub destination: Option<TrackingAddress>,
    pub events: Vec<TrackingEvent>,
    #[serde(rename = "data_source")]
    pub data_source: Option<String>,
    #[serde(rename = "last_scrape_at")]
    pub last_scrape_at: Option<String>,
    #[serde(rename = "scrape_status")]
    pub scrape_status: Option<String>,
    #[serde(rename = "raw_status_text")]
    pub raw_status_text: Option<String>,
    /// EU compliance — public view (Change: eu-tracking-compliance-integration; omitted when absent).
    /// GDPR governance fields are NEVER present on the public endpoint.
    #[serde(rename = "eu_compliance")]
    pub eu_compliance: Option<TrackingEuCompliancePublic>,
}

/// EU compliance fields — public view (carbon + customs only).
/// Change: eu-tracking-compliance-integration
#[derive(Debug, serde::Deserialize)]
pub struct TrackingEuCompliancePublic {
    #[serde(rename = "co2e_kg")]
    pub co2e_kg: Option<f64>,
    #[serde(rename = "co2e_methodology")]
    pub co2e_methodology: Option<String>, // glec | env_freight | carrier_reported | estimated
    #[serde(rename = "co2e_calculated_at")]
    pub co2e_calculated_at: Option<String>,
    #[serde(rename = "co2e_source_provider")]
    pub co2e_source_provider: Option<String>, // transporeon | carrier_reported | ship24 | platform
    #[serde(rename = "customs_mrn")]
    pub customs_mrn: Option<String>,
    #[serde(rename = "customs_eori")]
    pub customs_eori: Option<String>,
    #[serde(rename = "transit_document_type")]
    pub transit_document_type: Option<String>, // t1 | t2 | t2f | tir | none
    #[serde(rename = "transit_document_ref")]
    pub transit_document_ref: Option<String>,
    #[serde(rename = "ens_declaration_ref")]
    pub ens_declaration_ref: Option<String>,
}

/// Order-level CO2e summary (GET /order/:id/co2e-summary).
/// Change: eu-tracking-compliance-integration
#[derive(Debug, serde::Deserialize)]
pub struct OrderCo2eSummary {
    pub order_id: String,
    pub total_co2e_kg: f64,
    pub by_methodology: std::collections::HashMap<String, i64>,
    pub coverage: OrderCo2eCoverage,
}

#[derive(Debug, serde::Deserialize)]
pub struct OrderCo2eCoverage {
    pub with_value: i64,
    pub total: i64,
}

// ============ Signer Identity (eID) / eSeal / Evidence (Change: base-full-process) ============

/// QTSP identity verification record. The platform stores the verification
/// reference only; raw identity data stays at the QTSP.
#[derive(Debug, serde::Deserialize)]
pub struct IdentityVerification {
    #[serde(rename = "verification_id")]
    pub verification_id: String,
    pub provider: String, // signicat_id | itsme | bankid | eu_digital_wallet(draft)
    pub method: String,   // eid | wallet | video | otp
    #[serde(rename = "assurance_level")]
    pub assurance_level: String, // low | substantial | high
    #[serde(rename = "signer_ref")]
    pub signer_ref: String, // HMAC pseudonymous reference (irreversible)
    #[serde(rename = "qtsp_verification_ref")]
    pub qtsp_verification_ref: Option<String>,
    #[serde(rename = "verified_at")]
    pub verified_at: Option<String>,
    pub status: String, // pending | verified | failed
}

/// Async QTSP identity verification session (redirect/QR).
#[derive(Debug, serde::Deserialize)]
pub struct IdentityVerifySession {
    #[serde(rename = "verification_id")]
    pub verification_id: String,
    #[serde(rename = "redirect_url")]
    pub redirect_url: Option<String>,
    #[serde(rename = "qr_code_payload")]
    pub qr_code_payload: Option<String>,
    pub status: String,
    #[serde(rename = "expires_at")]
    pub expires_at: Option<String>,
}

/// Platform self-hosted RFC3161 timestamp token.
#[derive(Debug, serde::Deserialize)]
pub struct TSATimestamp {
    pub token: String,
    pub time: String,
    #[serde(rename = "root_hash")]
    pub root_hash: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
pub struct TrackingListItem {
    #[serde(rename = "tracking_no")]
    pub tracking_no: String,
    pub status: String,
    #[serde(rename = "carrier_name")]
    pub carrier_name: Option<String>,
    #[serde(rename = "latest_event")]
    pub latest_event: Option<String>,
    #[serde(rename = "updated_at")]
    pub updated_at: String,
    #[serde(rename = "data_source")]
    pub data_source: Option<String>,
    #[serde(rename = "last_scrape_at")]
    pub last_scrape_at: Option<String>,
    #[serde(rename = "scrape_status")]
    pub scrape_status: Option<String>,
}

#[derive(Debug, serde::Deserialize)]
pub struct TrackingListResponse {
    pub data: Vec<TrackingListItem>,
    pub total: i64,
    pub page: i32,
    #[serde(rename = "page_size")]
    pub page_size: i32,
}

pub struct TrackingClient {
    pub(crate) inner: HttpClient,
}

impl TrackingClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }

    pub async fn detail(&self, tracking_no: &str) -> Result<TrackingDetail> {
        self.inner
            .request(
                &format!("/api/v1/tracking/{}", tracking_no),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn list(
        &self,
        page: i32,
        page_size: i32,
        status: Option<&str>,
        tracking_no: Option<&str>,
    ) -> Result<TrackingListResponse> {
        let mut params = vec![
            format!("page={}", page),
            format!("page_size={}", page_size),
        ];
        if let Some(s) = status {
            params.push(format!("status={}", urlencoding::encode(s)));
        }
        if let Some(t) = tracking_no {
            params.push(format!("tracking_no={}", urlencoding::encode(t)));
        }
        let base_path = if self.inner.config().role == crate::http_client::UserRole::Carrier {
            "/api/v1/carrier/tracking/list"
        } else {
            "/api/v1/merchant/tracking/list"
        };
        let path = format!("{}?{}", base_path, params.join("&"));
        self.inner.request(&path, Method::GET, None).await
    }
}
