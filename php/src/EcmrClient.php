<?php

namespace Zymeup\SDK;

class EcmrClient
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
        return $this->client->request('GET', '/api/v1/shipment/ecmr/list' . ($q ? '?' . $q : ''));
    }

    public function get(string $id): array
    {
        return $this->client->request('GET', "/api/v1/shipment/ecmr/{$id}");
    }

    public function create(array $data): array
    {
        return $this->client->request('POST', '/api/v1/shipment/ecmr/create', $data);
    }

    public function generateFromOrder(string $orderId): array
    {
        return $this->client->request('POST', '/api/v1/shipment/ecmr/generate-from-order', ['order_id' => $orderId]);
    }

    public function sign(string $id): array
    {
        return $this->client->request('POST', "/api/v1/shipment/ecmr/{$id}/sign", []);
    }

    public function pdf(string $id): array
    {
        return $this->client->request('POST', "/api/v1/shipment/ecmr/{$id}/pdf", []);
    }
}
