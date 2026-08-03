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
        return $this->client->request('GET', '/api/v1/finance/invoices' . ($q ? '?' . $q : ''));
    }

    public function subscription(): array
    {
        return $this->client->request('GET', '/api/v1/finance/subscription');
    }

    public function cancelSubscription(): array
    {
        return $this->client->request('POST', '/api/v1/finance/subscription/cancel', []);
    }
}
