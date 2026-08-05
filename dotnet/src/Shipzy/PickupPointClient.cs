using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class PickupPointClient : ShipzyHttpClient
    {
        public PickupPointClient(ZymeupConfig config) : base(config) { }

        public async Task<ApiResult<PickupPointListResponse>> ListAsync(bool activeOnly = true)
        {
            var q = activeOnly ? "" : "?active_only=false";
            return await RequestAsync<ApiResult<PickupPointListResponse>>($"/api/v1/admin/pickup-points/{q}");
        }

        public async Task<ApiResult<PickupPoint>> GetAsync(string id)
            => await RequestAsync<ApiResult<PickupPoint>>($"/api/v1/admin/pickup-points/{id}");

        public async Task<ApiResult<PickupPoint>> CreateAsync(object data)
            => await RequestAsync<ApiResult<PickupPoint>>("/api/v1/admin/pickup-points/", "POST", data);

        public async Task<ApiResult<object>> UpdateAsync(string id, object data)
            => await RequestAsync<ApiResult<object>>($"/api/v1/admin/pickup-points/{id}", "PUT", data);

        public async Task<ApiResult<object>> DeactivateAsync(string id)
            => await RequestAsync<ApiResult<object>>($"/api/v1/admin/pickup-points/{id}/deactivate", "POST", new { });
    }
}
