use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CustomsDeclaration {
    pub id: String,
    #[serde(rename = "shipment_id")]
    pub shipment_id: String,
    #[serde(rename = "hs_code")]
    pub hs_code: String,
    pub description: String,
    #[serde(rename = "origin_country")]
    pub origin_country: String,
    pub quantity: i64,
    #[serde(rename = "unit_value")]
    pub unit_value: f64,
    pub currency: String,
    pub weight: Option<f64>,
    pub notes: Option<String>,
    pub status: String,
    #[serde(rename = "created_at")]
    pub created_at: String,
    #[serde(rename = "updated_at")]
    pub updated_at: String,
}

#[derive(Debug, Deserialize)]
pub struct ComplianceCheckResult {
    pub compliant: bool,
    pub restrictions: Vec<ComplianceRestriction>,
    #[serde(rename = "required_documents")]
    pub required_documents: Vec<String>,
    pub tips: Vec<String>,
}

#[derive(Debug, Deserialize)]
pub struct ComplianceRestriction {
    pub type_: String,
    pub item: String,
    pub message: String,
}

#[derive(Debug, Deserialize)]
pub struct DocumentRequirement {
    pub type_: String,
    pub description: String,
    pub required: bool,
}

#[derive(Debug, Deserialize)]
pub struct CountryRequirements {
    #[serde(rename = "country_code")]
    pub country_code: String,
    pub restrictions: Vec<String>,
    #[serde(rename = "required_documents")]
    pub required_documents: Vec<DocumentRequirement>,
    pub notes: String,
}
