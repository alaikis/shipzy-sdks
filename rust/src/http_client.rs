use std::fmt;

use reqwest::{Client, Method};
use serde::de::DeserializeOwned;
use tokio::time::Duration;

use crate::error::{Result, ShipzyError};

#[derive(Debug, thiserror::Error)]
pub enum HttpClientError {
    #[error("HTTP error {status}: {message}")]
    Http { status: u16, message: String },
    #[error("Request error: {0}")]
    Reqwest(#[from] reqwest::Error),
    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),
}

impl From<HttpClientError> for ShipzyError {
    fn from(err: HttpClientError) -> Self {
        match err {
            HttpClientError::Http { status, message } => ShipzyError::Http { status, message },
            HttpClientError::Reqwest(e) => ShipzyError::Reqwest(e),
            HttpClientError::Json(e) => ShipzyError::Json(e),
        }
    }
}

#[derive(Debug, Clone)]
pub struct ZymeupConfig {
    pub base_url: String,
    pub token: Option<String>,
    pub timeout_seconds: u64,
    pub role: UserRole,
    pub carrier_code: Option<String>,
}

impl Default for ZymeupConfig {
    fn default() -> Self {
        Self {
            base_url: "https://api.zymeup.com".to_string(),
            token: None,
            timeout_seconds: 30,
            role: UserRole::Merchant,
            carrier_code: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum UserRole {
    Merchant,
    Carrier,
}

impl Default for UserRole {
    fn default() -> Self {
        Self::Merchant
    }
}

#[derive(Debug, Clone)]
pub struct HttpClient {
    client: Client,
    config: ZymeupConfig,
}

impl HttpClient {
    pub fn new(config: ZymeupConfig) -> Result<Self> {
        let client = Client::builder()
            .timeout(Duration::from_secs(config.timeout_seconds))
            .build()
            .map_err(|e| ShipzyError::Reqwest(e))?;
        Ok(Self { client, config })
    }

    pub fn set_token(&mut self, token: &str) {
        self.config.token = Some(token.to_string());
    }

    pub fn config(&self) -> &ZymeupConfig {
        &self.config
    }

    pub fn base_url(&self) -> &str {
        &self.config.base_url
    }

    pub fn token(&self) -> &Option<String> {
        &self.config.token
    }

    pub fn client(&self) -> &Client {
        &self.client
    }

    pub async fn request<T: DeserializeOwned>(
        &self,
        path: &str,
        method: Method,
        body: Option<serde_json::Value>,
    ) -> Result<T> {
        let url = format!("{}{}", self.config.base_url.trim_end_matches('/'), path);
        let mut req = self.client.request(method, &url);

        if let Some(ref token) = self.config.token {
            let auth = if self.config.role == UserRole::Carrier
                && self.config.carrier_code.is_some()
            {
                let carrier_code = self.config.carrier_code.as_ref().unwrap();
                format!("Bearer {}:{}", carrier_code, token)
            } else {
                format!("Bearer {}", token)
            };
            req = req.header(reqwest::header::AUTHORIZATION, auth);
        }

        req = req.header(reqwest::header::CONTENT_TYPE, "application/json");

        if let Some(body) = body {
            req = req.json(&body);
        }

        let resp = req.send().await?;
        let status = resp.status();

        if status == 401 {
            return Err(ShipzyError::Auth);
        }

        if !status.is_success() {
            let text = resp.text().await.unwrap_or_default();
            return Err(ShipzyError::Http {
                status: status.as_u16(),
                message: text,
            });
        }

        let t: T = resp.json().await?;
        Ok(t)
    }
}

impl fmt::Display for UserRole {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            UserRole::Merchant => write!(f, "merchant"),
            UserRole::Carrier => write!(f, "carrier"),
        }
    }
}
