<?php

namespace Zymeup\SDK;

class EpodClient
{
    private ZymeupClient $client;

    public function __construct(ZymeupClient $client)
    {
        $this->client = $client;
    }

    public function list(int $page = 1, int $pageSize = 25, ?string $status = null): array
    {
        $params = http_build_query(array_filter([
            'page' => $page,
            'page_size' => $pageSize,
            'status' => $status,
        ]));
        return $this->client->request('GET', '/api/v1/shipment/epod/list?' . $params);
    }

    public function get(string $id): array
    {
        return $this->client->request('GET', '/api/v1/shipment/epod/' . $id);
    }

    public function create(array $data): array
    {
        return $this->client->request('POST', '/api/v1/shipment/epod/create', $data);
    }

    public function generateFromOrder(string $orderId, array $options = []): array
    {
        return $this->client->request('POST', '/api/v1/shipment/epod/generate-from-order', array_merge(['order_id' => $orderId], $options));
    }

    public function update(string $id, array $data): array
    {
        return $this->client->request('PUT', '/api/v1/shipment/epod/' . $id . '/update', $data);
    }

    public function generateSignUrl(string $id): array
    {
        return $this->client->request('POST', '/api/v1/shipment/epod/' . $id . '/sign');
    }

    public function deliver(string $id, array $data = []): array
    {
        return $this->client->request('POST', '/api/v1/shipment/epod/' . $id . '/delivery', $data);
    }

    public function fail(string $id, array $data = []): array
    {
        return $this->client->request('POST', '/api/v1/shipment/epod/' . $id . '/fail', $data);
    }

    public function generatePdf(string $id): array
    {
        return $this->client->request('POST', '/api/v1/shipment/epod/' . $id . '/pdf');
    }

    public function verify(string $id): array
    {
        return $this->client->request('POST', '/api/v1/shipment/epod/' . $id . '/verify');
    }

    public function captureProof(string $id, array $data = []): array
    {
        return $this->client->request('POST', '/api/v1/shipment/epod/' . $id . '/capture-proof', $data);
    }

    public function uploadPhoto(string $id, string $filePath): array
    {
        $url = $this->client->getBaseUrl() . '/api/v1/shipment/epod/' . $id . '/upload-photo';
        $ch = curl_init($url);
        $file = new \CURLFile($filePath);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->client->getApiKey(),
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, ['file' => $file]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($response === false) {
            throw new \RuntimeException('Upload failed');
        }
        $decoded = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException('Invalid response');
        }
        return $decoded;
    }

    public function markPartialDelivery(string $id, array $data): array
    {
        $now = date('c');
        $exceptions = [];
        foreach (($data['exceptions'] ?? []) as $exc) {
            $exc['reported_at'] = $exc['reported_at'] ?? $now;
            $exceptions[] = $exc;
        }
        return $this->client->request('PUT', '/api/v1/shipment/epod/' . $id . '/update', [
            'status' => 'partial',
            'exceptions' => $exceptions,
            'remark' => $data['remark'] ?? null,
        ]);
    }

    public function getPdfStatus(string $id): array
    {
        return $this->client->request('POST', '/api/v1/shipment/epod/' . $id . '/pdf', []);
    }
}
