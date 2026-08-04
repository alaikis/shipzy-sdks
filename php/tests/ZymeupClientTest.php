<?php

namespace Zymeup\SDK\Tests;

use PHPUnit\Framework\TestCase;
use Zymeup\SDK\ZymeupClient;

final class ZymeupClientTest extends TestCase
{
    public function testVersionConstant(): void
    {
        $this->assertSame('2.0.0', ZymeupClient::VERSION);
    }

    public function testBaseUrlConstant(): void
    {
        $this->assertSame('https://api.zymeup.com', ZymeupClient::BASE_URL);
    }

    public function testAllSubClientsInitialized(): void
    {
        $client = new ZymeupClient('test-key');

        $subClients = [
            'epod', 'order', 'ecmr', 'address', 'activation',
            'ageVerification', 'pickupPoints', 'product', 'finance',
            'notification', 'supportTicket', 'merchantAddress', 'shipment',
            'parcel', 'compliance', 'carrierEpod', 'carrierAddress',
            'publicEpod', 'carrier', 'platformConfig', 'upload',
            'tracking', 'cpsc',
        ];

        foreach ($subClients as $prop) {
            $this->assertObjectHasProperty($prop, $client, "Sub-client {$prop} should be initialized");
            $this->assertNotNull($client->$prop);
        }
    }

    public function testRequestThrowsRuntimeExceptionOnCurlFailure(): void
    {
        $client = new ZymeupClient('key', 'https://invalid.host.nonexistent', 5);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessageMatches('/cURL request failed/');
        $client->request('GET', '/test');
    }

    public function testRequestThrowsRuntimeExceptionOnHttpError(): void
    {
        $client = new ZymeupClient('key', 'https://httpstat.us', 5);

        $this->expectException(\RuntimeException::class);
        $client->request('GET', '/400');
    }

    public function testInterceptorSettersDoNotThrow(): void
    {
        $client = new ZymeupClient('key');

        $client->setOnRequest(function () {});
        $client->setOnResponse(function () {});
        $client->setOnError(function () {});

        $this->assertTrue(true);
    }

    public function testSetMaxRetriesAndRetryDelay(): void
    {
        $client = new ZymeupClient('key');

        $client->setMaxRetries(5);
        $client->setRetryDelayMs(2000);

        $this->assertTrue(true);
    }

    public function testSubClientTypesAreCorrect(): void
    {
        $client = new ZymeupClient('key');

        $this->assertInstanceOf(\Zymeup\SDK\EpodClient::class, $client->epod);
        $this->assertInstanceOf(\Zymeup\SDK\OrderClient::class, $client->order);
        $this->assertInstanceOf(\Zymeup\SDK\EcmrClient::class, $client->ecmr);
        $this->assertInstanceOf(\Zymeup\SDK\TrackingClient::class, $client->tracking);
        $this->assertInstanceOf(\Zymeup\SDK\UploadClient::class, $client->upload);
        $this->assertInstanceOf(\Zymeup\SDK\CpscClient::class, $client->cpsc);
    }
}
