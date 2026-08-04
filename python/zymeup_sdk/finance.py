"""Zymeup Python SDK - Finance Client"""
from typing import Optional, Dict, Any, List


class FinanceClient:
    """Finance and subscription client"""

    def __init__(self, client):
        self._client = client

    def get_invoices(self) -> Dict[str, Any]:
        """List invoices"""
        return self._client.request("GET", "/api/finance/invoices")

    def list_subscriptions(self) -> Dict[str, Any]:
        """List subscriptions"""
        return self._client.request("GET", "/api/finance/subscriptions")

    def cancel_subscription(self, subscription_id: str) -> Dict[str, Any]:
        """Cancel a subscription"""
        return self._client.request("POST", f"/api/finance/subscriptions/{subscription_id}/cancel")

    def restore_subscription(self, subscription_id: str) -> Dict[str, Any]:
        """Restore a cancelled subscription"""
        return self._client.request("POST", f"/api/finance/subscriptions/{subscription_id}/restore")

    def download_invoice(self, invoice_id: str) -> Dict[str, Any]:
        """Download an invoice"""
        return self._client.request("GET", f"/api/v1/merchant/invoices/{invoice_id}/download")
