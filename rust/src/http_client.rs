pub struct ZymeupConfig {
    pub base_url: String,
    pub token: Option<String>,
    pub timeout_seconds: u64,
    pub role: UserRole,
    pub carrier_code: Option<String>,
}

impl Default for ZymeupConfig {
    fn default() -> Self {
        Self {
            base_url: "https://api.zymeup.com".to_string(),
            token: None,
            timeout_seconds: 30,
            role: UserRole::Merchant,
            carrier_code: None,
        }
    }
}
