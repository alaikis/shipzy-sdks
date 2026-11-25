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

        // Non-API scrape metadata (optional, backward compatible; omitted when absent).
        [JsonPropertyName("data_source")]
        public string DataSource { get; set; }

        [JsonPropertyName("last_scrape_at")]
        public string LastScrapeAt { get; set; }

        [JsonPropertyName("scrape_status")]
        public string ScrapeStatus { get; set; }

        [JsonPropertyName("raw_status_text")]
        public string RawStatusText { get; set; }
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

        // Non-API scrape metadata (optional, backward compatible; omitted when absent).
        [JsonPropertyName("data_source")]
        public string DataSource { get; set; }

        [JsonPropertyName("last_scrape_at")]
        public string LastScrapeAt { get; set; }

        [JsonPropertyName("scrape_status")]
        public string ScrapeStatus { get; set; }

        [JsonPropertyName("raw_status_text")]
        public string RawStatusText { get; set; }
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

        // Non-API scrape metadata (optional, backward compatible; omitted when absent).
        [JsonPropertyName("data_source")]
        public string DataSource { get; set; }

        [JsonPropertyName("last_scrape_at")]
        public string LastScrapeAt { get; set; }

        [JsonPropertyName("scrape_status")]
        public string ScrapeStatus { get; set; }

        [JsonPropertyName("raw_status_text")]
        public string RawStatusText { get; set; }

        // EU compliance — public view (Change: eu-tracking-compliance-integration; omitted when absent).
        // GDPR governance fields are NEVER present on the public endpoint.
        [JsonPropertyName("eu_compliance")]
        public TrackingEuCompliancePublic EuCompliance { get; set; }
    }

    /// <summary>
    /// EU compliance fields — public view (carbon + customs only).
    /// Change: eu-tracking-compliance-integration
    /// </summary>
    public class TrackingEuCompliancePublic
    {
        [JsonPropertyName("co2e_kg")]
        public double? Co2eKg { get; set; }

        [JsonPropertyName("co2e_methodology")]
        public string Co2eMethodology { get; set; } // glec | env_freight | carrier_reported | estimated

        [JsonPropertyName("co2e_calculated_at")]
        public string Co2eCalculatedAt { get; set; }

        [JsonPropertyName("co2e_source_provider")]
        public string Co2eSourceProvider { get; set; } // transporeon | carrier_reported | ship24 | platform

        [JsonPropertyName("customs_mrn")]
        public string CustomsMrn { get; set; }

        [JsonPropertyName("customs_eori")]
        public string CustomsEori { get; set; }

        [JsonPropertyName("transit_document_type")]
        public string TransitDocumentType { get; set; } // t1 | t2 | t2f | tir | none

        [JsonPropertyName("transit_document_ref")]
        public string TransitDocumentRef { get; set; }

        [JsonPropertyName("ens_declaration_ref")]
        public string EnsDeclarationRef { get; set; }
    }

    /// <summary>
    /// Order-level CO2e summary (GET /order/:id/co2e-summary).
    /// Change: eu-tracking-compliance-integration
    /// </summary>
    public class OrderCo2eSummary
    {
        [JsonPropertyName("order_id")]
        public string OrderId { get; set; }

        [JsonPropertyName("total_co2e_kg")]
        public double TotalCo2eKg { get; set; }

        [JsonPropertyName("by_methodology")]
        public Dictionary<string, int> ByMethodology { get; set; }

        [JsonPropertyName("coverage")]
        public OrderCo2eCoverage Coverage { get; set; }
    }

    public class OrderCo2eCoverage
    {
        [JsonPropertyName("with_value")]
        public int WithValue { get; set; }

        [JsonPropertyName("total")]
        public int Total { get; set; }
    }

    /// <summary>
    /// QTSP identity verification record (Change: base-full-process).
    /// The platform stores the verification reference only; raw identity data stays at the QTSP.
    /// </summary>
    public class IdentityVerification
    {
        [JsonPropertyName("verification_id")]
        public string VerificationId { get; set; }

        [JsonPropertyName("provider")]
        public string Provider { get; set; } // signicat_id | itsme | bankid | eu_digital_wallet(draft)

        [JsonPropertyName("method")]
        public string Method { get; set; } // eid | wallet | video | otp

        [JsonPropertyName("assurance_level")]
        public string AssuranceLevel { get; set; } // low | substantial | high

        [JsonPropertyName("signer_ref")]
        public string SignerRef { get; set; } // HMAC pseudonymous reference (irreversible)

        [JsonPropertyName("qtsp_verification_ref")]
        public string QtspVerificationRef { get; set; }

        [JsonPropertyName("verified_at")]
        public string VerifiedAt { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } // pending | verified | failed
    }

    /// <summary>
    /// Async QTSP identity verification session (redirect/QR).
    /// </summary>
    public class IdentityVerifySession
    {
        [JsonPropertyName("verification_id")]
        public string VerificationId { get; set; }

        [JsonPropertyName("redirect_url")]
        public string RedirectUrl { get; set; }

        [JsonPropertyName("qr_code_payload")]
        public string QrCodePayload { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("expires_at")]
        public string ExpiresAt { get; set; }
    }

    /// <summary>
    /// Platform self-hosted RFC3161 timestamp token.
    /// </summary>
    public class TSATimestamp
    {
        [JsonPropertyName("token")]
        public string Token { get; set; }

        [JsonPropertyName("time")]
        public string Time { get; set; }

        [JsonPropertyName("root_hash")]
        public string RootHash { get; set; }
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
