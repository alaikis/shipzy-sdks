use serde::Deserialize;

use crate::types::EpodDetail;

#[derive(Debug, Deserialize)]
pub struct CarrierEpodListResponse {
    pub data: Vec<EpodDetail>,
    pub total: i64,
    pub page: i32,
    #[serde(rename = "page_size")]
    pub page_size: i32,
}
