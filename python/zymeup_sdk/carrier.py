"""Zymeup Python SDK - Carrier Client"""
from typing import Optional, Dict, Any, List, TypedDict


class Carrier(TypedDict, total=False):
    """Carrier type definition"""
    id: int
    name: str
    code: str
    carrier_type: str
    tracking_type: str
    tracking_provider: str
    tracking_slug: str
    business_type: str
    state: str
    description: str
    website: str
    contact_email: str
    contact_phone: str
    created_at: str
    updated_at: str


class CarrierClient:
    """Carrier portal management client (CarrierAuth)"""

    def __init__(self, client):
        self._client = client

    def list(self, page: int = 1, page_size: int = 25, search: Optional[str] = None) -> Dict[str, Any]:
        """List carriers available to merchant"""
        params: Dict[str, Any] = {"page": page, "page_size": page_size}
        if search:
            params["search"] = search
        return self._client.request("GET", "/api/v1/carrier/list", params=params)

    def get(self, carrier_id: str) -> Dict[str, Any]:
        """Get carrier detail"""
        return self._client.request("GET", f"/api/v1/carrier/{carrier_id}")

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Register a new carrier"""
        return self._client.request("POST", "/api/v1/carrier/register", json=data)

    def detect(self, tracking_no: str) -> Dict[str, Any]:
        """Detect carrier from tracking number"""
        return self._client.request("POST", "/api/v1/carrier/detect", json={"tracking_no": tracking_no})
