use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::types::{EcmrListItem, PaginatedResponse, PdfResponse};

pub struct EcmrClient {
    pub(crate) inner: HttpClient,
}

impl EcmrClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }
}

impl EcmrClient {
    pub async fn list(
        &self,
        page: i32,
        page_size: i32,
    ) -> Result<PaginatedResponse<EcmrListItem>> {
        self.inner
            .request(
                &format!("/api/v1/shipment/ecmr/list?page={}&page_size={}", page, page_size),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn get(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/shipment/ecmr/{}", id),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn create(&self, body: serde_json::Value) -> Result<serde_json::Value> {
        self.inner
            .request(
                "/api/v1/shipment/ecmr/create",
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn generate_from_order(
        &self,
        order_id: &str,
    ) -> Result<serde_json::Value> {
        self.inner
            .request(
                "/api/v1/shipment/ecmr/generate-from-order",
                Method::POST,
                Some(serde_json::json!({ "order_id": order_id })),
            )
            .await
    }

    pub async fn update(&self, id: &str, body: serde_json::Value) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/shipment/ecmr/{}/update", id),
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn cancel(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/shipment/ecmr/{}/cancel", id),
                Method::POST,
                None,
            )
            .await
    }

    pub async fn validate(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/shipment/ecmr/{}/validate", id),
                Method::POST,
                None,
            )
            .await
    }

    pub async fn submit_to_authority(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/shipment/ecmr/{}/submit-to-authority", id),
                Method::POST,
                None,
            )
            .await
    }

    pub async fn sign(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/shipment/ecmr/{}/sign", id),
                Method::POST,
                None,
            )
            .await
    }

    pub async fn pdf(&self, id: &str) -> Result<PdfResponse> {
        self.inner
            .request(
                &format!("/api/v1/shipment/ecmr/{}/pdf", id),
                Method::POST,
                None,
            )
            .await
    }
}
