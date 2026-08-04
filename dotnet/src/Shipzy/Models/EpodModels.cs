using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class EpodListItem
    {
        public string Id { get; set; }

        [JsonPropertyName("tracking_no")]
        public string TrackingNo { get; set; }

        public string Status { get; set; }

        [JsonPropertyName("recipient_name")]
        public string RecipientName { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }
    }

    public class EpodListResponse
    {
        [JsonPropertyName("data")]
        public List<EpodListItem> Data { get; set; }

        public int Total { get; set; }
        public int Page { get; set; }

        [JsonPropertyName("page_size")]
        public int PageSize { get; set; }
    }

    public class EpodDetail
    {
        public string Id { get; set; }

        [JsonPropertyName("tracking_no")]
        public string TrackingNo { get; set; }

        public string Status { get; set; }

        [JsonPropertyName("recipient_name")]
        public string RecipientName { get; set; }

        [JsonPropertyName("recipient_phone")]
        public string RecipientPhone { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public string UpdatedAt { get; set; }

        [JsonPropertyName("sign_url")]
        public string SignUrl { get; set; }

        [JsonPropertyName("evidence_hash")]
        public string EvidenceHash { get; set; }

        [JsonPropertyName("document_hash")]
        public string DocumentHash { get; set; }

        [JsonPropertyName("signature_data")]
        public string SignatureData { get; set; }

        [JsonPropertyName("photo_url")]
        public string PhotoUrl { get; set; }
    }

    public class SignUrlResponse
    {
        [JsonPropertyName("sign_url")]
        public string SignUrl { get; set; }
    }
}
