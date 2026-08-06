using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class CpscClient : ShipzyHttpClient
    {
        public CpscClient(ZymeupConfig config) : base(config) { }

        public async Task<ApiResult<object>> GetCollectionsAsync()
            => await RequestAsync<ApiResult<object>>("/api/v1/cpsc/collections");

        public async Task<ApiResult<object>> GetCredentialAsync()
            => await RequestAsync<ApiResult<object>>("/api/v1/cpsc/credential");

        public async Task<ApiResult<object>> SaveCredentialAsync(object data)
            => await RequestAsync<ApiResult<object>>("/api/v1/cpsc/credential", "POST", data);

        public async Task<ApiResult<object>> ImportAsync(object data)
            => await RequestAsync<ApiResult<object>>("/api/v1/cpsc/import", "POST", data);

        public async Task<ApiResult<object>> GetImportStatusAsync(string importId)
            => await RequestAsync<ApiResult<object>>($"/api/v1/cpsc/import/{System.Uri.EscapeDataString(importId)}/status");

        public async Task<ApiResult<object>> GetImportLogAsync(string importId, bool errorsOnly = false)
        {
            var q = BuildQuery(("errorsOnly", errorsOnly));
            return await RequestAsync<ApiResult<object>>($"/api/v1/cpsc/import/{System.Uri.EscapeDataString(importId)}/log{q}");
        }

        public async Task<ApiResult<object>> ExportAsync(object filter)
        {
            var q = System.Text.Json.JsonSerializer.Serialize(filter);
            var parts = new System.Collections.Generic.List<string>();
            if (filter is System.Collections.Generic.Dictionary<string, object> dict)
            {
                foreach (var (k, v) in dict)
                    if (v != null) parts.Add($"{System.Uri.EscapeDataString(k)}={System.Uri.EscapeDataString(v.ToString())}");
            }
            var qs = parts.Count > 0 ? "?" + string.Join("&", parts) : "";
            return await RequestAsync<ApiResult<object>>($"/api/v1/cpsc/export{qs}");
        }

        public async Task<ApiResult<object>> ExportAsyncAsync(object filter)
        {
            var parts = new System.Collections.Generic.List<string>();
            if (filter is System.Collections.Generic.Dictionary<string, object> dict)
            {
                foreach (var (k, v) in dict)
                    if (v != null) parts.Add($"{System.Uri.EscapeDataString(k)}={System.Uri.EscapeDataString(v.ToString())}");
            }
            var qs = parts.Count > 0 ? "?" + string.Join("&", parts) : "";
            return await RequestAsync<ApiResult<object>>($"/api/v1/cpsc/export-async{qs}");
        }

        public async Task<ApiResult<object>> GetExportAsyncStatusAsync(string exportId)
            => await RequestAsync<ApiResult<object>>($"/api/v1/cpsc/export-async/{System.Uri.EscapeDataString(exportId)}/status");

        public async Task<ApiResult<object>> GetExportAsyncDataAsync(string exportId)
            => await RequestAsync<ApiResult<object>>($"/api/v1/cpsc/export-async/{System.Uri.EscapeDataString(exportId)}/data");

        public async Task<ApiResult<object>> GetCertificatesAsync(object data)
            => await RequestAsync<ApiResult<object>>("/api/v1/cpsc/certificates", "POST", data);

        public async Task<ApiResult<object>> GetTradePartiesAsync(string partyType = null)
        {
            var q = string.IsNullOrEmpty(partyType) ? "" : BuildQuery(("tradePartyType", partyType));
            return await RequestAsync<ApiResult<object>>($"/api/v1/cpsc/trade-parties{q}");
        }

        public async Task<ApiResult<object>> GetTokenExpirationAsync()
            => await RequestAsync<ApiResult<object>>("/api/v1/cpsc/token-expiration");
    }
}
