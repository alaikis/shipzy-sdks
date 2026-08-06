use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Carrier {
    pub id: String,
    pub name: String,
    pub code: String,
    #[serde(rename = "carrier_type")]
    pub carrier_type: String,
    #[serde(rename = "tracking_type")]
    pub tracking_type: String,
    #[serde(rename = "business_type")]
    pub business_type: String,
    pub state: String,
    pub description: String,
    pub website: String,
    #[serde(rename = "contact_email")]
    pub contact_email: Option<String>,
    #[serde(rename = "contact_phone")]
    pub contact_phone: Option<String>,
    #[serde(rename = "created_at")]
    pub created_at: String,
    #[serde(rename = "updated_at")]
    pub updated_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CarrierListResponse {
    pub data: Vec<Carrier>,
    pub total: i64,
    pub page: i32,
    #[serde(rename = "page_size")]
    pub page_size: i32,
}
