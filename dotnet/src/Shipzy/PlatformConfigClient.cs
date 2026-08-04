using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class PlatformConfigClient : ShipzyHttpClient
    {
        public PlatformConfigClient(ShipzyConfig config) : base(config) { }

        public async Task<ApiResult<PlatformConfigListResponse>> ListAsync()
            => await RequestAsync<ApiResult<PlatformConfigListResponse>>("/api/v1/admin/configs");

        public async Task<ApiResult<PlatformConfig>> GetAsync(string key)
            => await RequestAsync<ApiResult<PlatformConfig>>($"/api/v1/admin/configs/{Uri.EscapeDataString(key)}");

        public async Task<ApiResult<object>> UpdateAsync(string key, object data)
            => await RequestAsync<ApiResult<object>>($"/api/v1/admin/configs/{Uri.EscapeDataString(key)}", "PUT", data);
    }
}
