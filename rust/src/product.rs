use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::types::{PaginatedResponse, Product};

pub struct ProductClient {
    pub(crate) inner: HttpClient,
}

impl ProductClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }
}

impl ProductClient {
    pub async fn list(
        &self,
        status: Option<&str>,
        category: Option<&str>,
        search: Option<&str>,
    ) -> Result<PaginatedResponse<Product>> {
        let mut params = Vec::new();
        params.push("active_only=true".to_string());
        if let Some(s) = status {
            params.push(format!("status={}", urlencoding::encode(s)));
        }
        if let Some(c) = category {
            params.push(format!("category={}", urlencoding::encode(c)));
        }
        if let Some(s) = search {
            params.push(format!("search={}", urlencoding::encode(s)));
        }
        let path = format!("/api/v1/products?{}", params.join("&"));
        self.inner.request(&path, Method::GET, None).await
    }

    pub async fn get(&self, id: &str) -> Result<Product> {
        self.inner
            .request(
                &format!("/api/v1/products/{}", id),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn create(
        &self,
        body: serde_json::Value,
    ) -> Result<Product> {
        self.inner
            .request("/api/v1/products", Method::POST, Some(body))
            .await
    }

    pub async fn update(
        &self,
        id: &str,
        body: serde_json::Value,
    ) -> Result<Product> {
        self.inner
            .request(
                &format!("/api/v1/products/{}", id),
                Method::PUT,
                Some(body),
            )
            .await
    }

    pub async fn retire(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/products/{}/retire", id),
                Method::POST,
                Some(serde_json::json!({})),
            )
            .await
    }
}
