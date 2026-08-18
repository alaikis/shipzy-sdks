using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class Carrier
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }

        [JsonPropertyName("carrier_type")]
        public string CarrierType { get; set; }

        [JsonPropertyName("tracking_type")]
        public string TrackingType { get; set; }

        [JsonPropertyName("tracking_provider")]
        public string TrackingProvider { get; set; }

        [JsonPropertyName("tracking_slug")]
        public string TrackingSlug { get; set; }

        [JsonPropertyName("business_type")]
        public string BusinessType { get; set; }

        public string State { get; set; }
        public string Description { get; set; }
        public string Website { get; set; }

        [JsonPropertyName("contact_email")]
        public string ContactEmail { get; set; }

        [JsonPropertyName("contact_phone")]
        public string ContactPhone { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public string UpdatedAt { get; set; }
    }
}