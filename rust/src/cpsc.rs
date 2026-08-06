use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::cpsc_types::CPSCSettings;

pub struct CpscClient {
    pub(crate) inner: HttpClient,
}

impl CpscClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }

    pub async fn settings(&self) -> Result<CPSCSettings> {
        self.inner
            .request("/api/v1/cpsc/collections", Method::GET, None)
            .await
    }

    pub async fn credential(&self) -> Result<serde_json::Value> {
        self.inner
            .request("/api/v1/cpsc/credential", Method::GET, None)
            .await
    }

    pub async fn save_credential(&self, body: serde_json::Value) -> Result<serde_json::Value> {
        self.inner
            .request("/api/v1/cpsc/credential", Method::POST, Some(body))
            .await
    }

    pub async fn import_data(&self, body: serde_json::Value) -> Result<serde_json::Value> {
        self.inner
            .request("/api/v1/cpsc/import", Method::POST, Some(body))
            .await
    }

    pub async fn import_status(&self, import_id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/cpsc/import/{}/status", import_id),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn import_log(&self, import_id: &str, errors_only: bool) -> Result<serde_json::Value> {
        let path = format!(
            "/api/v1/cpsc/import/{}/log?errorsOnly={}",
            import_id, errors_only
        );
        self.inner.request(&path, Method::GET, None).await
    }

    pub async fn export_data(&self, filter: serde_json::Value) -> Result<serde_json::Value> {
        let params: Vec<String> = filter
            .as_object()
            .into_iter()
            .flat_map(|obj| {
                obj.iter()
                    .filter_map(|(k, v)| {
                        v.as_str().map(|s| format!("{}={}", k, urlencoding::encode(s)))
                    })
                    .collect::<Vec<_>>()
            })
            .collect();
        let path = format!("/api/v1/cpsc/export?{}", params.join("&"));
        self.inner.request(&path, Method::GET, None).await
    }

    pub async fn export_async(&self, filter: serde_json::Value) -> Result<serde_json::Value> {
        let params: Vec<String> = filter
            .as_object()
            .into_iter()
            .flat_map(|obj| {
                obj.iter()
                    .filter_map(|(k, v)| {
                        v.as_str().map(|s| format!("{}={}", k, urlencoding::encode(s)))
                    })
                    .collect::<Vec<_>>()
            })
            .collect();
        let path = format!("/api/v1/cpsc/export-async?{}", params.join("&"));
        self.inner.request(&path, Method::GET, None).await
    }

    pub async fn export_async_status(&self, export_id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/cpsc/export-async/{}/status", export_id),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn export_async_data(&self, export_id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/cpsc/export-async/{}/data", export_id),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn certificates(&self, body: serde_json::Value) -> Result<serde_json::Value> {
        self.inner
            .request("/api/v1/cpsc/certificates", Method::POST, Some(body))
            .await
    }

    pub async fn trade_parties(&self, party_type: Option<&str>) -> Result<serde_json::Value> {
        let path = match party_type {
            Some(t) => format!(
                "/api/v1/cpsc/trade-parties?tradePartyType={}",
                urlencoding::encode(t)
            ),
            None => "/api/v1/cpsc/trade-parties".to_string(),
        };
        self.inner.request(&path, Method::GET, None).await
    }

    pub async fn token_expiration(&self) -> Result<serde_json::Value> {
        self.inner
            .request("/api/v1/cpsc/token-expiration", Method::GET, None)
            .await
    }
}
