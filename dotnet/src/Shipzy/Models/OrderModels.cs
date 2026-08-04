using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class OrderListItem
    {
        public string Id { get; set; }

        [JsonPropertyName("order_no")]
        public string OrderNo { get; set; }

        public string Status { get; set; }

        [JsonPropertyName("customer_name")]
        public string CustomerName { get; set; }

        [JsonPropertyName("total_amount")]
        public decimal? TotalAmount { get; set; }

        public string Currency { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }
    }

    public class OrderListResponse
    {
        [JsonPropertyName("data")]
        public List<OrderListItem> Data { get; set; }

        public int Total { get; set; }
        public int Page { get; set; }

        [JsonPropertyName("page_size")]
        public int PageSize { get; set; }
    }

    public class OrderDetail
    {
        public string Id { get; set; }

        [JsonPropertyName("order_no")]
        public string OrderNo { get; set; }

        public string Status { get; set; }

        [JsonPropertyName("customer_name")]
        public string CustomerName { get; set; }

        [JsonPropertyName("customer_email")]
        public string CustomerEmail { get; set; }

        [JsonPropertyName("customer_phone")]
        public string CustomerPhone { get; set; }

        [JsonPropertyName("total_amount")]
        public decimal? TotalAmount { get; set; }

        public string Currency { get; set; }
        public string Notes { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public string UpdatedAt { get; set; }
    }
}
