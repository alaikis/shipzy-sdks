<?php

namespace Zymeup\SDK;

class CarrierAddressClient
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
        return $this->client->request('GET', '/api/v1/carrier/addresses' . ($q ? '?' . $q : ''));
    }

    public function get(string $id): array
    {
        return $this->client->request('GET', "/api/v1/carrier/addresses/{$id}");
    }

    public function create(array $data): array
    {
        return $this->client->request('POST', '/api/v1/carrier/addresses', $data);
    }

    public function update(string $id, array $data): array
    {
        return $this->client->request('PUT', "/api/v1/carrier/addresses/{$id}", $data);
    }

    public function delete(string $id): array
    {
        return $this->client->request('DELETE', "/api/v1/carrier/addresses/{$id}");
    }
}
