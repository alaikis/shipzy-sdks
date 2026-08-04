using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class Invoice
    {
        public string Id { get; set; }

        [JsonPropertyName("invoice_number")]
        public string InvoiceNumber { get; set; }

        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }

        [JsonPropertyName("paid_at")]
        public string PaidAt { get; set; }

        [JsonPropertyName("download_url")]
        public string DownloadUrl { get; set; }
    }

    public class Subscription
    {
        public string Id { get; set; }
        public string Status { get; set; }
        public string Plan { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }

        [JsonPropertyName("start_date")]
        public string StartDate { get; set; }

        [JsonPropertyName("next_billing_date")]
        public string NextBillingDate { get; set; }

        [JsonPropertyName("cancel_at_period_end")]
        public bool CancelAtPeriodEnd { get; set; }

        [JsonPropertyName("created_at")]
        public string CreatedAt { get; set; }
    }
}
