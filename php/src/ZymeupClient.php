<?php

namespace Zymeup\SDK;

class ZymeupClient
{
    const VERSION = '1.2.0';
    const BASE_URL = 'https://api.zymeup.com';

    private string $apiKey;
    private string $baseUrl;
    private int $timeout;

    public EpodClient $epod;

    public function __construct(string $apiKey, string $baseUrl = self::BASE_URL, int $timeout = 30)
    {
        $this->apiKey = $apiKey;
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->timeout = $timeout;
        $this->epod = new EpodClient($this);
    }

    public function request(string $method, string $path, array $data = []): array
    {
        $url = $this->baseUrl . $path;
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, $this->timeout);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json',
            'User-Agent: zymeup-sdk-php/' . self::VERSION,
        ]);

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true) ?? [];
    }
}
