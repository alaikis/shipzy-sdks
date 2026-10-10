<?php

namespace Zymeup\SDK;

/**
 * Carrier client.
 *
 * Carrier array shape (all keys optional, returned by list/get):
 *   id, name, code, carrier_type, tracking_type, business_type, state,
 *   description, website, contact_email, contact_phone, created_at, updated_at,
 *   tracking_provider, tracking_slug
 *
 * tracking_provider / tracking_slug — Change: tracking-carrier-fallback
 *   tracking_provider: 'self' (self-built module, no fallback) | 'track123' | 'tracking51'
 *   tracking_slug:     courier identifier inside the provider namespace; required when provider != 'self'
 */
class CarrierClient
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
        return $this->client->request('GET', '/api/v1/carrier/list' . ($q ? '?' . $q : ''));
    }

    public function get(string $id): array
    {
        return $this->client->request('GET', "/api/v1/carrier/{$id}");
    }

    public function create(array $data): array
    {
        return $this->client->request('POST', '/api/v1/carrier/register', $data);
    }
}