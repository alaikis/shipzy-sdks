use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::carrier_epod_types::CarrierEpodListResponse;
use crate::types::EpodDetail;

pub struct CarrierEpodClient {
    pub(crate) inner: HttpClient,
}

impl CarrierEpodClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }

    pub async fn list(
        &self,
        page: i32,
        page_size: i32,
        status: Option<&str>,
    ) -> Result<CarrierEpodListResponse> {
        let mut params = vec![
            format!("page={}", page),
            format!("page_size={}", page_size),
        ];
        if let Some(s) = status {
            params.push(format!("status={}", urlencoding::encode(s)));
        }
        let path = format!("/api/v1/carrier/epod/list?{}", params.join("&"));
        self.inner.request(&path, Method::GET, None).await
    }

    pub async fn get(&self, id: &str) -> Result<EpodDetail> {
        self.inner
            .request(
                &format!("/api/v1/carrier/epod/{}", id),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn deliver(&self, id: &str, body: serde_json::Value) -> Result<EpodDetail> {
        self.inner
            .request(
                &format!("/api/v1/carrier/epod/{}/delivery", id),
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn fail(&self, id: &str, remark: &str) -> Result<EpodDetail> {
        self.inner
            .request(
                &format!("/api/v1/carrier/epod/{}/fail", id),
                Method::POST,
                Some(serde_json::json!({ "remark": remark })),
            )
            .await
    }

    pub async fn capture_proof(&self, id: &str, body: serde_json::Value) -> Result<EpodDetail> {
        self.inner
            .request(
                &format!("/api/v1/carrier/epod/{}/capture-proof", id),
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn upload_photo(&self, id: &str, photo_url: &str) -> Result<EpodDetail> {
        self.inner
            .request(
                &format!("/api/v1/carrier/epod/{}/photo", id),
                Method::POST,
                Some(serde_json::json!({ "photo_url": photo_url })),
            )
            .await
    }
}
