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
