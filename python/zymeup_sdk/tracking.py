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

        Change: eu-tracking-compliance-integration — EU compliance (optional).
        The response MAY include an "eu_compliance" object (public view: carbon +
        customs only): co2e_kg, co2e_methodology (glec|env_freight|
        carrier_reported|estimated), co2e_calculated_at, co2e_source_provider
        (transporeon|carrier_reported|ship24|platform), customs_mrn, customs_eori,
        transit_document_type (t1|t2|t2f|tir|none), transit_document_ref,
        ens_declaration_ref. GDPR governance fields (data_retention_until /
        lawful_basis / personal_data_minimized) are NEVER present on the public
        endpoint.

        Change: base-full-process — signer identity (eID) + evidence + TSA:
          - SignDetail response adds identity_required (bool) + identity_status
            (not_started|pending|verified) for qualified/eidas_advanced levels
          - EPOD sign flow: GET /open/epod/sign/:token/identity (start),
            GET /open/epod/sign/:token/identity/status (poll),
            POST /open/epod/sign/:token/identity/callback (confirm)
          - QTSP async signature: GET /open/epod/sign/:token/signature/status
          - Platform TSA: POST /api/v1/tsa/timestamp (Enterprise),
            GET /api/v1/tsa/certificates (public keys)
          - ECMR generate accepts signer_type (person|legal_entity) for eSeal
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
