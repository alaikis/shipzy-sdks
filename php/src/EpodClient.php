<?php

namespace Zymeup\SDK;

class EpodClient
{
    private ZymeupClient $client;

    public function __construct(ZymeupClient $client)
    {
        $this->client = $client;
    }

    public function list(int $page = 1, int $pageSize = 25, ?string $status = null): array
    {
        $params = http_build_query(array_filter([
            'page' => $page,
            'page_size' => $pageSize,
            'status' => $status,
        ]));
        return $this->client->request('GET', '/api/v1/shipment/epod/list?' . $params);
    }

    public function get(string $id): array
    {
        return $this->client->request('GET', '/api/v1/shipment/epod/' . $id);
    }

    public function generateSignUrl(string $id): array
    {
        return $this->client->request('POST', '/api/v1/shipment/epod/' . $id . '/sign');
    }

    public function deliver(string $id, array $data = []): array
    {
        return $this->client->request('POST', '/api/v1/shipment/epod/' . $id . '/delivery', $data);
    }

    public function fail(string $id, array $data = []): array
    {
        return $this->client->request('POST', '/api/v1/shipment/epod/' . $id . '/fail', $data);
    }
}
