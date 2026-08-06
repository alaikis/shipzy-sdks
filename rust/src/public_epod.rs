use crate::error::Result;
use crate::public_epod_types::{PublicCaptureResponse, PublicConsentResponse, PublicSignDetail};

pub struct PublicEpodClient {
    base_url: String,
    client: reqwest::Client,
}

impl PublicEpodClient {
    pub fn new(base_url: &str) -> Self {
        Self {
            base_url: base_url.trim_end_matches('/').to_string(),
            client: reqwest::Client::new(),
        }
    }

    async fn request_json(
        &self,
        path: &str,
        method: reqwest::Method,
        body: Option<serde_json::Value>,
    ) -> Result<serde_json::Value> {
        let url = format!("{}{}", self.base_url, path);
        let mut builder = self.client.request(method, &url);
        builder = builder.header("Content-Type", "application/json");
        if let Some(b) = body {
            builder = builder.json(&b);
        }
        let resp = builder.send().await?;
        let status = resp.status().as_u16();
        if !resp.status().is_success() {
            let msg = resp.text().await.unwrap_or_default();
            return Err(crate::error::ShipzyError::Http { status, message: msg });
        }
        let data: serde_json::Value = resp.json().await?;
        Ok(data)
    }

    pub async fn get_sign_detail(&self, sign_token: &str) -> Result<PublicSignDetail> {
        let path = format!("/api/v1/open/epod/sign/{}", sign_token);
        let data: PublicSignDetail = serde_json::from_value(self.request_json(&path, reqwest::Method::GET, None).await?)?;
        Ok(data)
    }

    pub async fn get_policy(
        &self,
        sign_token: &str,
        lang: &str,
    ) -> Result<serde_json::Value> {
        let path = format!(
            "/api/v1/open/epod/sign/{}/policy?lang={}",
            sign_token, lang
        );
        self.request_json(&path, reqwest::Method::GET, None).await
    }

    pub async fn record_consent(
        &self,
        sign_token: &str,
        consent_types: Vec<String>,
        policy_version_hash: &str,
    ) -> Result<PublicConsentResponse> {
        let path = format!("/api/v1/open/epod/sign/{}/consent", sign_token);
        let body = serde_json::json!({
            "consent_types": consent_types,
            "policy_version_hash": policy_version_hash,
        });
        let data: PublicConsentResponse = serde_json::from_value(self.request_json(&path, reqwest::Method::POST, Some(body)).await?)?;
        Ok(data)
    }

    pub async fn capture_signature(
        &self,
        sign_token: &str,
        consent_id: &str,
        signature_data: &str,
        proof_type: &str,
    ) -> Result<PublicCaptureResponse> {
        let path = format!("/api/v1/open/epod/sign/{}/capture", sign_token);
        let body = serde_json::json!({
            "consent_id": consent_id,
            "signature_data": signature_data,
            "proof_type": proof_type,
        });
        let data: PublicCaptureResponse = serde_json::from_value(self.request_json(&path, reqwest::Method::POST, Some(body)).await?)?;
        Ok(data)
    }
}
