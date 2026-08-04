using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class Shipment
    {
        public string Id { get; set; }

        [JsonPropertyName("order_id")]
        public string OrderId { get; set; }

        [JsonPropertyName("tracking_no")]
        public string TrackingNo { get; set; }

        public string Status { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public string UpdatedAt { get; set; }
    }

    public class ShipmentDetail : Shipment
    {
        public List<object> Parcels { get; set; }

        [JsonPropertyName("item_lines")]
        public List<object> ItemLines { get; set; }
    }

    public class ShipmentListResponse
    {
        [JsonPropertyName("data")]
        public List<Shipment> Data { get; set; }

        public int Total { get; set; }
        public int Page { get; set; }

        [JsonPropertyName("page_size")]
        public int PageSize { get; set; }
    }
}
