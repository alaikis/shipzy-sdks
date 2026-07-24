using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Shipzy.Sdk
{
    public class ShipzyConfig
    {
        public string BaseUrl { get; set; } = "https://api.shipzy.me";
        public string Token { get; set; }
        public int TimeoutSeconds { get; set; } = 30;
    }

    public class EpodListItem
    {
        public string Id { get; set; }
        public string TrackingNo { get; set; }
        public string Status { get; set; }
        public string RecipientName { get; set; }
        public string CreatedAt { get; set; }
    }

    public class EpodListResponse
    {
        public List<EpodListItem> Data { get; set; }
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }

    public class EpodDetail
    {
        public string Id { get; set; }
        public string TrackingNo { get; set; }
        public string Status { get; set; }
        public string RecipientName { get; set; }
        public string RecipientPhone { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public string SignUrl { get; set; }
        public string EvidenceHash { get; set; }
    }

    public class SignUrlResponse
    {
        public string SignUrl { get; set; }
    }

    public class ShipzyException : Exception
    {
        public int StatusCode { get; }
        public ShipzyException(string message, int statusCode) : base(message) { StatusCode = statusCode; }
    }

    public class ShipzyAuthException : ShipzyException
    {
        public ShipzyAuthException(string message) : base(message, 401) { }
    }

    public class EpodClient
    {
        private readonly HttpClient _httpClient;
        private readonly ShipzyConfig _config;

        public EpodClient(ShipzyConfig config)
        {
            _config = config;
            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(config.TimeoutSeconds),
                BaseAddress = new Uri(config.BaseUrl.TrimEnd('/'))
            };
        }

        public void SetToken(string token)
        {
            _config.Token = token;
        }

        private async Task<T> RequestAsync<T>(string path, string method = "GET", object body = null)
        {
            var request = new HttpRequestMessage(new HttpMethod(method), path);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _config.Token);

            if (body != null)
            {
                var json = JsonSerializer.Serialize(body);
                request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            }

            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                    throw new ShipzyAuthException("Unauthorized");
                throw new ShipzyException($"HTTP {(int)response.StatusCode}: {content}", (int)response.StatusCode);
            }

            return JsonSerializer.Deserialize<T>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        public async Task<EpodListResponse> ListAsync(int page = 1, int pageSize = 25, string status = null, string trackingNo = null)
        {
            var query = $"?page={page}&page_size={pageSize}";
            if (!string.IsNullOrEmpty(status)) query += $"&status={Uri.EscapeDataString(status)}";
            if (!string.IsNullOrEmpty(trackingNo)) query += $"&tracking_no={Uri.EscapeDataString(trackingNo)}";
            return await RequestAsync<EpodListResponse>($"/api/v1/shipment/epod/list{query}");
        }

        public async Task<EpodDetail> GetAsync(string epodId)
        {
            return await RequestAsync<EpodDetail>($"/api/v1/shipment/epod/{epodId}");
        }

        public async Task<SignUrlResponse> GenerateSignUrlAsync(string epodId)
        {
            return await RequestAsync<SignUrlResponse>($"/api/v1/shipment/epod/{epodId}/sign", "POST");
        }
    }
}
