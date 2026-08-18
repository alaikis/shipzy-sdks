use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;

pub struct UploadClient {
    pub(crate) inner: HttpClient,
}

impl UploadClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }

    pub async fn upload_file(&self, endpoint: &str, body: serde_json::Value) -> Result<serde_json::Value> {
        self.inner
            .request(endpoint, Method::POST, Some(body))
            .await
    }
}
