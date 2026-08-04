"""Zymeup Python SDK - Merchant Address Client"""
from typing import Optional, Dict, Any, List


class MerchantAddressClient:
    """Merchant address book client"""

    def __init__(self, client):
        self._client = client

    def list(self, page: int = 1, page_size: int = 25, role_tag: Optional[str] = None) -> Dict[str, Any]:
        """List merchant addresses"""
        body: Dict[str, Any] = {"page": page, "page_size": page_size}
        if role_tag:
            body["role_tag"] = role_tag
        return self._client.request("POST", "/api/v1/merchant/addresses/list", json=body)

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new address"""
        return self._client.request("POST", "/api/v1/merchant/addresses/create", json=data)

    def update(self, address_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an address"""
        return self._client.request("POST", f"/api/v1/merchant/addresses/{address_id}/update", json=data)

    def delete(self, address_id: str) -> Dict[str, Any]:
        """Delete an address"""
        return self._client.request("POST", f"/api/v1/merchant/addresses/{address_id}/delete")

    def set_default(self, address_id: str, address_type: str) -> Dict[str, Any]:
        """Set address as default (sender/return/contact/warehouse)"""
        return self._client.request("POST", f"/api/v1/merchant/addresses/{address_id}/set-default", json={"type": address_type})
