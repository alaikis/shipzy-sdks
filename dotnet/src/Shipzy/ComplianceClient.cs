using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class ComplianceClient : ShipzyHttpClient
    {
        public ComplianceClient(ZymeupConfig config) : base(config) { }

        public async Task<ApiResult<object>> CreateCustomsAsync(object data)
            => await RequestAsync<ApiResult<object>>("/api/v1/compliance/customs", "POST", data);

        public async Task<ApiResult<object>> GetCustomsAsync(string id)
            => await RequestAsync<ApiResult<object>>($"/api/v1/compliance/customs/{System.Uri.EscapeDataString(id)}");

        public async Task<ApiResult<object>> CheckAsync(object data)
            => await RequestAsync<ApiResult<object>>("/api/v1/compliance/check", "POST", data);

        public async Task<ApiResult<object>> GetCountryRequirementsAsync(string countryCode)
            => await RequestAsync<ApiResult<object>>($"/api/v1/compliance/requirements/{System.Uri.EscapeDataString(countryCode)}");

        public async Task<ApiResult<object>> ValidateHsCodeAsync(string hsCode)
            => await RequestAsync<ApiResult<object>>($"/api/v1/compliance/hscode/{System.Uri.EscapeDataString(hsCode)}/validate");

        public async Task<ApiResult<object>> GetProhibitedItemsAsync()
            => await RequestAsync<ApiResult<object>>("/api/v1/compliance/prohibited");
    }
}
