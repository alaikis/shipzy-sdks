<?php

namespace Zymeup\SDK;

class ZymeupClient
{
    const VERSION = '2.0.1';
    const BASE_URL = 'https://api.zymeup.com';

    private string $apiKey;
    private string $baseUrl;
    private int $timeout;
    private string $role = 'merchant';

    /** @var callable|null */
    private $onRequest = null;
    /** @var callable|null */
    private $onResponse = null;
    /** @var callable|null */
    private $onError = null;
    private int $maxRetries = 3;
    private int $retryDelayMs = 1000;

    public EpodClient $epod;
    public OrderClient $order;
    public EcmrClient $ecmr;
    public AddressClient $address;
    public ActivationClient $activation;
    public AgeVerificationClient $ageVerification;
    public PickupPointClient $pickupPoints;
    public ProductClient $product;
    public FinanceClient $finance;
    public NotificationClient $notification;
    public SupportTicketClient $supportTicket;
    public MerchantAddressClient $merchantAddress;
    public ShipmentClient $shipment;
    public ParcelClient $parcel;
    public ComplianceClient $compliance;
    public CarrierEpodClient $carrierEpod;
    public CarrierAddressClient $carrierAddress;
    public PublicEpodClient $publicEpod;
    public CarrierClient $carrier;
    public PlatformConfigClient $platformConfig;
    public UploadClient $upload;
    public TrackingClient $tracking;
    public CpscClient $cpsc;

    public function __construct(string $apiKey, string $baseUrl = self::BASE_URL, int $timeout = 30)
    {
        $this->apiKey = $apiKey;
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->timeout = $timeout;

        $this->epod = new EpodClient($this);
        $this->order = new OrderClient($this);
        $this->ecmr = new EcmrClient($this);
        $this->address = new AddressClient($this);
        $this->activation = new ActivationClient($this);
        $this->ageVerification = new AgeVerificationClient($this);
        $this->pickupPoints = new PickupPointClient($this);
        $this->product = new ProductClient($this);
        $this->finance = new FinanceClient($this);
        $this->notification = new NotificationClient($this);
        $this->supportTicket = new SupportTicketClient($this);
        $this->merchantAddress = new MerchantAddressClient($this);
        $this->shipment = new ShipmentClient($this);
        $this->parcel = new ParcelClient($this);
        $this->compliance = new ComplianceClient($this);
        $this->carrierEpod = new CarrierEpodClient($this);
        $this->carrierAddress = new CarrierAddressClient($this);
        $this->publicEpod = new PublicEpodClient($this);
        $this->carrier = new CarrierClient($this);
        $this->platformConfig = new PlatformConfigClient($this);
        $this->upload = new UploadClient($this);
        $this->tracking = new TrackingClient($this);
        $this->cpsc = new CpscClient($this);
    }

    public function setOnRequest(?callable $fn): void
    {
        $this->onRequest = $fn;
    }

    public function setOnResponse(?callable $fn): void
    {
        $this->onResponse = $fn;
    }

    public function setOnError(?callable $fn): void
    {
        $this->onError = $fn;
    }

    public function setMaxRetries(int $n): void
    {
        $this->maxRetries = $n;
    }

    public function setRetryDelayMs(int $ms): void
    {
        $this->retryDelayMs = $ms;
    }

    public function getApiKey(): string
    {
        return $this->apiKey;
    }

    public function getBaseUrl(): string
    {
        return $this->baseUrl;
    }

    /**
     * @throws \RuntimeException
     */
    public function request(string $method, string $path, array $data = []): array
    {
        $url = $this->baseUrl . $path;

        if ($this->onRequest !== null) {
            ($this->onRequest)($method, $path, $data);
        }

        $lastException = null;
        $attempts = $this->maxRetries + 1;

        for ($attempt = 1; $attempt <= $attempts; $attempt++) {
            $ch = curl_init();

            if ($ch === false) {
                $ex = new \RuntimeException('Failed to initialize cURL handle');
                if ($this->onError !== null) {
                    ($this->onError)($ex);
                }
                throw $ex;
            }

            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, $this->timeout);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $this->apiKey,
                'Content-Type: application/json',
                'User-Agent: zymeup-sdk-php/' . self::VERSION,
            ]);

            if ($method !== 'GET') {
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
            }

            if ($method === 'POST' || $method === 'PUT' || $method === 'PATCH') {
                $encoded = json_encode($data);
                if ($encoded === false) {
                    curl_close($ch);
                    $ex = new \RuntimeException('Failed to encode request body: ' . json_last_error_msg());
                    if ($this->onError !== null) {
                        ($this->onError)($ex);
                    }
                    throw $ex;
                }
                curl_setopt($ch, CURLOPT_POSTFIELDS, $encoded);
            }

            $response = curl_exec($ch);

            if ($response === false) {
                $error = curl_error($ch);
                $errno = curl_errno($ch);
                curl_close($ch);
                $lastException = new \RuntimeException("cURL request failed (errno {$errno}): {$error}");

                if ($attempt < $attempts) {
                    usleep($this->retryDelayMs * pow(2, $attempt - 1) * 1000);
                    continue;
                }

                if ($this->onError !== null) {
                    ($this->onError)($lastException);
                }
                throw $lastException;
            }

            $statusCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            $decoded = json_decode($response, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \RuntimeException(
                    "Failed to decode response (HTTP {$statusCode}): " . json_last_error_msg()
                );
            }

            if ($statusCode >= 500 && $attempt < $attempts) {
                usleep($this->retryDelayMs * pow(2, $attempt - 1) * 1000);
                continue;
            }

            if ($statusCode >= 400) {
                $ex = new \RuntimeException(
                    "HTTP {$statusCode} error for {$method} {$path}: "
                    . (is_array($decoded) ? json_encode($decoded) : $response)
                );
                if ($this->onError !== null) {
                    ($this->onError)($ex);
                }
                throw $ex;
            }

            if ($this->onResponse !== null) {
                $result = ($this->onResponse)($decoded ?? [], $statusCode);
                return is_array($result) ? $result : ($decoded ?? []);
            }

            return $decoded ?? [];
        }

        if ($lastException !== null) {
            if ($this->onError !== null) {
                ($this->onError)($lastException);
            }
            throw $lastException;
        }

        throw new \RuntimeException("Request failed after {$attempts} attempts for {$method} {$path}");
    }
}
