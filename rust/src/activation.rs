use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::types::ProviderActivation;

pub struct ActivationClient {
    pub(crate) inner: HttpClient,
}

impl ActivationClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }
}

impl ActivationClient {
    pub async fn list_providers(
        &self,
        capability: Option<&str>,
    ) -> Result<serde_json::Value> {
        let mut path = "/api/v1/marketplace/providers".to_string();
        if let Some(c) = capability {
            path.push_str(&format!("?capability={}", urlencoding::encode(c)));
        }
        self.inner.request(&path, Method::GET, None).await
    }

    pub async fn get_provider(&self, slug: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/marketplace/providers/{}", slug),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn list_activations(
        &self,
    ) -> Result<serde_json::Value> {
        self.inner
            .request("/api/v1/marketplace/activations", Method::GET, None)
            .await
    }

    pub async fn get_activation(&self, id: &str) -> Result<ProviderActivation> {
        self.inner
            .request(
                &format!("/api/v1/marketplace/activations/{}", id),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn activate(
        &self,
        body: serde_json::Value,
    ) -> Result<ProviderActivation> {
        self.inner
            .request(
                "/api/v1/marketplace/activations",
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn pause(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/marketplace/activations/{}/pause", id),
                Method::POST,
                Some(serde_json::json!({})),
            )
            .await
    }

    pub async fn resume(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/marketplace/activations/{}/resume", id),
                Method::POST,
                Some(serde_json::json!({})),
            )
            .await
    }

    pub async fn revoke(
        &self,
        id: &str,
        reason: Option<&str>,
    ) -> Result<serde_json::Value> {
        let body = match reason {
            Some(r) => serde_json::json!({ "reason": r }),
            None => serde_json::json!({}),
        };
        self.inner
            .request(
                &format!("/api/v1/marketplace/activations/{}/revoke", id),
                Method::POST,
                Some(body),
            )
            .await
    }
}
