using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class Provider
    {
        public string Slug { get; set; }
        public string Name { get; set; }
        public List<string> Capabilities { get; set; }
        public string Status { get; set; }
    }

    public class ProviderActivation
    {
        public string Id { get; set; }

        [JsonPropertyName("provider_slug")]
        public string ProviderSlug { get; set; }

        [JsonPropertyName("merchant_id")]
        public string MerchantId { get; set; }

        public string Status { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public string UpdatedAt { get; set; }
    }

    public class ProviderListResponse
    {
        [JsonPropertyName("data")]
        public List<Provider> Data { get; set; }

        public int Total { get; set; }
    }

    public class ActivationListResponse
    {
        [JsonPropertyName("data")]
        public List<ProviderActivation> Data { get; set; }

        public int Total { get; set; }
    }
}
