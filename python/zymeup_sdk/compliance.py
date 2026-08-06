"""Zymeup Python SDK - Compliance Client"""
from typing import Optional, Dict, Any


class ComplianceClient:
    """Compliance rule engine client"""

    def __init__(self, client):
        self._client = client

    def list_rules(self, category: Optional[str] = None) -> Dict[str, Any]:
        """List compliance rules"""
        params: Dict[str, Any] = {}
        if category:
            params["category"] = category
        return self._client.request("GET", "/api/v1/compliance/rules", params=params)

    def create_rule(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a compliance rule"""
        return self._client.request("POST", "/api/v1/compliance/rules", json=data)

    def update_rule(self, rule_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a compliance rule"""
        return self._client.request("PUT", f"/api/v1/compliance/rules/{rule_id}", json=data)

    def delete_rule(self, rule_id: str) -> Dict[str, Any]:
        """Delete a compliance rule"""
        return self._client.request("DELETE", f"/api/v1/compliance/rules/{rule_id}")

    def evaluate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate compliance for given data"""
        return self._client.request("GET", "/api/v1/compliance/evaluate", params=data)
