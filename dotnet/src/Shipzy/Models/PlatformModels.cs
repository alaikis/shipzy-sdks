using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class CarrierConfig
    {
        public string Id { get; set; }

        [JsonPropertyName("carrier_id")]
        public string CarrierId { get; set; }

        public string Key { get; set; }
        public string Value { get; set; }
        public string Description { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public string UpdatedAt { get; set; }
    }

    public class CarrierEndpoint
    {
        public string Id { get; set; }

        [JsonPropertyName("carrier_id")]
        public string CarrierId { get; set; }

        public string Name { get; set; }
        public string Url { get; set; }
        public string Method { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public string UpdatedAt { get; set; }
    }

    public class CarrierFieldMapping
    {
        public string Id { get; set; }

        [JsonPropertyName("carrier_id")]
        public string CarrierId { get; set; }

        [JsonPropertyName("local_field")]
        public string LocalField { get; set; }

        [JsonPropertyName("remote_field")]
        public string RemoteField { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public string UpdatedAt { get; set; }
    }

    public class PlatformConfig
    {
        public string Key { get; set; }
        public string Value { get; set; }
        public string Description { get; set; }
    }

    public class PlatformConfigListResponse
    {
        [JsonPropertyName("data")]
        public List<PlatformConfig> Data { get; set; }
    }
}
