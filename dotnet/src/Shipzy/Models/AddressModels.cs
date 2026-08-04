using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class AddressItem
    {
        public string Id { get; set; }

        [JsonPropertyName("full_name")]
        public string FullName { get; set; }

        [JsonPropertyName("company_name")]
        public string CompanyName { get; set; }

        public string Street { get; set; }

        [JsonPropertyName("house_number")]
        public string HouseNumber { get; set; }

        [JsonPropertyName("postal_code")]
        public string PostalCode { get; set; }

        public string City { get; set; }

        [JsonPropertyName("country_code")]
        public string CountryCode { get; set; }

        public string Phone { get; set; }
        public string Email { get; set; }

        [JsonPropertyName("is_default")]
        public bool IsDefault { get; set; }
    }

    public class AddressListResponse
    {
        [JsonPropertyName("data")]
        public List<AddressItem> Data { get; set; }

        public int Total { get; set; }
    }
}
