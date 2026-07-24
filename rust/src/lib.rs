use reqwest::header::{AUTHORIZATION, CONTENT_TYPE};
use serde::{Deserialize, Serialize};
use std::time::Duration;

const DEFAULT_BASE_URL: &str = "https://api.shipzy.me";

pub struct ShipzyConfig {
    pub base_url: String,
    pub token: Option<String>,
    pub timeout_seconds: u64,
}

impl Default for ShipzyConfig {
    fn default() -> Self {
        Self {
            base_url: DEFAULT_BASE_URL.to_string(),
            token: None,
            timeout_seconds: 30,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EpodListResponse {
    pub data: Vec<EpodListItem>,
    pub total: i64,
    pub page: i32,
    #[serde(rename = "page_size")]
    pub page_size: i32,
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
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SignUrlResponse {
    #[serde(rename = "sign_url")]
    pub sign_url: String,
}

#[derive(Debug, thiserror::Error)]
pub enum ShipzyError {
    #[error("HTTP error {status}: {message}")]
    Http { status: u16, message: String },
    #[error("Unauthorized")]
    Auth,
    #[error("Request error: {0}")]
    Reqwest(#[from] reqwest::Error),
    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),
}

pub type Result<T> = std::result::Result<T, ShipzyError>;

pub struct EpodClient {
    client: reqwest::Client,
    config: ShipzyConfig,
}

impl EpodClient {
    pub fn new(config: ShipzyConfig) -> Result<Self> {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(config.timeout_seconds))
            .build()?;
        Ok(Self { client, config })
    }

    pub fn set_token(&mut self, token: &str) {
        self.config.token = Some(token.to_string());
    }

    async fn request<T: serde::de::DeserializeOwned>(
        &self,
        path: &str,
        method: reqwest::Method,
        body: Option<serde_json::Value>,
    ) -> Result<T> {
        let url = format!("{}{}", self.config.base_url.trim_end_matches('/'), path);
        let mut builder = self.client.request(method, &url);

        if let Some(ref token) = self.config.token {
            builder = builder.header(AUTHORIZATION, format!("Bearer {}", token));
        }
        builder = builder.header(CONTENT_TYPE, "application/json");

        if let Some(b) = body {
            builder = builder.json(&b);
        }

        let response = builder.send().await?;
        let status = response.status();

        if status == reqwest::StatusCode::UNAUTHORIZED {
            return Err(ShipzyError::Auth);
        }
        if !status.is_success() {
            let msg = response.text().await.unwrap_or_default();
            return Err(ShipzyError::Http { status: status.as_u16(), message: msg });
        }

        Ok(response.json().await?)
    }

    pub async fn list(
        &self,
        page: i32,
        page_size: i32,
        status: Option<&str>,
        tracking_no: Option<&str>,
    ) -> Result<EpodListResponse> {
        let mut query = format!("?page={}&page_size={}", page, page_size);
        if let Some(s) = status {
            query.push_str(&format!("&status={}", urlencoding::encode(s)));
        }
        if let Some(t) = tracking_no {
            query.push_str(&format!("&tracking_no={}", urlencoding::encode(t)));
        }
        self.request(&format!("/api/v1/shipment/epod/list{}", query), reqwest::Method::GET, None).await
    }

    pub async fn get(&self, epod_id: &str) -> Result<EpodDetail> {
        self.request(&format!("/api/v1/shipment/epod/{}", epod_id), reqwest::Method::GET, None).await
    }

    pub async fn generate_sign_url(&self, epod_id: &str) -> Result<SignUrlResponse> {
        self.request(&format!("/api/v1/shipment/epod/{}/sign", epod_id), reqwest::Method::POST, None).await
    }
}
