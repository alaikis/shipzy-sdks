"""Zymeup Python SDK - ECMR Client"""
from typing import Optional, Dict, Any, List


class EcmrClient:
    """ECMR (European Consignment Note) client"""

    def __init__(self, client):
        self._client = client

    def list(self, page: int = 1, page_size: int = 25) -> Dict[str, Any]:
        """List ECMR records"""
        params = {"page": page, "page_size": page_size}
        return self._client.request("GET", "/api/v1/shipment/ecmr/list", params=params)

    def get(self, ecmr_id: str) -> Dict[str, Any]:
        """Get ECMR detail"""
        return self._client.request("GET", f"/api/v1/shipment/ecmr/{ecmr_id}")

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create ECMR"""
        return self._client.request("POST", "/api/v1/shipment/ecmr/create", json=data)

    def generate_from_order(self, order_id: str) -> Dict[str, Any]:
        """Generate ECMR from order"""
        return self._client.request("POST", "/api/v1/shipment/ecmr/generate-from-order", json={"order_id": order_id})

    def sign(self, ecmr_id: str) -> Dict[str, Any]:
        """Generate signing URL for ECMR"""
        return self._client.request("POST", f"/api/v1/shipment/ecmr/{ecmr_id}/sign")

    def update(self, ecmr_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update ECMR"""
        return self._client.request("POST", f"/api/v1/shipment/ecmr/{ecmr_id}/update", json=data)

    def cancel(self, ecmr_id: str) -> Dict[str, Any]:
        """Cancel ECMR"""
        return self._client.request("POST", f"/api/v1/shipment/ecmr/{ecmr_id}/cancel")

    def validate(self, ecmr_id: str) -> Dict[str, Any]:
        """Validate ECMR"""
        return self._client.request("POST", f"/api/v1/shipment/ecmr/{ecmr_id}/validate")

    def submit_to_authority(self, ecmr_id: str) -> Dict[str, Any]:
        """Submit ECMR to authority"""
        return self._client.request("POST", f"/api/v1/shipment/ecmr/{ecmr_id}/submit-to-authority")

    def pdf(self, ecmr_id: str) -> Dict[str, Any]:
        """Generate PDF for ECMR"""
        return self._client.request("POST", f"/api/v1/shipment/ecmr/{ecmr_id}/pdf")
