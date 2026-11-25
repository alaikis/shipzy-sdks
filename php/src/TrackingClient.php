<?php

namespace Zymeup\SDK;

class TrackingClient
{
    private ZymeupClient $client;

    public function __construct(ZymeupClient $client)
    {
        $this->client = $client;
    }

    public function list(array $params = []): array
    {
        $q = http_build_query(array_filter([
            'page' => $params['page'] ?? 1,
            'page_size' => $params['pageSize'] ?? 20,
        ]));
        return $this->client->request('GET', '/api/v1/carrier/tracking/list' . ($q ? '?' . $q : ''));
    }

    public function get(string $id): array
    {
        // Response array is passed through as-is. Non-API scraped tracking may
        // include optional fields: data_source (api|scrape), last_scrape_at,
        // scrape_status (ok|throttled|cooldown|blocked|aggregator_fallback),
        // raw_status_text. Absent for API-sourced tracking (backward compatible).
        //
        // Change: eu-tracking-compliance-integration — EU compliance (optional).
        // The response MAY include an "eu_compliance" object (public view: carbon +
        // customs only): co2e_kg, co2e_methodology (glec|env_freight|
        // carrier_reported|estimated), co2e_calculated_at, co2e_source_provider
        // (transporeon|carrier_reported|ship24|platform), customs_mrn, customs_eori,
        // transit_document_type (t1|t2|t2f|tir|none), transit_document_ref,
        // ens_declaration_ref. GDPR governance fields (data_retention_until /
        // lawful_basis / personal_data_minimized) are NEVER present on the public
        // endpoint.
        //
        // Change: base-full-process — signer identity (eID) + evidence + TSA:
        //   - SignDetail response adds identity_required (bool) + identity_status
        //     (not_started|pending|verified) for qualified/eidas_advanced levels
        //   - EPOD sign flow: GET /open/epod/sign/:token/identity (start),
        //     GET /open/epod/sign/:token/identity/status (poll),
        //     POST /open/epod/sign/:token/identity/callback (confirm)
        //   - QTSP async signature: GET /open/epod/sign/:token/signature/status
        //   - Platform TSA: POST /api/v1/tsa/timestamp (Enterprise),
        //     GET /api/v1/tsa/certificates (public keys)
        //   - ECMR generate accepts signer_type (person|legal_entity) for eSeal
        return $this->client->request('GET', "/api/v1/carrier/tracking/{$id}");
    }

    public function subscribe(array $data): array
    {
        return $this->client->request('POST', '/api/v1/shipment/user/tracking/subscribe', $data);
    }

    public function unsubscribe(string $id): array
    {
        return $this->client->request('POST', "/api/v1/shipment/user/tracking/{$id}/unsubscribe", []);
    }
}