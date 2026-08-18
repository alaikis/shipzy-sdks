<?php

namespace Zymeup\SDK;

class SupportTicketClient
{
    private ZymeupClient $client;

    public function __construct(ZymeupClient $client)
    {
        $this->client = $client;
    }

    public function create(array $data): array
    {
        return $this->client->request('POST', '/api/v1/shipment/support/tickets', $data);
    }

    public function list(array $params = []): array
    {
        $q = http_build_query(array_filter($params));
        return $this->client->request('GET', '/api/v1/shipment/support/tickets' . ($q ? '?' . $q : ''));
    }

    public function get(string $id): array
    {
        return $this->client->request('GET', "/api/v1/shipment/support/tickets/{$id}");
    }

    public function addMessage(string $id, string $content): array
    {
        return $this->client->request('POST', "/api/v1/shipment/support/tickets/{$id}/messages", ['content' => $content]);
    }
}