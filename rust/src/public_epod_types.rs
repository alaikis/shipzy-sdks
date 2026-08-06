use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct PublicSignDetail {
    #[serde(rename = "tracking_no")]
    pub tracking_no: String,
    #[serde(rename = "recipient_name")]
    pub recipient_name: String,
    #[serde(rename = "delivery_address_summary")]
    pub delivery_address_summary: String,
    #[serde(rename = "destination_country_code")]
    pub destination_country_code: String,
    #[serde(rename = "policy_url")]
    pub policy_url: String,
    #[serde(rename = "policy_version_hash")]
    pub policy_version_hash: String,
    #[serde(rename = "signature_level_required")]
    pub signature_level_required: String,
    #[serde(rename = "allowed_proof_types")]
    pub allowed_proof_types: Vec<String>,
    #[serde(rename = "signature_waived")]
    pub signature_waived: bool,
    #[serde(rename = "expires_at")]
    pub expires_at: String,
}

#[derive(Debug, Deserialize)]
pub struct PublicConsentResponse {
    #[serde(rename = "consent_id")]
    pub consent_id: String,
    #[serde(rename = "policy_version_hash")]
    pub policy_version_hash: String,
}

#[derive(Debug, Deserialize)]
pub struct PublicCaptureResponse {
    #[serde(rename = "evidence_hash")]
    pub evidence_hash: String,
    pub status: String,
    #[serde(rename = "hash_locked")]
    pub hash_locked: bool,
}
