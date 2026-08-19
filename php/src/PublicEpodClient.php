<?php

namespace Zymeup\SDK;

class PublicEpodClient
{
    private ZymeupClient $client;

    public function __construct(ZymeupClient $client)
    {
        $this->client = $client;
    }

    public function getSignDetail(string $token): array
    {
        return $this->client->request('GET', "/api/v1/open/epod/sign/{$token}");
    }

    public function getPolicy(string $token, string $lang = 'en'): array
    {
        return $this->client->request('GET', "/api/v1/open/epod/sign/{$token}/policy?lang={$lang}");
    }

    public function recordConsent(string $token, array $consentTypes, string $policyVersionHash): array
    {
        return $this->client->request('POST', "/api/v1/open/epod/sign/{$token}/consent", [
            'consent_types' => $consentTypes,
            'policy_version_hash' => $policyVersionHash,
        ]);
    }

    public function captureSignature(string $token, string $consentId, string $signatureData, string $proofType = 'signature'): array
    {
        return $this->client->request('POST', "/api/v1/open/epod/sign/{$token}/capture", [
            'consent_id' => $consentId,
            'signature_data' => $signatureData,
            'proof_type' => $proofType,
        ]);
    }
}
