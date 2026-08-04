<?php

namespace Zymeup\SDK\Tests;

use PHPUnit\Framework\TestCase;
use Zymeup\SDK\ZymeupClient;
use Zymeup\SDK\OrderClient;

final class OrderClientTest extends TestCase
{
    private array $capturedRequests = [];
    private ZymeupClient $zyClient;
    private OrderClient $orderClient;

    protected function setUp(): void
    {
        $this->capturedRequests = [];
        $this->zyClient = $this->createMock(ZymeupClient::class);
        $this->zyClient->method('request')->willReturnCallback(
            function (string $method, string $path, array $data = []) {
                $this->capturedRequests[] = compact('method', 'path', 'data');
                return ['code' => 0, 'data' => []];
            }
        );
        $this->orderClient = new OrderClient($this->zyClient);
    }

    private function lastRequest(): array
    {
        return end($this->capturedRequests);
    }

    public function testOrderClientIsInitializedFromZymeupClient(): void
    {
        $this->assertInstanceOf(OrderClient::class, $this->orderClient);
    }

    public function testListBuildsCorrectPath(): void
    {
        $this->orderClient->list(['page' => 2, 'pageSize' => 10, 'status' => 'pending']);

        $req = $this->lastRequest();
        $this->assertSame('GET', $req['method']);
        $this->assertStringContainsString('/api/v1/order/list', $req['path']);
        $this->assertStringContainsString('page=2', $req['path']);
        $this->assertStringContainsString('page_size=10', $req['path']);
        $this->assertStringContainsString('status=pending', $req['path']);
    }

    public function testListDefaultParams(): void
    {
        $this->orderClient->list();

        $req = $this->lastRequest();
        $this->assertSame('GET', $req['method']);
        $this->assertStringContainsString('/api/v1/order/list', $req['path']);
    }

    public function testGetCallsCorrectEndpoint(): void
    {
        $this->orderClient->get('order-123');

        $req = $this->lastRequest();
        $this->assertSame('GET', $req['method']);
        $this->assertSame('/api/v1/order/order-123', $req['path']);
    }

    public function testCreateSendsPostData(): void
    {
        $data = ['order_no' => 'ORD-001', 'customer_name' => 'Acme'];
        $this->orderClient->create($data);

        $req = $this->lastRequest();
        $this->assertSame('POST', $req['method']);
        $this->assertSame('/api/v1/order/create', $req['path']);
        $this->assertSame($data, $req['data']);
    }

    public function testCancelCallsCorrectEndpoint(): void
    {
        $this->orderClient->cancel('order-456');

        $req = $this->lastRequest();
        $this->assertSame('POST', $req['method']);
        $this->assertSame('/api/v1/order/order-456/cancel', $req['path']);
        $this->assertSame([], $req['data']);
    }

    public function testUpdateCallsCorrectEndpoint(): void
    {
        $this->orderClient->update('order-789', ['status' => 'confirmed']);

        $req = $this->lastRequest();
        $this->assertSame('POST', $req['method']);
        $this->assertSame('/api/v1/order/order-789/update', $req['path']);
    }

    public function testCreateWithDocumentsCallsCorrectEndpoint(): void
    {
        $this->orderClient->createWithDocuments(['order_no' => 'ORD-002']);

        $req = $this->lastRequest();
        $this->assertSame('POST', $req['method']);
        $this->assertSame('/api/v1/order/create-with-documents', $req['path']);
    }
}
