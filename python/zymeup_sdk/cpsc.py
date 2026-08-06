"""Zymeup Python SDK - CPSC Client"""
from typing import Optional, Dict, Any, List


class CpscClient:
    """CPSC (Customs & Product Safety Compliance) eFiling client"""

    def __init__(self, client):
        self._client = client

    def get_collections(self) -> Dict[str, Any]:
        """List available CPSC collections"""
        return self._client.request("GET", "/api/v1/cpsc/collections")

    def get_credential(self) -> Dict[str, Any]:
        """Get CPSC API credential status"""
        return self._client.request("GET", "/api/v1/cpsc/credential")

    def save_credential(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Save CPSC API credential"""
        return self._client.request("POST", "/api/v1/cpsc/credential", json=data)

    def import_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Import CPSC data (9610/9810)"""
        return self._client.request("POST", "/api/v1/cpsc/import", json=data)

    def get_imports(self, page: int = 1, page_size: int = 25) -> Dict[str, Any]:
        """List import history"""
        return self._client.request("GET", "/api/v1/cpsc/imports", params={"page": page, "page_size": page_size})

    def get_import_status(self, import_id: str) -> Dict[str, Any]:
        """Get import status"""
        return self._client.request("GET", f"/api/v1/cpsc/import/{import_id}/status")

    def get_import_log(self, import_id: str) -> Dict[str, Any]:
        """Get import log"""
        return self._client.request("GET", f"/api/v1/cpsc/import/{import_id}/log")

    def export(self, data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Export CPSC data (sync)"""
        return self._client.request("GET", "/api/v1/cpsc/export", params=data or {})

    def export_async(self, data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Export CPSC data (async)"""
        return self._client.request("GET", "/api/v1/cpsc/export-async", params=data or {})

    def get_export_async_status(self, export_id: str) -> Dict[str, Any]:
        """Get async export status"""
        return self._client.request("GET", f"/api/v1/cpsc/export-async/{export_id}/status")

    def get_export_async_data(self, export_id: str) -> Dict[str, Any]:
        """Get async export data"""
        return self._client.request("GET", f"/api/v1/cpsc/export-async/{export_id}/data")

    def get_certificates(self) -> Dict[str, Any]:
        """List certificates"""
        return self._client.request("POST", "/api/v1/cpsc/certificates")

    def get_trade_parties(self) -> Dict[str, Any]:
        """List trade parties"""
        return self._client.request("GET", "/api/v1/cpsc/trade-parties")

    def save_trade_party(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update a trade party"""
        return self._client.request("POST", "/api/v1/cpsc/trade-parties", json=data)

    def delete_trade_party(self, party_id: str) -> Dict[str, Any]:
        """Delete a trade party"""
        return self._client.request("DELETE", f"/api/v1/cpsc/trade-parties/{party_id}")

    def get_token_expiration(self) -> Dict[str, Any]:
        """Get CPSC token expiration info"""
        return self._client.request("GET", "/api/v1/cpsc/token-expiration")
