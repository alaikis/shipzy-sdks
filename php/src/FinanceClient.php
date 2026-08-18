<?php

namespace Zymeup\SDK;

class FinanceClient
{
    private ZymeupClient $client;

    public function __construct(ZymeupClient $client)
    {
        $this->client = $client;
    }

    public function invoices(array $params = []): array
    {
        $q = http_build_query(array_filter($params));
        return $this->client->request('GET', '/api/v1/invoices' . ($q ? '?' . $q : ''));
    }

    public function subscription(): array
    {
        return $this->client->request('GET', '/api/v1/subscriptions');
    }

    public function cancelSubscription(string $id): array
    {
        return $this->client->request('POST', "/api/v1/subscriptions/{$id}/cancel", []);
    }

    public function downloadInvoice(string $id): array
    {
        return $this->client->request('GET', "/api/v1/invoices/{$id}/download");
    }
}