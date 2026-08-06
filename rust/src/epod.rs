use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::types::{EpodDetail, EpodListItem, PaginatedResponse, SignUrlResponse};

pub struct EpodClient {
    pub(crate) inner: HttpClient,
}

impl EpodClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }

    pub async fn list(
        &self,
        page: i32,
        page_size: i32,
        status: Option<&str>,
        tracking_no: Option<&str>,
    ) -> Result<PaginatedResponse<EpodListItem>> {
        let mut path = format!("/api/v1/shipment/epod/list?page={}&page_size={}", page, page_size);
        if let Some(s) = status {
            path.push_str(&format!("&status={}", urlencoding::encode(s)));
        }
        if let Some(t) = tracking_no {
            path.push_str(&format!("&tracking_no={}", urlencoding::encode(t)));
        }
        self.inner.request(&path, Method::GET, None).await
    }

    pub async fn get(&self, id: &str) -> Result<EpodDetail> {
        self.inner
            .request(
                &format!("/api/v1/shipment/epod/{}", id),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn create(&self, data: serde_json::Value) -> Result<EpodDetail> {
        self.inner
            .request("/api/v1/shipment/epod/create", Method::POST, Some(data))
            .await
    }

    pub async fn generate_from_order(
        &self,
        order_id: &str,
        options: serde_json::Value,
    ) -> Result<serde_json::Value> {
        let mut body = options;
        body.as_object_mut()
            .unwrap_or(&mut serde_json::Map::new())
            .insert("order_id".to_string(), serde_json::Value::String(order_id.to_string()));
        self.inner
            .request(
                "/api/v1/shipment/epod/generate-from-order",
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn update(
        &self,
        id: &str,
        data: serde_json::Value,
    ) -> Result<EpodDetail> {
        self.inner
            .request(
                &format!("/api/v1/shipment/epod/{}/update", id),
                Method::PUT,
                Some(data),
            )
            .await
    }

    pub async fn deliver(
        &self,
        id: &str,
        data: serde_json::Value,
    ) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/shipment/epod/{}/delivery", id),
                Method::POST,
                Some(data),
            )
            .await
    }

    pub async fn fail(&self, id: &str, remark: &str) -> Result<EpodDetail> {
        self.inner
            .request(
                &format!("/api/v1/shipment/epod/{}/fail", id),
                Method::POST,
                Some(serde_json::json!({ "remark": remark })),
            )
            .await
    }

    pub async fn capture_proof(
        &self,
        id: &str,
        data: serde_json::Value,
    ) -> Result<EpodDetail> {
        self.inner
            .request(
                &format!("/api/v1/shipment/epod/{}/capture-proof", id),
                Method::POST,
                Some(data),
            )
            .await
    }

    pub async fn verify(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/shipment/epod/{}/verify", id),
                Method::POST,
                Some(serde_json::json!({})),
            )
            .await
    }

    pub async fn generate_sign_url(&self, id: &str) -> Result<SignUrlResponse> {
        self.inner
            .request(
                &format!("/api/v1/shipment/epod/{}/sign", id),
                Method::POST,
                Some(serde_json::json!({})),
            )
            .await
    }

    pub async fn generate_pdf(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/shipment/epod/{}/pdf", id),
                Method::POST,
                Some(serde_json::json!({})),
            )
            .await
    }

    pub async fn upload_photo(
        &self,
        id: &str,
        photo_url: &str,
    ) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/shipment/epod/{}/upload-photo", id),
                Method::POST,
                Some(serde_json::json!({ "photo_url": photo_url })),
            )
            .await
    }
}
