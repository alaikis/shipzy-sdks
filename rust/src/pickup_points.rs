use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::types::{ListResponse, PickupPoint};

pub struct PickupPointClient {
    pub(crate) inner: HttpClient,
}

impl PickupPointClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }
}

impl PickupPointClient {
    pub async fn list(
        &self,
        active_only: Option<bool>,
    ) -> Result<ListResponse<PickupPoint>> {
        let mut path = "/api/v1/admin/pickup-points/".to_string();
        if let Some(ao) = active_only {
            path.push_str(&format!("?active_only={}", ao));
        }
        self.inner.request(&path, Method::GET, None).await
    }

    pub async fn get(&self, id: &str) -> Result<PickupPoint> {
        self.inner
            .request(
                &format!("/api/v1/admin/pickup-points/{}", id),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn create(
        &self,
        body: serde_json::Value,
    ) -> Result<PickupPoint> {
        self.inner
            .request(
                "/api/v1/admin/pickup-points/",
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn update(
        &self,
        id: &str,
        body: serde_json::Value,
    ) -> Result<PickupPoint> {
        self.inner
            .request(
                &format!("/api/v1/admin/pickup-points/{}", id),
                Method::PUT,
                Some(body),
            )
            .await
    }

    pub async fn deactivate(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/admin/pickup-points/{}/deactivate", id),
                Method::POST,
                Some(serde_json::json!({})),
            )
            .await
    }
}
