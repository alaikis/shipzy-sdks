use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct PlatformConfig {
    pub id: String,
    pub key: String,
    pub value: String,
    #[serde(rename = "is_secret")]
    pub is_secret: bool,
    pub category: String,
    pub description: String,
    #[serde(rename = "updated_at")]
    pub updated_at: String,
}

#[derive(Debug, Deserialize)]
pub struct PlatformConfigListResponse {
    pub data: Vec<PlatformConfig>,
}
