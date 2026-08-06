"""Zymeup Python SDK - Carrier Client"""
from typing import Optional, Dict, Any, List


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

    def detect(self, tracking_no: str) -> Dict[str, Any]:
        """Detect carrier from tracking number"""
        return self._client.request("POST", "/api/v1/carrier/detect", json={"tracking_no": tracking_no})
