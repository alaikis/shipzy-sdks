"""Zymeup Python SDK - Platform Config Client"""
from typing import Optional, Dict, Any


class PlatformConfigClient:
    """Platform configuration client (Admin)"""

    def __init__(self, client):
        self._client = client

    def list(self) -> Dict[str, Any]:
        """List all platform configs"""
        return self._client.request("GET", "/api/v1/admin/platform-configs/")

    def get(self, config_id: str) -> Dict[str, Any]:
        """Get a platform config by ID"""
        return self._client.request("GET", f"/api/v1/admin/platform-configs/{config_id}")

    def upsert(self, config_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update a platform config"""
        return self._client.request("PUT", f"/api/v1/admin/platform-configs/{config_id}", json=data)

    def set_status(self, config_id: str, status: str) -> Dict[str, Any]:
        """Set platform config status (active/inactive)"""
        return self._client.request("POST", f"/api/v1/admin/platform-configs/{config_id}/status", json={"status": status})
