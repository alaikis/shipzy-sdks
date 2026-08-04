using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class PickupPoint
    {
        public string Id { get; set; }

        [JsonPropertyName("merchant_id")]
        public string MerchantId { get; set; }

        public string Type { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }

        [JsonPropertyName("contact_phone")]
        public string ContactPhone { get; set; }

        [JsonPropertyName("contact_email")]
        public string ContactEmail { get; set; }

        [JsonPropertyName("opening_hours")]
        public string OpeningHours { get; set; }

        public string Status { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        [JsonPropertyName("country_code")]
        public string CountryCode { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public string UpdatedAt { get; set; }
    }

    public class PickupPointListResponse
    {
        [JsonPropertyName("data")]
        public List<PickupPoint> Data { get; set; }

        public int Total { get; set; }
    }
}
