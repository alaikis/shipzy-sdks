<?php

namespace Zymeup\SDK;

class OrderClient
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
        return $this->client->request('GET', '/api/v1/order/list' . ($q ? '?' . $q : ''));
    }

    public function get(string $id): array
    {
        return $this->client->request('GET', "/api/v1/order/{$id}");
    }

    public function create(array $data): array
    {
        return $this->client->request('POST', '/api/v1/order/create', $data);
    }

    public function createWithDocuments(array $data): array
    {
        return $this->client->request('POST', '/api/v1/order/create-with-documents', $data);
    }

    public function update(string $id, array $data): array
    {
        return $this->client->request('POST', "/api/v1/order/{$id}/update", $data);
    }

    public function cancel(string $id): array
    {
        return $this->client->request('POST', "/api/v1/order/{$id}/cancel", []);
    }
}
