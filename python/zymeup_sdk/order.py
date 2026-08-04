"""Zymeup Python SDK - Order Client"""
from typing import Optional, Dict, Any, List


class OrderClient:
    """Order management client"""

    def __init__(self, client):
        self._client = client

    def list(self, page: int = 1, page_size: int = 25, status: Optional[str] = None) -> Dict[str, Any]:
        """List orders"""
        params = {"page": page, "page_size": page_size}
        if status:
            params["status"] = status
        return self._client.request("GET", "/api/v1/order/list", params=params)

    def get(self, order_id: str) -> Dict[str, Any]:
        """Get order detail"""
        return self._client.request("GET", f"/api/v1/order/{order_id}")

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create order"""
        return self._client.request("POST", "/api/v1/order/create", json=data)

    def create_with_documents(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create order with EPOD/ECMR documents"""
        return self._client.request("POST", "/api/v1/order/create-with-documents", json=data)

    def update(self, order_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update order"""
        return self._client.request("POST", f"/api/v1/order/{order_id}/update", json=data)

    def cancel(self, order_id: str) -> Dict[str, Any]:
        """Cancel order"""
        return self._client.request("POST", f"/api/v1/order/{order_id}/cancel")
