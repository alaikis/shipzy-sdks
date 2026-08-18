"""Zymeup Python SDK - Carrier Address Client"""
from typing import Optional, Dict, Any, List


class CarrierAddressClient:
    """Carrier address book client (CarrierAuth, headless)"""

    def __init__(self, client):
        self._client = client

    def list(self, page: int = 1, page_size: int = 25, role_tag: Optional[str] = None) -> Dict[str, Any]:
        """List carrier addresses"""
        body: Dict[str, Any] = {"page": page, "page_size": page_size}
        if role_tag:
            body["role_tag"] = role_tag
        return self._client.request("POST", "/api/v1/carrier/sdk/addresses/list", json=body)

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new carrier address"""
        return self._client.request("POST", "/api/v1/carrier/sdk/addresses/create", json=data)

    def update(self, address_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a carrier address"""
        return self._client.request("POST", f"/api/v1/carrier/sdk/addresses/{address_id}/update", json=data)
