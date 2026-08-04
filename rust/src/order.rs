use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::types::{OrderListItem, PaginatedResponse};

pub struct OrderClient {
    pub(crate) inner: HttpClient,
}

impl OrderClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }
}

impl OrderClient {
    pub async fn list(
        &self,
        page: i32,
        page_size: i32,
        status: Option<&str>,
    ) -> Result<PaginatedResponse<OrderListItem>> {
        let mut q = format!("?page={}&page_size={}", page, page_size);
        if let Some(s) = status {
            q.push_str(&format!("&status={}", urlencoding::encode(s)));
        }
        self.inner
            .request(&format!("/api/v1/order/list{}", q), Method::GET, None)
            .await
    }

    pub async fn get(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/order/{}", id),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn create(&self, body: serde_json::Value) -> Result<serde_json::Value> {
        self.inner
            .request("/api/v1/order/create", Method::POST, Some(body))
            .await
    }

    pub async fn create_with_documents(
        &self,
        body: serde_json::Value,
    ) -> Result<serde_json::Value> {
        self.inner
            .request(
                "/api/v1/order/create-with-documents",
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn update(
        &self,
        id: &str,
        body: serde_json::Value,
    ) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/order/{}/update", id),
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn cancel(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/order/{}/cancel", id),
                Method::POST,
                None,
            )
            .await
    }
}
