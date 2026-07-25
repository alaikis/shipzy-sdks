"""Zymeup Python SDK - EPOD Client"""
from typing import Optional, Dict, Any, List


class EpodClient:
    """EPOD (Electronic Proof of Delivery) client"""

    def __init__(self, client):
        self._client = client

    def list(self, page: int = 1, page_size: int = 25, status: Optional[str] = None) -> Dict[str, Any]:
        """List EPOD records"""
        params = {"page": page, "page_size": page_size}
        if status:
            params["status"] = status
        return self._client.request("GET", "/api/v1/shipment/epod/list", params=params)

    def get(self, epod_id: str) -> Dict[str, Any]:
        """Get EPOD detail"""
        return self._client.request("GET", f"/api/v1/shipment/epod/{epod_id}")

    def generate_sign_url(self, epod_id: str) -> Dict[str, Any]:
        """Generate signing URL"""
        return self._client.request("POST", f"/api/v1/shipment/epod/{epod_id}/sign")

    def deliver(self, epod_id: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """Mark as delivered"""
        return self._client.request("POST", f"/api/v1/shipment/epod/{epod_id}/delivery", json=data or {})

    def fail(self, epod_id: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """Mark as failed"""
        return self._client.request("POST", f"/api/v1/shipment/epod/{epod_id}/fail", json=data or {})
