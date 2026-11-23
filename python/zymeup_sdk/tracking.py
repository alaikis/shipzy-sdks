"""Zymeup Python SDK - Tracking Client"""
from typing import Optional, Dict, Any, List


class TrackingClient:
    """Tracking management client"""

    def __init__(self, client):
        self._client = client

    def get(self, tracking_no: str) -> Dict[str, Any]:
        """Get public tracking detail by tracking number

        Response is passed through as-is. When the tracking is sourced from
        non-API scraping, the payload may include optional fields:
        data_source (api|scrape), last_scrape_at, scrape_status
        (ok|throttled|cooldown|blocked|aggregator_fallback), raw_status_text.
        All optional fields are absent for API-sourced tracking (backward compatible).
        """
        return self._client.request("GET", f"/api/v1/tracking/{tracking_no}")

    def stream(self, tracking_no: str) -> Dict[str, Any]:
        """Subscribe to real-time tracking events (SSE)"""
        return self._client.request("GET", f"/api/v1/tracking/{tracking_no}/stream")

    def create_event(self, tracking_no: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a tracking event for a tracking number"""
        return self._client.request("POST", f"/api/v1/tracking/{tracking_no}/events", json=data)

    def list(self, page: int = 1, page_size: int = 25, status: Optional[str] = None) -> Dict[str, Any]:
        """List merchant's tracking subscriptions

        Response is passed through as-is. List items may include optional
        non-API scrape metadata: data_source, last_scrape_at, scrape_status
        (absent for API-sourced tracking; backward compatible).
        """
        params = {"page": page, "page_size": page_size}
        if status:
            params["status"] = status
        return self._client.request("GET", "/api/v1/merchant/tracking/list", params=params)

    def bulk_import(self, tracking_numbers: List[str]) -> Dict[str, Any]:
        """Bulk import tracking numbers for subscription"""
        return self._client.request("POST", "/api/v1/merchant/tracking/bulk-import", json={"tracking_numbers": tracking_numbers})
