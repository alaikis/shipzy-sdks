pub mod activation;
pub mod age_verification;
pub mod ecmr;
pub mod error;
pub mod finance;
pub mod http_client;
pub mod merchant_address;
pub mod notification;
pub mod order;
pub mod pickup_points;
pub mod product;
pub mod support_ticket;
pub mod types;

pub use activation::*;
pub use age_verification::*;
pub use ecmr::*;
pub use error::*;
pub use finance::*;
pub use http_client::*;
pub use merchant_address::*;
pub use notification::*;
pub use order::*;
pub use pickup_points::*;
pub use product::*;
pub use support_ticket::*;
pub use types::*;

pub struct ShipzyClient {
    pub order: OrderClient,
    pub ecmr: EcmrClient,
    pub address: MerchantAddressClient,
    pub activation: ActivationClient,
    pub age_verification: AgeVerificationClient,
    pub pickup_points: PickupPointClient,
    pub product: ProductClient,
    pub finance: FinanceClient,
    pub support_ticket: SupportTicketClient,
    pub role: UserRole,
}

impl ShipzyClient {
    pub fn new(config: ShipzyConfig) -> error::Result<Self> {
        let role = config.role;
        Ok(Self {
            order: OrderClient::new(http_client::HttpClient::new(config.clone())?),
            ecmr: EcmrClient::new(http_client::HttpClient::new(config.clone())?),
            address: MerchantAddressClient::new(http_client::HttpClient::new(config.clone())?),
            activation: ActivationClient::new(http_client::HttpClient::new(config.clone())?),
            age_verification: AgeVerificationClient::new(http_client::HttpClient::new(config.clone())?),
            pickup_points: PickupPointClient::new(http_client::HttpClient::new(config.clone())?),
            product: ProductClient::new(http_client::HttpClient::new(config.clone())?),
            finance: FinanceClient::new(http_client::HttpClient::new(config.clone())?),
            support_ticket: SupportTicketClient::new(http_client::HttpClient::new(config)?),
            role,
        })
    }

    pub fn update_token(&mut self, token: &str) {
        self.order.inner.set_token(token);
        self.ecmr.inner.set_token(token);
        self.address.inner.set_token(token);
        self.activation.inner.set_token(token);
        self.age_verification.inner.set_token(token);
        self.pickup_points.inner.set_token(token);
        self.product.inner.set_token(token);
        self.finance.inner.set_token(token);
        self.support_ticket.inner.set_token(token);
    }

    pub fn is_merchant(&self) -> bool {
        self.role == UserRole::Merchant
    }

    pub fn is_carrier(&self) -> bool {
        self.role == UserRole::Carrier
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn new_with_default_config() {
        let c = ShipzyConfig::default();
        let cl = ShipzyClient::new(c);
        assert!(cl.is_ok());
    }

    #[test]
    fn config_default_values() {
        let c = ShipzyConfig::default();
        assert_eq!(c.base_url, "https://api.zymeup.com");
        assert_eq!(c.token, None);
        assert_eq!(c.timeout_seconds, 30);
    }

    #[test]
    fn shipzy_error_display() {
        let e = error::ShipzyError::Auth;
        assert_eq!(e.to_string(), "Unauthorized");
        let e = error::ShipzyError::Http {
            status: 404,
            message: "Not found".to_string(),
        };
        assert_eq!(e.to_string(), "HTTP error 404: Not found");
    }

    #[test]
    fn notification_validate_channels() {
        let missing = notification::validate_channel_requirements(
            &[ChannelType::Email, ChannelType::Sms],
            None,
            None,
        );
        assert!(missing.contains(&"email".to_string()));
        assert!(missing.contains(&"phone".to_string()));
    }
}
