<?php

namespace Zymeup\SDK;

class ZymeupClient
{
    const VERSION = '2.0.0';
    const BASE_URL = 'https://api.zymeup.com';

    private string $apiKey;
    private string $baseUrl;
    private int $timeout;
    private string $role = 'merchant';

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

        if ($method === 'POST' || $method === 'PUT' || $method === 'PATCH') {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true) ?? [];
    }
}
