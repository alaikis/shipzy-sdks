"""Zymeup Python SDK - Public EPOD Client"""
from typing import Optional, Dict, Any


class PublicEpodClient:
    """Public EPOD signing client (no auth required)"""

    def __init__(self, client):
        self._client = client

    def get_sign_detail(self, token: str) -> Dict[str, Any]:
        """Get EPOD sign detail by token (public)"""
        return self._client.request("GET", f"/api/v1/open/epod/sign/{token}")

    def get_sign_policy(self, token: str) -> Dict[str, Any]:
        """Get EPOD sign policy by token (public)"""
        return self._client.request("GET", f"/api/v1/open/epod/sign/{token}/policy")

    def consent(self, token: str, data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Submit consent for EPOD signing (public)"""
        return self._client.request("POST", f"/api/v1/open/epod/sign/{token}/consent", json=data or {})

    def capture(self, token: str, data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Capture signature/evidence for EPOD signing (public)"""
        return self._client.request("POST", f"/api/v1/open/epod/sign/{token}/capture", json=data or {})
