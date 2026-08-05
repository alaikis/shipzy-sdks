<?php

namespace Zymeup\SDK;

class ValidationClient
{
    private ZymeupClient $client;

    public function __construct(ZymeupClient $client)
    {
        $this->client = $client;
    }

    public function verifyPhone(string $countryCode, string $phone): array
    {
        return $this->client->request('POST', '/api/v1/validation/phone', [
            'country_code' => $countryCode,
            'phone' => $phone,
        ]);
    }

    public function formatPhone(string $countryCode, string $phone): array
    {
        return $this->client->request('POST', '/api/v1/validation/phone/format', [
            'country_code' => $countryCode,
            'phone' => $phone,
        ]);
    }

    public function validatePostalCode(string $countryCode, string $code): array
    {
        return $this->client->request('POST', '/api/v1/validation/postal-code', [
            'country_code' => $countryCode,
            'code' => $code,
        ]);
    }

    public function validateEmail(string $email): array
    {
        return $this->client->request('POST', '/api/v1/validation/email', [
            'email' => $email,
        ]);
    }

    public function validateTaxId(string $countryCode, string $taxId): array
    {
        return $this->client->request('POST', '/api/v1/validation/tax-id', [
            'country_code' => $countryCode,
            'tax_id' => $taxId,
        ]);
    }
}
