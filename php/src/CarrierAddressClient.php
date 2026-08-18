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
        return $this->client->request('POST', '/api/v1/carrier/sdk/addresses/list', $params);
    }

    public function create(array $data): array
    {
        return $this->client->request('POST', '/api/v1/carrier/sdk/addresses/create', $data);
    }

    public function update(string $id, array $data): array
    {
        return $this->client->request('POST', "/api/v1/carrier/sdk/addresses/{$id}/update", $data);
    }

    public function delete(string $id): array
    {
        return $this->client->request('POST', "/api/v1/carrier/sdk/addresses/{$id}/delete", []);
    }

    public function setDefault(string $id): array
    {
        return $this->client->request('POST', "/api/v1/carrier/sdk/addresses/{$id}/set-default", []);
    }
}