use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::types::AgeVerificationEvent;

pub struct AgeVerificationClient {
    pub(crate) inner: HttpClient,
}

impl AgeVerificationClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }
}

impl AgeVerificationClient {
    pub async fn create(
        &self,
        body: serde_json::Value,
    ) -> Result<AgeVerificationEvent> {
        self.inner
            .request("/api/v1/age-verifications", Method::POST, Some(body))
            .await
    }

    pub async fn list_by_parcel(
        &self,
        parcel_id: &str,
    ) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!(
                    "/api/v1/age-verifications?parcel_id={}",
                    urlencoding::encode(parcel_id)
                ),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn list_by_order(
        &self,
        order_id: &str,
    ) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!(
                    "/api/v1/age-verifications?order_id={}",
                    urlencoding::encode(order_id)
                ),
                Method::GET,
                None,
            )
            .await
    }
}
