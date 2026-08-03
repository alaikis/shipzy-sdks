<?php

namespace Zymeup\SDK;

class AgeVerificationClient
{
    private ZymeupClient $client;

    public function __construct(ZymeupClient $client)
    {
        $this->client = $client;
    }

    public function create(array $data): array
    {
        return $this->client->request('POST', '/api/v1/age-verification', $data);
    }

    public function verify(string $id, string $method, array $data): array
    {
        return $this->client->request('POST', "/api/v1/age-verification/{$id}/verify", [
            'method' => $method,
            ...$data,
        ]);
    }
}
