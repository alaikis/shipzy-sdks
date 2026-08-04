using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class SupportTicket
    {
        public string Id { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }

        [JsonPropertyName("tenant_type")]
        public string TenantType { get; set; }

        [JsonPropertyName("tenant_id")]
        public string TenantId { get; set; }

        [JsonPropertyName("created_by")]
        public string CreatedBy { get; set; }

        [JsonPropertyName("created_by_name")]
        public string CreatedByName { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public string UpdatedAt { get; set; }
    }

    public class TicketMessage
    {
        public string Id { get; set; }

        [JsonPropertyName("ticket_id")]
        public string TicketId { get; set; }

        [JsonPropertyName("sender_type")]
        public string SenderType { get; set; }

        [JsonPropertyName("sender_id")]
        public string SenderId { get; set; }

        [JsonPropertyName("sender_name")]
        public string SenderName { get; set; }

        public string Content { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }
    }

    public class SupportTicketListResponse
    {
        [JsonPropertyName("data")]
        public List<SupportTicket> Data { get; set; }

        public int Total { get; set; }
    }

    public class TicketMessageListResponse
    {
        [JsonPropertyName("data")]
        public List<TicketMessage> Data { get; set; }

        public int Total { get; set; }
    }
}
