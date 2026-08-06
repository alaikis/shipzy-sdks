use zymeup_sdk::{ZymeupClient, ZymeupConfig, UserRole};

#[test]
fn new_with_default_config() {
    let config = ZymeupConfig::default();
    let client = ZymeupClient::new(config);
    assert!(client.is_ok());
}

#[test]
fn new_with_custom_config() {
    let config = ZymeupConfig {
        base_url: "http://localhost:1417".to_string(),
        token: Some("test-token".to_string()),
        timeout_seconds: 60,
        role: UserRole::Merchant,
        carrier_code: None,
    };
    let client = ZymeupClient::new(config);
    assert!(client.is_ok());
}

#[test]
fn config_default_values() {
    let config = ZymeupConfig::default();
    assert_eq!(config.base_url, "https://api.zymeup.com");
    assert_eq!(config.token, None);
    assert_eq!(config.timeout_seconds, 30);
}

#[test]
fn client_role_check() {
    let merchant = ZymeupClient::new(ZymeupConfig {
        role: UserRole::Merchant,
        ..ZymeupConfig::default()
    }).unwrap();
    let carrier = ZymeupClient::new(ZymeupConfig {
        role: UserRole::Carrier,
        ..ZymeupConfig::default()
    }).unwrap();
    assert!(merchant.is_merchant());
    assert!(!merchant.is_carrier());
    assert!(!carrier.is_merchant());
    assert!(carrier.is_carrier());
}
