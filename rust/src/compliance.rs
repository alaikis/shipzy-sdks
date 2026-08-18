use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::compliance_types::{ComplianceCheckResult, CountryRequirements};

pub struct ComplianceClient {
    pub(crate) inner: HttpClient,
}

impl ComplianceClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }

    pub async fn check(&self, body: serde_json::Value) -> Result<ComplianceCheckResult> {
        self.inner
            .request("/api/v1/compliance/check", Method::POST, Some(body))
            .await
    }

    pub async fn country_requirements(&self, country_code: &str) -> Result<CountryRequirements> {
        self.inner
            .request(
                &format!("/api/v1/compliance/requirements/{}", country_code),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn validate_hs_code(&self, hs_code: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/compliance/hscode/{}/validate", hs_code),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn create_customs(&self, body: serde_json::Value) -> Result<serde_json::Value> {
        self.inner
            .request("/api/v1/compliance/customs", Method::POST, Some(body))
            .await
    }

    pub async fn get_customs(&self, id: &str) -> Result<serde_json::Value> {
        self.inner
            .request(
                &format!("/api/v1/compliance/customs/{}", id),
                Method::GET,
                None,
            )
            .await
    }
}
