<?php

namespace Zymeup\SDK;

class CarrierEpodClient
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
        return $this->client->request('GET', '/api/v1/carrier/epod/list' . ($q ? '?' . $q : ''));
    }

    public function get(string $id): array
    {
        return $this->client->request('GET', "/api/v1/carrier/epod/{$id}");
    }

    public function delivery(string $id, array $data): array
    {
        return $this->client->request('POST', "/api/v1/carrier/epod/{$id}/delivery", $data);
    }

    public function fail(string $id, array $data): array
    {
        return $this->client->request('POST', "/api/v1/carrier/epod/{$id}/fail", $data);
    }
}
