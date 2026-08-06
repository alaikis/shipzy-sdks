"""Zymeup Python SDK - Carrier EPOD Client"""
from typing import Optional, Dict, Any


class CarrierEpodClient:
    """Carrier EPOD management client (CarrierAuth)"""

    def __init__(self, client):
        self._client = client

    def list(self, page: int = 1, page_size: int = 25, status: Optional[str] = None) -> Dict[str, Any]:
        """List carrier EPODs"""
        params: Dict[str, Any] = {"page": page, "page_size": page_size}
        if status:
            params["status"] = status
        return self._client.request("GET", "/api/v1/carrier/epod/list", params=params)

    def get(self, epod_id: str) -> Dict[str, Any]:
        """Get carrier EPOD detail"""
        return self._client.request("GET", f"/api/v1/carrier/epod/{epod_id}")

    def deliver(self, epod_id: str, data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Mark carrier EPOD as delivered"""
        return self._client.request("POST", f"/api/v1/carrier/epod/{epod_id}/delivery", json=data or {})

    def fail(self, epod_id: str, data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Mark carrier EPOD as failed"""
        return self._client.request("POST", f"/api/v1/carrier/epod/{epod_id}/fail", json=data or {})

    def capture_proof(self, epod_id: str, data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Capture delivery proof for carrier EPOD"""
        return self._client.request("POST", f"/api/v1/carrier/epod/{epod_id}/capture-proof", json=data or {})

    def upload_photo(self, epod_id: str, file) -> Dict[str, Any]:
        """Upload photo for carrier EPOD"""
        return self._client.request("POST", f"/api/v1/carrier/epod/{epod_id}/photo", files={"file": file})
