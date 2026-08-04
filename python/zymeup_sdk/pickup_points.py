"""Zymeup Python SDK - Pickup Points Client"""
from typing import Optional, Dict, Any, List


class PickupPointClient:
    """Pickup points management client"""

    def __init__(self, client):
        self._client = client

    def list(self, active_only: bool = True) -> Dict[str, Any]:
        """List pickup points"""
        params: Dict[str, Any] = {}
        if not active_only:
            params["active_only"] = "false"
        return self._client.request("GET", "/api/v1/admin/pickup-points/", params=params)

    def get(self, pickup_point_id: str) -> Dict[str, Any]:
        """Get pickup point detail"""
        return self._client.request("GET", f"/api/v1/admin/pickup-points/{pickup_point_id}")

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new pickup point"""
        return self._client.request("POST", "/api/v1/admin/pickup-points/", json=data)

    def update(self, pickup_point_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a pickup point"""
        return self._client.request("PUT", f"/api/v1/admin/pickup-points/{pickup_point_id}", json=data)

    def deactivate(self, pickup_point_id: str) -> Dict[str, Any]:
        """Deactivate a pickup point"""
        return self._client.request("POST", f"/api/v1/admin/pickup-points/{pickup_point_id}/deactivate")
