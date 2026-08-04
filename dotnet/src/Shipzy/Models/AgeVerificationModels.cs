using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class AgeVerificationEvent
    {
        public string Id { get; set; }

        [JsonPropertyName("merchant_id")]
        public string MerchantId { get; set; }

        [JsonPropertyName("parcel_id")]
        public string ParcelId { get; set; }

        [JsonPropertyName("order_id")]
        public string OrderId { get; set; }

        [JsonPropertyName("epod_id")]
        public string EpodId { get; set; }

        public string Method { get; set; }
        public bool Pass { get; set; }

        [JsonPropertyName("min_age_required")]
        public int MinAgeRequired { get; set; }

        [JsonPropertyName("checker_user_id")]
        public string CheckerUserId { get; set; }

        [JsonPropertyName("checked_at")]
        public string CheckedAt { get; set; }

        public string Remark { get; set; }

        [JsonPropertyName("country_code")]
        public string CountryCode { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public string UpdatedAt { get; set; }
    }

    public class AgeVerificationListResponse
    {
        [JsonPropertyName("data")]
        public List<AgeVerificationEvent> Data { get; set; }

        public int Total { get; set; }
    }
}
