<?php

namespace Zymeup\SDK;

class ProductClient
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
            'status' => $params['status'] ?? null,
        ]));
        return $this->client->request('GET', '/api/v1/products' . ($q ? '?' . $q : ''));
    }

    public function create(array $data): array
    {
        return $this->client->request('POST', '/api/v1/products', $data);
    }

    public function update(string $id, array $data): array
    {
        return $this->client->request('PUT', "/api/v1/products/{$id}", $data);
    }
}
