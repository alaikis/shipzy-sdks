using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class EcmrListItem
    {
        public string Id { get; set; }

        [JsonPropertyName("document_no")]
        public string DocumentNo { get; set; }

        public string Status { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }
    }

    public class EcmrListResponse
    {
        [JsonPropertyName("data")]
        public List<EcmrListItem> Data { get; set; }

        public int Total { get; set; }
        public int Page { get; set; }

        [JsonPropertyName("page_size")]
        public int PageSize { get; set; }
    }

    public class EcmrDetail
    {
        public string Id { get; set; }

        [JsonPropertyName("document_no")]
        public string DocumentNo { get; set; }

        public string Status { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public string UpdatedAt { get; set; }

        [JsonPropertyName("sign_url")]
        public string SignUrl { get; set; }

        [JsonPropertyName("document_hash")]
        public string DocumentHash { get; set; }

        [JsonPropertyName("signature_data")]
        public string SignatureData { get; set; }

        [JsonPropertyName("pdf_url")]
        public string PdfUrl { get; set; }
    }
}
