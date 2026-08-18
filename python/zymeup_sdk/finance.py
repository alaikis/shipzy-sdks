"""Zymeup Python SDK - Finance Client"""
from typing import Optional, Dict, Any, List


class FinanceClient:
    """Finance and subscription client"""

    def __init__(self, client):
        self._client = client

    def get_invoices(self) -> Dict[str, Any]:
        """List invoices"""
        return self._client.request("GET", "/api/v1/invoices")

    def list_subscriptions(self) -> Dict[str, Any]:
        """List subscriptions"""
        return self._client.request("GET", "/api/v1/subscriptions")

    def cancel_subscription(self, subscription_id: str) -> Dict[str, Any]:
        """Cancel a subscription"""
        return self._client.request("POST", f"/api/v1/subscriptions/{subscription_id}/cancel")

    def restore_subscription(self, subscription_id: str) -> Dict[str, Any]:
        """Restore a cancelled subscription"""
        return self._client.request("POST", f"/api/v1/subscriptions/{subscription_id}/resume")

    def download_invoice(self, invoice_id: str) -> Dict[str, Any]:
        """Download an invoice"""
        return self._client.request("GET", f"/api/v1/invoices/{invoice_id}/download")
