<?php

namespace Zymeup\SDK;

class ActivationClient
{
    private ZymeupClient $client;

    public function __construct(ZymeupClient $client)
    {
        $this->client = $client;
    }

    public function list(): array
    {
        return $this->client->request('GET', '/api/v1/carrier/activations');
    }

    public function create(array $data): array
    {
        return $this->client->request('POST', '/api/v1/carrier/activations', $data);
    }

    public function get(string $id): array
    {
        return $this->client->request('GET', "/api/v1/carrier/activations/{$id}");
    }

    public function activate(string $id, array $credentials): array
    {
        return $this->client->request('POST', "/api/v1/carrier/activations/{$id}/activate", $credentials);
    }

    public function deactivate(string $id): array
    {
        return $this->client->request('POST', "/api/v1/carrier/activations/{$id}/deactivate", []);
    }
}
