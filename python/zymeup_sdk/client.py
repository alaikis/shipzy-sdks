"""Zymeup Python SDK - Core Client"""
import requests
from typing import Optional, Dict, Any

from .epod import EpodClient
from .order import OrderClient
from .ecmr import EcmrClient
from .merchant_address import MerchantAddressClient
from .activation import ActivationClient
from .age_verification import AgeVerificationClient
from .pickup_points import PickupPointClient
from .product import ProductClient
from .finance import FinanceClient
from .support_ticket import SupportTicketClient

VERSION = "2.0.0"
BASE_URL = "https://api.zymeup.com"


class ZymeupClient:
    """Main entry point for the Zymeup Python SDK"""

    def __init__(self, api_key: str, base_url: str = BASE_URL, timeout: int = 30):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": f"zymeup-sdk-python/{VERSION}",
        })
        self.epod = EpodClient(self)
        self.order = OrderClient(self)
        self.ecmr = EcmrClient(self)
        self.merchant_address = MerchantAddressClient(self)
        self.activation = ActivationClient(self)
        self.age_verification = AgeVerificationClient(self)
        self.pickup_points = PickupPointClient(self)
        self.product = ProductClient(self)
        self.finance = FinanceClient(self)
        self.support_ticket = SupportTicketClient(self)

    def request(self, method: str, path: str, **kwargs) -> Dict[str, Any]:
        url = f"{self.base_url}{path}"
        kwargs.setdefault("timeout", self.timeout)
        response = self.session.request(method, url, **kwargs)
        response.raise_for_status()
        return response.json()
