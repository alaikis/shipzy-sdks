"""Zymeup Python SDK - Support Ticket Client"""
from typing import Optional, Dict, Any, List


class SupportTicketClient:
    """Support ticket client"""

    def __init__(self, client):
        self._client = client

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a support ticket"""
        return self._client.request("POST", "/shipment/support/tickets", json=data)

    def list(self, status: Optional[str] = None) -> Dict[str, Any]:
        """List support tickets"""
        params: Dict[str, Any] = {}
        if status:
            params["status"] = status
        return self._client.request("GET", "/shipment/support/tickets", params=params)

    def get(self, ticket_id: str) -> Dict[str, Any]:
        """Get support ticket detail"""
        return self._client.request("GET", f"/shipment/support/tickets/{ticket_id}")

    def add_message(self, ticket_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a message to a ticket"""
        return self._client.request("POST", f"/shipment/support/tickets/{ticket_id}/messages", json=data)
