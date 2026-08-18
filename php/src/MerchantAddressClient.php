<?php

namespace Zymeup\SDK;

class MerchantAddressClient
{
    private ZymeupClient $client;

    public function __construct(ZymeupClient $client)
    {
        $this->client = $client;
    }

    public function list(array $params = []): array
    {
        return $this->client->request('POST', '/api/v1/merchant/addresses/list', $params);
    }

    public function create(array $data): array
    {
        return $this->client->request('POST', '/api/v1/merchant/addresses/create', $data);
    }

    public function update(string $id, array $data): array
    {
        return $this->client->request('POST', "/api/v1/merchant/addresses/{$id}/update", $data);
    }

    public function delete(string $id): array
    {
        return $this->client->request('POST', "/api/v1/merchant/addresses/{$id}/delete", []);
    }

    public function setDefault(string $id): array
    {
        return $this->client->request('POST', "/api/v1/merchant/addresses/{$id}/set-default", []);
    }
}