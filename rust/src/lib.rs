pub mod activation;
pub mod age_verification;
pub mod carrier;
pub mod carrier_address;
pub mod carrier_epod;
pub mod carrier_epod_types;
pub mod carrier_types;
pub mod compliance;
pub mod compliance_types;
pub mod cpsc;
pub mod cpsc_types;
pub mod ecmr;
pub mod epod;
pub mod error;
pub mod finance;
pub mod http_client;
pub mod merchant_address;
pub mod notification;
pub mod order;
pub mod pickup_points;
pub mod product;
pub mod platform_config;
pub mod platform_config_types;
pub mod public_epod;
pub mod public_epod_types;
pub mod support_ticket;
pub mod tracking;
pub mod types;
pub mod upload;
pub mod validation;

pub use activation::*;
pub use age_verification::*;
pub use carrier::*;
pub use carrier_address::*;
pub use carrier_epod::*;
pub use compliance::*;
pub use cpsc::*;
pub use ecmr::*;
pub use epod::*;
pub use error::*;
pub use finance::*;
pub use http_client::*;
pub use merchant_address::*;
pub use notification::*;
pub use order::*;
pub use pickup_points::*;
pub use product::*;
pub use platform_config::*;
pub use public_epod::*;
pub use support_ticket::*;
pub use tracking::*;
pub use types::*;
pub use upload::*;
pub use validation::*;

pub struct ZymeupClient {
    pub order: OrderClient,
    pub ecmr: EcmrClient,
    pub address: MerchantAddressClient,
    pub activation: ActivationClient,
    pub age_verification: AgeVerificationClient,
    pub pickup_points: PickupPointClient,
    pub product: ProductClient,
    pub finance: FinanceClient,
    pub support_ticket: SupportTicketClient,
    pub validation: ValidationClient,
    pub tracking: TrackingClient,
    pub upload: UploadClient,
    pub public_epod: PublicEpodClient,
    pub carrier: CarrierClient,
    pub carrier_epod: CarrierEpodClient,
    pub carrier_address: CarrierAddressClient,
    pub platform_config: PlatformConfigClient,
    pub compliance: ComplianceClient,
    pub cpsc: CpscClient,
    pub epod: EpodClient,
    pub role: UserRole,
}

impl ZymeupClient {
    pub fn new(config: ZymeupConfig) -> error::Result<Self> {
        let role = config.role.clone();
        Ok(Self {
            order: OrderClient::new(http_client::HttpClient::new(config.clone())?),
            ecmr: EcmrClient::new(http_client::HttpClient::new(config.clone())?),
            address: MerchantAddressClient::new(http_client::HttpClient::new(config.clone())?),
            activation: ActivationClient::new(http_client::HttpClient::new(config.clone())?),
            age_verification: AgeVerificationClient::new(http_client::HttpClient::new(config.clone())?),
            pickup_points: PickupPointClient::new(http_client::HttpClient::new(config.clone())?),
            product: ProductClient::new(http_client::HttpClient::new(config.clone())?),
            finance: FinanceClient::new(http_client::HttpClient::new(config.clone())?),
            support_ticket: SupportTicketClient::new(http_client::HttpClient::new(config.clone())?),
            validation: ValidationClient::new(http_client::HttpClient::new(config.clone())?),
            tracking: TrackingClient::new(http_client::HttpClient::new(config.clone())?),
            upload: UploadClient::new(http_client::HttpClient::new(config.clone())?),
            public_epod: PublicEpodClient::new(&config.base_url),
            carrier: CarrierClient::new(http_client::HttpClient::new(config.clone())?),
            carrier_epod: CarrierEpodClient::new(http_client::HttpClient::new(config.clone())?),
            carrier_address: CarrierAddressClient::new(http_client::HttpClient::new(config.clone())?),
            platform_config: PlatformConfigClient::new(http_client::HttpClient::new(config.clone())?),
            compliance: ComplianceClient::new(http_client::HttpClient::new(config.clone())?),
            cpsc: CpscClient::new(http_client::HttpClient::new(config.clone())?),
            epod: EpodClient::new(http_client::HttpClient::new(config.clone())?),
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
        self.validation.inner.set_token(token);
        self.tracking.inner.set_token(token);
        self.upload.inner.set_token(token);
        self.carrier.inner.set_token(token);
        self.carrier_epod.inner.set_token(token);
        self.carrier_address.inner.set_token(token);
        self.platform_config.inner.set_token(token);
        self.compliance.inner.set_token(token);
        self.cpsc.inner.set_token(token);
        self.epod.inner.set_token(token);
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
        let c = ZymeupConfig::default();
        let cl = ZymeupClient::new(c);
        assert!(cl.is_ok());
    }

    #[test]
    fn config_default_values() {
        let c = ZymeupConfig::default();
        assert_eq!(c.base_url, "https://api.zymeup.com");
        assert_eq!(c.token, None);
        assert_eq!(c.timeout_seconds, 30);
    }

    #[test]
    fn zymeup_error_display() {
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
