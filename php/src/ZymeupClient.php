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

        if ($method !== 'GET') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        }

        if ($method === 'POST' || $method === 'PUT' || $method === 'PATCH') {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true) ?? [];
    }
}
