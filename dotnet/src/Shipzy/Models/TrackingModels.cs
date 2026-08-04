using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class TrackingEvent
    {
        public string Remark { get; set; }

        [JsonPropertyName("event_time")]
        public string EventTime { get; set; }

        [JsonPropertyName("event_type")]
        public string EventType { get; set; }

        public TrackingLocation Location { get; set; }
    }

    public class TrackingLocation
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string Label { get; set; }
    }

    public class TrackingDetail
    {
        [JsonPropertyName("tracking_no")]
        public string TrackingNo { get; set; }

        public string Status { get; set; }

        [JsonPropertyName("carrier_name")]
        public string CarrierName { get; set; }

        [JsonPropertyName("latest_event")]
        public string LatestEvent { get; set; }

        [JsonPropertyName("estimated_delivery")]
        public string EstimatedDelivery { get; set; }

        [JsonPropertyName("actual_delivery")]
        public string ActualDelivery { get; set; }

        public TrackingAddress Origin { get; set; }
        public TrackingAddress Destination { get; set; }
        public List<TrackingEvent> Events { get; set; }
    }

    public class TrackingAddress
    {
        [JsonPropertyName("full_name")]
        public string FullName { get; set; }

        public string City { get; set; }

        [JsonPropertyName("country_code")]
        public string CountryCode { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }

    public class TrackingListItem
    {
        [JsonPropertyName("tracking_no")]
        public string TrackingNo { get; set; }

        public string Status { get; set; }

        [JsonPropertyName("carrier_name")]
        public string CarrierName { get; set; }

        [JsonPropertyName("latest_event")]
        public string LatestEvent { get; set; }

        [JsonPropertyName("updated_at")]
        public string UpdatedAt { get; set; }
    }

    public class TrackingListResponse
    {
        [JsonPropertyName("data")]
        public List<TrackingListItem> Data { get; set; }

        public int Total { get; set; }
        public int Page { get; set; }

        [JsonPropertyName("page_size")]
        public int PageSize { get; set; }
    }
}
