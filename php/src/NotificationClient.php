<?php

namespace Zymeup\SDK;

class NotificationClient
{
    private ZymeupClient $client;

    public function __construct(ZymeupClient $client)
    {
        $this->client = $client;
    }

    public function list(array $params = []): array
    {
        $q = http_build_query(array_filter($params));
        return $this->client->request('GET', '/api/v1/notification/list' . ($q ? '?' . $q : ''));
    }
}