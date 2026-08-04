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

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create EPOD from order"""
        return self._client.request("POST", "/api/v1/shipment/epod/create", json=data)

    def generate_from_order(self, order_id: str, options: Optional[Dict] = None) -> Dict[str, Any]:
        """Generate EPOD from an order"""
        body = {"order_id": order_id}
        if options:
            body.update(options)
        return self._client.request("POST", "/api/v1/shipment/epod/generate-from-order", json=body)

    def update(self, epod_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update EPOD (whitelist fields only)"""
        return self._client.request("PUT", f"/api/v1/shipment/epod/{epod_id}/update", json=data)

    def generate_sign_url(self, epod_id: str) -> Dict[str, Any]:
        """Generate signing URL"""
        return self._client.request("POST", f"/api/v1/shipment/epod/{epod_id}/sign")

    def deliver(self, epod_id: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """Mark as delivered"""
        return self._client.request("POST", f"/api/v1/shipment/epod/{epod_id}/delivery", json=data or {})

    def fail(self, epod_id: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """Mark as failed"""
        return self._client.request("POST", f"/api/v1/shipment/epod/{epod_id}/fail", json=data or {})

    def generate_pdf(self, epod_id: str) -> Dict[str, Any]:
        """Generate PDF (async)"""
        return self._client.request("POST", f"/api/v1/shipment/epod/{epod_id}/pdf")

    def verify(self, epod_id: str) -> Dict[str, Any]:
        """Verify signature"""
        return self._client.request("POST", f"/api/v1/shipment/epod/{epod_id}/verify")

    def capture_proof(self, epod_id: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """Capture delivery proof"""
        return self._client.request("POST", f"/api/v1/shipment/epod/{epod_id}/capture-proof", json=data or {})

    def upload_photo(self, epod_id: str, file) -> Dict[str, Any]:
        """Upload photo (multipart)"""
        return self._client.request("POST", f"/api/v1/shipment/epod/{epod_id}/upload-photo", files={"file": file})
