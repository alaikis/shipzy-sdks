using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class ShipzyHttpClient
    {
        protected readonly HttpClient _http;
        protected readonly ZymeupConfig _config;

        private static readonly JsonSerializerOptions s_jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public ShipzyHttpClient(ZymeupConfig config)
        {
            _config = config;
            _http = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(config.TimeoutSeconds),
                BaseAddress = new Uri(config.BaseUrl.TrimEnd('/'))
            };
        }

        public void SetToken(string token)
        {
            _config.Token = token;
        }

        public void SetConfig(ZymeupConfig config)
        {
            _config.BaseUrl = config.BaseUrl;
            _config.Token = config.Token;
            _config.TimeoutSeconds = config.TimeoutSeconds;
            _config.Role = config.Role;
            _config.CarrierCode = config.CarrierCode;
        }

        protected string GetAuthHeader()
        {
            if (_config.Role == UserRole.Carrier && !string.IsNullOrEmpty(_config.CarrierCode) && !string.IsNullOrEmpty(_config.Token))
                return $"{_config.CarrierCode}:{_config.Token}";
            return _config.Token;
        }

        protected async Task<T> RequestAsync<T>(string path, string method = "GET", object body = null)
        {
            var req = new HttpRequestMessage(new HttpMethod(method), path);

            if (!string.IsNullOrEmpty(_config.Token))
            {
                req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetAuthHeader());
            }

            if (body != null)
            {
                req.Content = new StringContent(
                    JsonSerializer.Serialize(body, s_jsonOptions),
                    Encoding.UTF8,
                    "application/json"
                );
            }

            var resp = await _http.SendAsync(req);
            var content = await resp.Content.ReadAsStringAsync();

            if (resp.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                throw new ShipzyAuthException("Unauthorized");

            if (!resp.IsSuccessStatusCode)
                throw new ShipzyException($"HTTP {(int)resp.StatusCode}: {content}", (int)resp.StatusCode);

            return JsonSerializer.Deserialize<T>(content, s_jsonOptions);
        }

        protected string BuildQuery(params (string key, object value)[] parameters)
        {
            var parts = new System.Collections.Generic.List<string>();
            foreach (var (key, value) in parameters)
            {
                if (value != null)
                    parts.Add($"{Uri.EscapeDataString(key)}={Uri.EscapeDataString(value.ToString())}");
            }
            return parts.Count > 0 ? "?" + string.Join("&", parts) : "";
        }
    }
}
