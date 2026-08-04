"""Zymeup Python SDK - Product Client"""
from typing import Optional, Dict, Any, List


class ProductClient:
    """Product management client"""

    def __init__(self, client):
        self._client = client

    def list(self, status: Optional[str] = None, category: Optional[str] = None,
             search: Optional[str] = None, active_only: bool = False) -> Dict[str, Any]:
        """List products"""
        params: Dict[str, Any] = {}
        if status:
            params["status"] = status
        if category:
            params["category"] = category
        if search:
            params["search"] = search
        if active_only:
            params["active_only"] = "true"
        return self._client.request("GET", "/api/v1/products", params=params)

    def get(self, product_id: str) -> Dict[str, Any]:
        """Get product detail"""
        return self._client.request("GET", f"/api/v1/products/{product_id}")

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new product"""
        return self._client.request("POST", "/api/v1/products", json=data)

    def update(self, product_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a product"""
        return self._client.request("PUT", f"/api/v1/products/{product_id}", json=data)

    def retire(self, product_id: str) -> Dict[str, Any]:
        """Retire (deactivate) a product"""
        return self._client.request("POST", f"/api/v1/products/{product_id}/retire")
