"""Zymeup Python SDK - Age Verification Client"""
from typing import Optional, Dict, Any, List


class AgeVerificationClient:
    """Age verification client"""

    def __init__(self, client):
        self._client = client

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create an age verification event"""
        return self._client.request("POST", "/api/v1/age-verifications", json=data)

    def list_by_parcel(self, parcel_id: str) -> Dict[str, Any]:
        """List age verifications by parcel"""
        return self._client.request("GET", "/api/v1/age-verifications", params={"parcel_id": parcel_id})

    def list_by_order(self, order_id: str) -> Dict[str, Any]:
        """List age verifications by order"""
        return self._client.request("GET", "/api/v1/age-verifications", params={"order_id": order_id})
