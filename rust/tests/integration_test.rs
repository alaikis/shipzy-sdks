use shipzy_sdk::{ShipzyConfig, EpodClient};

#[test]
fn new_with_default_config() {
    let config = ShipzyConfig::default();
    let client = EpodClient::new(config);
    assert!(client.is_ok());
}

#[test]
fn new_with_custom_config() {
    let config = ShipzyConfig {
        base_url: "http://localhost:1417".to_string(),
        token: Some("test-token".to_string()),
        timeout_seconds: 60,
    };
    let client = EpodClient::new(config);
    assert!(client.is_ok());
}

#[test]
fn config_default_values() {
    let config = ShipzyConfig::default();
    assert_eq!(config.base_url, "https://api.shipzy.me");
    assert_eq!(config.token, None);
    assert_eq!(config.timeout_seconds, 30);
}
