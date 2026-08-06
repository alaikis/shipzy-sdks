using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class PublicEpodClient
    {
        private readonly string _baseUrl;
        private static readonly JsonSerializerOptions s_jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public PublicEpodClient(string baseUrl = "https://api.zymeup.com")
        {
            _baseUrl = baseUrl.TrimEnd('/');
        }

        public async Task<PublicSignDetail> GetSignDetailAsync(string signToken)
        {
            var resp = await _http.GetFromJsonAsync<PublicSignDetail>($"{_baseUrl}/api/v1/open/epod/sign/{signToken}", s_jsonOptions);
            return resp;
        }

        public async Task<object> GetPolicyAsync(string signToken, string lang = "en")
        {
            var resp = await _http.GetFromJsonAsync<object>($"{_baseUrl}/api/v1/open/epod/sign/{signToken}/policy?lang={lang}");
            return resp;
        }

        public async Task<PublicConsentResponse> RecordConsentAsync(string signToken, string[] consentTypes, string policyVersionHash)
        {
            var body = JsonSerializer.Serialize(new { consent_types = consentTypes, policy_version_hash = policyVersionHash }, s_jsonOptions);
            var resp = await _http.PostAsync($"{_baseUrl}/api/v1/open/epod/sign/{signToken}/consent",
                new StringContent(body, Encoding.UTF8, "application/json"));
            resp.EnsureSuccessStatusCode();
            var content = await resp.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<PublicConsentResponse>(content, s_jsonOptions);
        }

        public async Task<PublicCaptureResponse> CaptureSignatureAsync(string signToken, string consentId, string signatureData, string proofType = "signature")
        {
            var body = JsonSerializer.Serialize(new { consent_id = consentId, signature_data = signatureData, proof_type = proofType }, s_jsonOptions);
            var resp = await _http.PostAsync($"{_baseUrl}/api/v1/open/epod/sign/{signToken}/capture",
                new StringContent(body, Encoding.UTF8, "application/json"));
            resp.EnsureSuccessStatusCode();
            var content = await resp.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<PublicCaptureResponse>(content, s_jsonOptions);
        }

        private static readonly HttpClient _http = new();
    }

    public class PublicSignDetail
    {
        public string TrackingNo { get; set; }
        public string RecipientName { get; set; }
        public string DeliveryAddressSummary { get; set; }
        public string DestinationCountryCode { get; set; }
        public string PolicyUrl { get; set; }
        public string PolicyVersionHash { get; set; }
        public string SignatureLevelRequired { get; set; }
        public string[] AllowedProofTypes { get; set; }
        public bool SignatureWaived { get; set; }
        public string ExpiresAt { get; set; }
    }

    public class PublicConsentResponse
    {
        public string ConsentId { get; set; }
        public string PolicyVersionHash { get; set; }
    }

    public class PublicCaptureResponse
    {
        public string EvidenceHash { get; set; }
        public string Status { get; set; }
        public bool HashLocked { get; set; }
    }
}
