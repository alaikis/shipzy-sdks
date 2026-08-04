<?php

namespace Zymeup\SDK;

class PublicEpodClient
{
    private ZymeupClient $client;

    public function __construct(ZymeupClient $client)
    {
        $this->client = $client;
    }

    public function get(string $token): array
    {
        return $this->client->request('GET', "/api/v1/open/ecmr/{$token}");
    }

    public function sign(string $token, array $data): array
    {
        return $this->client->request('POST', "/api/v1/open/ecmr/{$token}/sign", $data);
    }
}
