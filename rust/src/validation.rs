use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;

#[derive(Debug, serde::Deserialize)]
pub struct PhoneVerifyResult {
    pub valid: bool,
    #[serde(rename = "formatted")]
    pub formatted: String,
    #[serde(rename = "country_code")]
    pub country_code: String,
}

#[derive(Debug, serde::Deserialize)]
pub struct PhoneFormatResult {
    #[serde(rename = "formatted")]
    pub formatted: String,
}

#[derive(Debug, serde::Deserialize)]
pub struct PostalCodeResult {
    pub valid: bool,
    pub message: String,
    pub source: String,
}

#[derive(Debug, serde::Deserialize)]
pub struct EmailValidationResult {
    pub valid: bool,
    pub status: String,
    pub message: String,
    pub source: String,
    #[serde(rename = "formatted")]
    pub formatted: String,
}

#[derive(Debug, serde::Deserialize)]
pub struct TaxIdValidationResult {
    pub valid: bool,
    pub message: String,
    pub source: String,
}

pub struct ValidationClient {
    pub(crate) inner: HttpClient,
}

impl ValidationClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }

    pub async fn verify_phone(&self, country_code: &str, phone: &str) -> Result<PhoneVerifyResult> {
        self.inner
            .request(
                "/api/v1/validation/phone",
                Method::POST,
                Some(serde_json::json!({
                    "country_code": country_code,
                    "phone": phone,
                })),
            )
            .await
    }

    pub async fn format_phone(&self, country_code: &str, phone: &str) -> Result<PhoneFormatResult> {
        self.inner
            .request(
                "/api/v1/validation/phone/format",
                Method::POST,
                Some(serde_json::json!({
                    "country_code": country_code,
                    "phone": phone,
                })),
            )
            .await
    }

    pub async fn validate_postal_code(&self, country_code: &str, code: &str) -> Result<PostalCodeResult> {
        self.inner
            .request(
                "/api/v1/validation/postal-code",
                Method::POST,
                Some(serde_json::json!({
                    "country_code": country_code,
                    "code": code,
                })),
            )
            .await
    }

    pub async fn validate_email(&self, email: &str) -> Result<EmailValidationResult> {
        self.inner
            .request(
                "/api/v1/validation/email",
                Method::POST,
                Some(serde_json::json!({
                    "email": email,
                })),
            )
            .await
    }

    pub async fn validate_tax_id(&self, country_code: &str, tax_id: &str) -> Result<TaxIdValidationResult> {
        self.inner
            .request(
                "/api/v1/validation/tax-id",
                Method::POST,
                Some(serde_json::json!({
                    "country_code": country_code,
                    "tax_id": tax_id,
                })),
            )
            .await
    }
}
