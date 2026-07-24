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

    public class ShipzyException : Exception
    {
        public int StatusCode { get; }
        public ShipzyException(string message, int statusCode) : base(message) { StatusCode = statusCode; }
    }

    public class ShipzyAuthException : ShipzyException
    {
        public ShipzyAuthException(string message) : base(message, 401) { }
    }

    public class ApiResult<T>
    {
        public int Code { get; set; }
        public T Data { get; set; }
        public string Message { get; set; }
    }

    public class EpodListItem
    {
        public string Id { get; set; }
        [JsonPropertyName("tracking_no")] public string TrackingNo { get; set; }
        public string Status { get; set; }
        [JsonPropertyName("recipient_name")] public string RecipientName { get; set; }
        [JsonPropertyName("created_at")] public string CreatedAt { get; set; }
    }

    public class EpodListResponse
    {
        public List<EpodListItem> Data { get; set; }
        public int Total { get; set; }
        public int Page { get; set; }
        [JsonPropertyName("page_size")] public int PageSize { get; set; }
    }

    public class EpodDetail
    {
        public string Id { get; set; }
        [JsonPropertyName("tracking_no")] public string TrackingNo { get; set; }
        public String Status { get; set; }
        [JsonPropertyName("recipient_name")] public string RecipientName { get; set; }
        [JsonPropertyName("recipient_phone")] public string RecipientPhone { get; set; }
        [JsonPropertyName("created_at")] public string CreatedAt { get; set; }
        [JsonPropertyName("updated_at")] public string UpdatedAt { get; set; }
        [JsonPropertyName("sign_url")] public string SignUrl { get; set; }
        [JsonPropertyName("evidence_hash")] public string EvidenceHash { get; set; }
    }

    public class SignUrlResponse
    {
        [JsonPropertyName("sign_url")] public string SignUrl { get; set; }
    }

    public class OrderListItem
    {
        public string Id { get; set; }
        [JsonPropertyName("order_no")] public string OrderNo { get; set; }
        public string Status { get; set; }
        [JsonPropertyName("customer_name")] public string CustomerName { get; set; }
        [JsonPropertyName("total_amount")] public decimal? TotalAmount { get; set; }
        public string Currency { get; set; }
        [JsonPropertyName("created_at")] public string CreatedAt { get; set; }
    }

    public class OrderListResponse
    {
        public List<OrderListItem> Data { get; set; }
        public int Total { get; set; }
        public int Page { get; set; }
        [JsonPropertyName("page_size")] public int PageSize { get; set; }
    }

    public class AddressItem
    {
        public string Id { get; set; }
        [JsonPropertyName("full_name")] public string FullName { get; set; }
        public string Street { get; set; }
        [JsonPropertyName("house_number")] public string HouseNumber { get; set; }
        [JsonPropertyName("postal_code")] public string PostalCode { get; set; }
        public string City { get; set; }
        [JsonPropertyName("country_code")] public string CountryCode { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        [JsonPropertyName("is_default")] public bool IsDefault { get; set; }
    }

    public class AddressListResponse
    {
        public List<AddressItem> Data { get; set; }
        public int Total { get; set; }
    }

    public class EpodClient
    {
        private readonly HttpClient _http;
        private readonly ShipzyConfig _config;
        public EpodClient(ShipzyConfig config) { _config = config; _http = new HttpClient { Timeout = TimeSpan.FromSeconds(config.TimeoutSeconds), BaseAddress = new Uri(config.BaseUrl.TrimEnd('/')) }; }
        public void SetToken(string token) { _config.Token = token; }
        private async Task<T>> RequestAsync<T>(string path, string method = "GET", object body = null) { var req = new HttpRequestMessage(new HttpMethod(method), path); req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _config.Token); if (body != null) req.Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"); var resp = await _http.SendAsync(req); var content = await resp.Content.ReadAsStringAsync(); if (resp.StatusCode == System.Net.HttpStatusCode.Unauthorized) throw new ShipzyAuthException("Unauthorized"); if (!resp.IsSuccessStatusCode) throw new ShipzyException($"HTTP {(int)resp.StatusCode}: {content}", (int)resp.StatusCode); return JsonSerializer.Deserialize<T>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }); }
        public async Task<ApiResult<EpodListResponse>> ListAsync(int page = 1, int pageSize = 25, string status = null, string trackingNo = null) { var q = $"?page={page}&page_size={pageSize}"; if (status != null) q += $"&status={Uri.EscapeDataString(status)}"; if (trackingNo != null) q += $"&tracking_no={Uri.EscapeDataString(trackingNo)}"; return await RequestAsync<ApiResult<EpodListResponse>>($"/api/v1/shipment/epod/list{q}"); }
        public async Task<ApiResult<EpodDetail>> GetAsync(string id) => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/shipment/epod/{id}");
        public async Task<ApiResult<EpodDetail>> CreateAsync(object data) => await RequestAsync<ApiResult<EpodDetail>>("/api/v1/shipment/epod/create", "POST", data);
        public async Task<ApiResult<EpodDetail>> GenerateFromAsync(string orderId, object options = null) => await RequestAsync<ApiResult<EpodDetail>>("/api/v1/shipment/epod/generate-from-order", "POST", new { order_id = orderId, options });
        public async Task<ApiResult<EpodDetail>> UpdateAsync(string id, object data) => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/shipment/epod/{id}/update", "PUT", data);
        public async Task<ApiResult<EpodDetail>> DeliverAsync(string id, object data = null) => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/shipment/epod/{id}/delivery", "POST", data);
        public async Task<ApiResult<EpodDetail>> FailAsync(string id, string remark) => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/shipment/epod/{id}/fail", "POST", new { remark });
        public async Task<ApiResult<SignUrlResponse>> GenerateSignUrlAsync(string id) => await RequestAsync<ApiResult<SignUrlResponse>>($"/api/v1/shipment/epod/{id}/sign", "POST");
    }

    public class OrderClient
    {
        private readonly HttpClient _http; private readonly ShipzyConfig _config;
        public OrderClient(ShipzyConfig c) { _config = c; _http = new HttpClient { Timeout = TimeSpan.FromSeconds(c.TimeoutSeconds), BaseAddress = new Uri(c.BaseUrl.TrimEnd('/')) }; }
        public void SetToken(string t) { _config.Token = t; }
        private async Task<T>> Request<T>(string p, string m = "GET", object b = null) { var r = new HttpRequestMessage(new HttpMethod(m), p); r.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _config.Token); if (b != null) r.Content = new StringContent(JsonSerializer.Serialize(b), Encoding.UTF8, "application/json"); var resp = await _http.SendAsync(r); if (resp.StatusCode == System.Net.HttpStatusCode.Unauthorized) throw new ShipzyAuthException("Unauthorized"); if (!resp.IsSuccessStatusCode) throw new ShipzyException($"HTTP {(int)resp.StatusCode}", (int)resp.StatusCode); return JsonSerializer.Deserialize<T>(await resp.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true }); }
        public async Task<ApiResult<OrderListResponse>> ListAsync(int p = 1, int ps = 25, string s = null) => await Request<ApiResult<OrderListResponse>>($"/api/v1/order/list?page={p}&page_size={ps}{(s != null ? $"&status={Uri.EscapeDataString(s)}" : "")}");
        public async Task<ApiResult<object>> GetAsync(string id) => await Request<ApiResult<object>>($"/api/v1/order/{id}");
        public async Task<ApiResult<object>> CreateAsync(object d) => await Request<ApiResult<object>>("/api/v1/order/create", "POST", d);
        public async Task<ApiResult<object>> UpdateAsync(string id, object d) => await Request<ApiResult<object>>($"/api/v1/order/{id}/update", "POST", d);
        public async Task<ApiResult<object>> CancelAsync(string id) => await Request<ApiResult<object>>($"/api/v1/order/{id}/cancel", "POST");
    }

    public class AddressClient
    {
        private readonly HttpClient _http; private readonly ShipzyConfig _config;
        public AddressClient(ShipzyConfig c) { _config = c; _http = new HttpClient { Timeout = TimeSpan.FromSeconds(c.TimeoutSeconds), BaseAddress = new Uri(c.BaseUrl.TrimEnd('/')) }; }
        public void SetToken(string t) { _config.Token = t; }
        private async Task<T>> Request<T>(string p, string m = "POST", object b = null) { var r = new HttpRequestMessage(new HttpMethod(m), p); r.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _config.Token); if (b != null) r.Content = new StringContent(JsonSerializer.Serialize(b), Encoding.UTF8, "application/json"); var resp = await _http.SendAsync(r); if (resp.StatusCode == System.Net.HttpStatusCode.Unauthorized) throw new ShipzyAuthException("Unauthorized"); if (!resp.IsSuccessStatusCode) throw new ShipzyException($"HTTP {(int)resp.StatusCode}", (int)resp.StatusCode); return JsonSerializer.Deserialize<T>(await resp.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true }); }
        public async Task<ApiResult<AddressListResponse>> ListAsync(object p = null) => await Request<ApiResult<AddressListResponse>>("/api/v1/merchant/addresses/list", "POST", p);
        public async Task<ApiResult<AddressItem>> CreateAsync(object d) => await Request<ApiResult<AddressItem>>("/api/v1/merchant/addresses/create", "POST", d);
        public async Task<ApiResult<AddressItem>> UpdateAsync(string id, object d) => await Request<ApiResult<AddressItem>>($"/api/v1/merchant/addresses/{id}/update", "POST", d);
        public async Task<ApiResult<object>> DeleteAsync(string id) => await Request<ApiResult<object>>($"/api/v1/merchant/addresses/{id}/delete", "POST");
    }

    public class CarrierEpodClient
    {
        private readonly HttpClient _http; private readonly ShipzyConfig _config;
        public CarrierEpodClient(ShipzyConfig c) { _config = c; _http = new HttpClient { Timeout = TimeSpan.FromSeconds(c.TimeoutSeconds), BaseAddress = new Uri(c.BaseUrl.TrimEnd('/')) }; }
        public void SetToken(string t) { _config.Token = t; }
        private async Task<T>> Request<T>(string p, string m = "GET", object b = null) { var r = new HttpRequestMessage(new HttpMethod(m), p); r.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _config.Token); if (b != null) r.Content = new StringContent(JsonSerializer.Serialize(b), Encoding.UTF8, "application/json"); var resp = await _http.SendAsync(r); if (resp.StatusCode == System.Net.HttpStatusCode.Unauthorized) throw new ShipzyAuthException("Unauthorized"); if (!resp.IsSuccessStatusCode) throw new ShipzyException($"HTTP {(int)resp.StatusCode}", (int)resp.StatusCode); return JsonSerializer.Deserialize<T>(await resp.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true }); }
        public async Task<ApiResult<EpodListResponse>> ListAsync(int p = 1, int ps = 25, string s = null) => await Request<ApiResult<EpodListResponse>>($"/api/v1/carrier/epod/list?page={p}&page_size={ps}{(s != null ? $"&status={Uri.EscapeDataString(s)}" : "")}");
        public async Task<ApiResult<EpodDetail>> GetAsync(string id) => await Request<ApiResult<ApiResult<EpodDetail>>>($"/api/v1/carrier/epod/{id}");
        public async Task<ApiResult<EpodDetail>> DeliverAsync(string id, object d = null) => await Request<ApiResult<EpodDetail>>($"/api/v1/carrier/epod/{id}/delivery", "POST", d);
        public async Task<ApiResult<EpodDetail>> FailAsync(string id, string remark) => await Request<ApiResult<EpodDetail>>($"/api/v1/carrier/epod/{id}/fail", "POST", new { remark });
    }

    public class ShipzyClient
    {
        public EpodClient Epod; public OrderClient Order; public AddressClient Address; public CarrierEpodClient CarrierEpod;
        public ShipzyClient(ShipzyConfig c) { Epod = new EpodClient(c); Order = new OrderClient(c); Address = new AddressClient(c); CarrierEpod = new CarrierEpodClient(c); }
        public void UpdateToken(string t) { Epod.SetToken(t); Order.SetToken(t); Address.SetToken(t); CarrierEpod.SetToken(t); }
    }
}
