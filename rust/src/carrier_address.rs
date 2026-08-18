use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::types::AddressItem;

pub struct CarrierAddressClient {
    pub(crate) inner: HttpClient,
}

impl CarrierAddressClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }

    pub async fn list(&self, body: serde_json::Value) -> Result<crate::types::ListResponse<AddressItem>> {
        self.inner
            .request(
                "/api/v1/carrier/sdk/addresses/list",
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn create(&self, body: serde_json::Value) -> Result<AddressItem> {
        self.inner
            .request(
                "/api/v1/carrier/sdk/addresses/create",
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn update(&self, id: &str, body: serde_json::Value) -> Result<AddressItem> {
        self.inner
            .request(
                &format!("/api/v1/carrier/sdk/addresses/{}/update", id),
                Method::POST,
                Some(body),
            )
            .await
    }
}
