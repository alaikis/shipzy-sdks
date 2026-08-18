use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;

pub struct FinanceClient {
    pub(crate) inner: HttpClient,
}

impl FinanceClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }
}

impl FinanceClient {
    pub async fn get_invoices(&self) -> Result<serde_json::Value> {
        self.inner
            .request("/api/v1/invoices", Method::GET, None)
            .await
    }

    pub async fn list_subscriptions(&self) -> Result<serde_json::Value> {
        self.inner
            .request("/api/v1/subscriptions", Method::GET, None)
            .await
    }

    pub async fn cancel_subscription(
        &self,
        id: &str,
    ) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/subscriptions/{}/cancel", id),
                Method::POST,
                None,
            )
            .await
    }

    pub async fn resume_subscription(
        &self,
        id: &str,
    ) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/subscriptions/{}/resume", id),
                Method::POST,
                None,
            )
            .await
    }

    pub async fn download_invoice(
        &self,
        id: &str,
    ) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/invoices/{}/download", id),
                Method::GET,
                None,
            )
            .await
    }
}
