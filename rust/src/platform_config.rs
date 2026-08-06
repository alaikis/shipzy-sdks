use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::platform_config_types::{PlatformConfig, PlatformConfigListResponse};

pub struct PlatformConfigClient {
    pub(crate) inner: HttpClient,
}

impl PlatformConfigClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }

    pub async fn list(&self) -> Result<PlatformConfigListResponse> {
        self.inner
            .request("/api/v1/admin/platform-configs", Method::GET, None)
            .await
    }

    pub async fn update(&self, id: &str, body: serde_json::Value) -> Result<PlatformConfig> {
        self.inner
            .request(
                &format!("/api/v1/admin/platform-configs/{}", id),
                Method::PUT,
                Some(body),
            )
            .await
    }
}
