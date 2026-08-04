<?php

namespace Zymeup\SDK;

class UploadClient
{
    private ZymeupClient $client;

    public function __construct(ZymeupClient $client)
    {
        $this->client = $client;
    }

    public function upload(array $file): array
    {
        return $this->client->request('POST', '/api/v1/upload', $file);
    }

    public function get(string $id): array
    {
        return $this->client->request('GET', "/api/v1/upload/{$id}");
    }
}
