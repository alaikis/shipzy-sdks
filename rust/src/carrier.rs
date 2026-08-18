use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::carrier_types::Carrier;

pub struct CarrierClient {
    pub(crate) inner: HttpClient,
}

impl CarrierClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }

    pub async fn list(
        &self,
        page: i32,
        page_size: i32,
        state: Option<&str>,
    ) -> Result<serde_json::Value> {
        let mut params = vec![
            format!("page={}", page),
            format!("page_size={}", page_size),
        ];
        if let Some(s) = state {
            params.push(format!("state={}", urlencoding::encode(s)));
        }
        let path = format!("/api/v1/carrier/list?{}", params.join("&"));
        self.inner.request(&path, Method::GET, None).await
    }

    pub async fn get(&self, id: &str) -> Result<Carrier> {
        self.inner
            .request(
                &format!("/api/v1/carrier/{}", id),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn create(&self, body: serde_json::Value) -> Result<Carrier> {
        self.inner
            .request("/api/v1/carrier/register", Method::POST, Some(body))
            .await
    }

    pub async fn update(&self, id: &str, body: serde_json::Value) -> Result<Carrier> {
        self.inner
            .request(
                &format!("/api/v1/carrier/{}", id),
                Method::PUT,
                Some(body),
            )
            .await
    }

    pub async fn delete(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/carrier/{}", id),
                Method::DELETE,
                None,
            )
            .await
    }
}
