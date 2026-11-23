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