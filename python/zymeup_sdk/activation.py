"""Zymeup Python SDK - Activation Client"""
from typing import Optional, Dict, Any, List


class ActivationClient:
    """Provider activation client"""

    def __init__(self, client):
        self._client = client

    def list_providers(self, capability: Optional[str] = None) -> Dict[str, Any]:
        """List available providers"""
        params: Dict[str, Any] = {}
        if capability:
            params["capability"] = capability
        return self._client.request("GET", "/api/v1/marketplace/providers", params=params)

    def get_provider(self, slug: str) -> Dict[str, Any]:
        """Get provider detail"""
        return self._client.request("GET", f"/api/v1/marketplace/providers/{slug}")

    def list(self) -> Dict[str, Any]:
        """List merchant's activations"""
        return self._client.request("GET", "/api/v1/marketplace/activations")

    def get(self, activation_id: str) -> Dict[str, Any]:
        """Get activation detail"""
        return self._client.request("GET", f"/api/v1/marketplace/activations/{activation_id}")

    def activate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Activate a provider"""
        return self._client.request("POST", "/api/v1/marketplace/activations", json=data)

    def pause(self, activation_id: str) -> Dict[str, Any]:
        """Pause an activation"""
        return self._client.request("POST", f"/api/v1/marketplace/activations/{activation_id}/pause")

    def resume(self, activation_id: str) -> Dict[str, Any]:
        """Resume an activation"""
        return self._client.request("POST", f"/api/v1/marketplace/activations/{activation_id}/resume")

    def revoke(self, activation_id: str, reason: Optional[str] = None) -> Dict[str, Any]:
        """Revoke an activation"""
        return self._client.request("POST", f"/api/v1/marketplace/activations/{activation_id}/revoke", json={"reason": reason or ""})
