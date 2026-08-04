use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::types::{AddressItem, ListResponse};

pub struct MerchantAddressClient {
    pub(crate) inner: HttpClient,
}

impl MerchantAddressClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }
}

impl MerchantAddressClient {
    pub async fn list(
        &self,
        filter: Option<serde_json::Value>,
    ) -> Result<ListResponse<AddressItem>> {
        self.inner
            .request(
                "/api/v1/merchant/addresses/list",
                Method::POST,
                filter,
            )
            .await
    }

    pub async fn get(&self, id: &str) -> Result<AddressItem> {
        let resp: ListResponse<AddressItem> = self
            .inner
            .request(
                "/api/v1/merchant/addresses/list",
                Method::POST,
                Some(serde_json::json!({ "id": id })),
            )
            .await?;
        resp.data
            .into_iter()
            .find(|a| a.id == id)
            .ok_or_else(|| crate::error::ShipzyError::Http {
                status: 404,
                message: format!("Address {} not found", id),
            })
    }

    pub async fn create(&self, body: serde_json::Value) -> Result<AddressItem> {
        self.inner
            .request(
                "/api/v1/merchant/addresses/create",
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn update(
        &self,
        id: &str,
        body: serde_json::Value,
    ) -> Result<AddressItem> {
        self.inner
            .request(
                &format!("/api/v1/merchant/addresses/{}/update", id),
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn delete(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/merchant/addresses/{}/delete", id),
                Method::POST,
                None,
            )
            .await
    }

    pub async fn set_default(
        &self,
        id: &str,
        address_type: &str,
    ) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/merchant/addresses/{}/set-default", id),
                Method::POST,
                Some(serde_json::json!({ "type": address_type })),
            )
            .await
    }
}
