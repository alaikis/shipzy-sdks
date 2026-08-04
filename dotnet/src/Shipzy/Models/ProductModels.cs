using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class Product
    {
        public string Id { get; set; }

        [JsonPropertyName("merchant_id")]
        public string MerchantId { get; set; }

        public string Name { get; set; }
        public string Sku { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Status { get; set; }
        public decimal? Price { get; set; }
        public string Currency { get; set; }

        [JsonPropertyName("age_restricted")]
        public bool AgeRestricted { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public string UpdatedAt { get; set; }
    }

    public class ProductListResponse
    {
        [JsonPropertyName("data")]
        public List<Product> Data { get; set; }

        public int Total { get; set; }
        public int Page { get; set; }

        [JsonPropertyName("page_size")]
        public int PageSize { get; set; }
    }
}
