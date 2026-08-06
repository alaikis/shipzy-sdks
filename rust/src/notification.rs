use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum DeliveryMode {
    #[serde(rename = "carrier")]
    Carrier,
    #[serde(rename = "self-delivery")]
    SelfDelivery,
    #[serde(rename = "self-pickup")]
    SelfPickup,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum ChannelType {
    #[serde(rename = "email")]
    Email,
    #[serde(rename = "copy_url")]
    CopyUrl,
    #[serde(rename = "sms")]
    Sms,
    #[serde(rename = "whatsapp")]
    WhatsApp,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationResult {
    pub channel: ChannelType,
    pub status: String,
    pub message: Option<String>,
    pub url: Option<String>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeliveryModeItem {
    pub key: DeliveryMode,
    pub label: &'static str,
    pub description: &'static str,
}

#[derive(Debug, Clone, Serialize)]
pub struct NotificationChannelItem {
    pub key: ChannelType,
    pub label: &'static str,
    pub icon: &'static str,
    pub description: &'static str,
    pub requires: &'static [&'static str],
}

pub const DELIVERY_MODES: &[DeliveryModeItem] = &[
    DeliveryModeItem {
        key: DeliveryMode::Carrier,
        label: "Carrier",
        description: "Ship with a third-party carrier",
    },
    DeliveryModeItem {
        key: DeliveryMode::SelfDelivery,
        label: "Self Delivery",
        description: "Deliver using your own fleet",
    },
    DeliveryModeItem {
        key: DeliveryMode::SelfPickup,
        label: "Self Pickup",
        description: "Customer picks up at a pickup point",
    },
];

const EMAIL_REQUIRES: &[&str] = &["email"];
const PHONE_REQUIRES: &[&str] = &["phone"];
const NO_REQUIRES: &[&str] = &[];

pub const NOTIFICATION_CHANNELS: &[NotificationChannelItem] = &[
    NotificationChannelItem {
        key: ChannelType::Email,
        label: "Email",
        icon: "mail",
        description: "Send notification via email",
        requires: EMAIL_REQUIRES,
    },
    NotificationChannelItem {
        key: ChannelType::CopyUrl,
        label: "Copy URL",
        icon: "link",
        description: "Generate a shareable URL",
        requires: NO_REQUIRES,
    },
    NotificationChannelItem {
        key: ChannelType::Sms,
        label: "SMS",
        icon: "message-square",
        description: "Send notification via SMS",
        requires: PHONE_REQUIRES,
    },
    NotificationChannelItem {
        key: ChannelType::WhatsApp,
        label: "WhatsApp",
        icon: "phone",
        description: "Send notification via WhatsApp",
        requires: PHONE_REQUIRES,
    },
];

pub fn validate_channel_requirements(
    channels: &[ChannelType],
    recipient_email: Option<&str>,
    recipient_phone: Option<&str>,
) -> Vec<String> {
    let mut missing = Vec::new();
    for ch in channels {
        for item in NOTIFICATION_CHANNELS {
            if item.key == *ch {
                for &req_field in item.requires {
                    match req_field {
                        "email" if recipient_email.is_none() || recipient_email.unwrap().is_empty() => {
                            missing.push("email".to_string());
                        }
                        "phone" if recipient_phone.is_none() || recipient_phone.unwrap().is_empty() => {
                            missing.push("phone".to_string());
                        }
                        _ => {}
                    }
                }
            }
        }
    }
    missing.sort();
    missing.dedup();
    missing
}
