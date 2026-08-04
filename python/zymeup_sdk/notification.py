"""Zymeup Python SDK - Notification Client"""
from typing import Optional, Dict, Any, List

DELIVERY_MODES = [
    {"key": "carrier", "label": "Carrier", "description": "Third-party carrier delivery (default)"},
    {"key": "self-delivery", "label": "Self-delivery", "description": "Merchant staff delivers"},
    {"key": "self-pickup", "label": "Self-pickup", "description": "Customer picks up at store/locker"},
]

NOTIFICATION_CHANNELS = [
    {"key": "email", "label": "Email", "description": "Send signing invitation email (recommended)", "requires": "email"},
    {"key": "copy_url", "label": "Copy URL", "description": "Generate signing URL for manual sharing", "requires": "none"},
    {"key": "sms", "label": "SMS", "description": "Requires activated SMS provider", "requires": "phone"},
    {"key": "whatsapp", "label": "WhatsApp", "description": "Requires activated WhatsApp provider", "requires": "phone"},
]


def validate_channel_requirements(channels: List[str], recipient: Dict[str, Optional[str]]) -> List[str]:
    """Validate that recipient has required contact info for selected channels.

    Returns list of missing field names ('email', 'phone').
    """
    missing: List[str] = []
    if "email" in channels and not recipient.get("email"):
        missing.append("email")
    if any(c in ("sms", "whatsapp") for c in channels) and not recipient.get("phone"):
        missing.append("phone")
    return missing
