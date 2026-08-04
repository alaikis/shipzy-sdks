use reqwest::header::{AUTHORIZATION, CONTENT_TYPE};
use std::time::Duration;

use crate::error::{Result, ShipzyError};

pub const DEFAULT_BASE_URL: &str = "https://api.zymeup.com";

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum UserRole {
    Merchant,
    Carrier,
}

#[derive(Debug, Clone)]
pub struct ShipzyConfig {
    pub base_url: String,
    pub token: Option<String>,
    pub timeout_seconds: u64,
    pub role: UserRole,
    pub carrier_code: Option<String>,
}

impl Default for ShipzyConfig {
    fn default() -> Self {
        Self {
            base_url: DEFAULT_BASE_URL.to_string(),
            token: None,
            timeout_seconds: 30,
            role: UserRole::Merchant,
            carrier_code: None,
        }
    }
}

#[derive(Clone)]
pub struct HttpClient {
    pub(crate) client: reqwest::Client,
    pub(crate) config: ShipzyConfig,
}

impl HttpClient {
    pub fn new(config: ShipzyConfig) -> Result<Self> {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(config.timeout_seconds))
            .build()?;
        Ok(Self { client, config })
    }

    pub fn set_token(&mut self, token: &str) {
        self.config.token = Some(token.to_string());
    }

    fn auth_header(&self) -> String {
        match (&self.config.role, &self.config.carrier_code, &self.config.token) {
            (UserRole::Carrier, Some(cc), Some(tok)) => format!("Bearer {}:{}", cc, tok),
            (_, _, Some(tok)) => format!("Bearer {}", tok),
            _ => String::new(),
        }
    }

    pub async fn request<T: serde::de::DeserializeOwned>(
        &self,
        path: &str,
        method: reqwest::Method,
        body: Option<serde_json::Value>,
    ) -> Result<T> {
        let url = format!(
            "{}{}",
            self.config.base_url.trim_end_matches('/'),
            path
        );
        let mut req = self.client.request(method, &url);
        if self.config.token.is_some() {
            req = req.header(AUTHORIZATION, self.auth_header());
        }
        req = req.header(CONTENT_TYPE, "application/json");
        if let Some(ref v) = body {
            req = req.json(v);
        }
        let resp = req.send().await?;
        let status = resp.status();
        if status == reqwest::StatusCode::UNAUTHORIZED {
            return Err(ShipzyError::Auth);
        }
        if !status.is_success() {
            return Err(ShipzyError::Http {
                status: status.as_u16(),
                message: resp.text().await.unwrap_or_default(),
            });
        }
        Ok(resp.json().await?)
    }

    pub async fn request_raw(
        &self,
        path: &str,
        method: reqwest::Method,
        body: Option<serde_json::Value>,
    ) -> Result<serde_json::Value> {
        self.request(path, method, body).await
    }
}
