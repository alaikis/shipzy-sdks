<?php

namespace Zymeup\SDK;

class PickupPointClient
{
    private ZymeupClient $client;

    public function __construct(ZymeupClient $client)
    {
        $this->client = $client;
    }

    public function list(array $params = []): array
    {
        $q = http_build_query(array_filter($params));
        return $this->client->request('GET', '/api/v1/admin/pickup-points' . ($q ? '?' . $q : ''));
    }

    public function search(array $params): array
    {
        return $this->client->request('POST', '/api/v1/admin/pickup-points/search', $params);
    }
}