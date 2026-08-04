using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class ProductClient : ShipzyHttpClient
    {
        public ProductClient(ShipzyConfig config) : base(config) { }

        public async Task<ApiResult<ProductListResponse>> ListAsync(
            string status = null, string category = null, string search = null, bool? activeOnly = null)
        {
            var q = BuildQuery(
                ("status", status),
                ("category", category),
                ("search", search),
                ("active_only", activeOnly.HasValue ? activeOnly.Value.ToString().ToLower() : null)
            );
            return await RequestAsync<ApiResult<ProductListResponse>>($"/api/v1/products{q}");
        }

        public async Task<ApiResult<Product>> GetAsync(string id)
            => await RequestAsync<ApiResult<Product>>($"/api/v1/products/{Uri.EscapeDataString(id)}");

        public async Task<ApiResult<Product>> CreateAsync(object data)
            => await RequestAsync<ApiResult<Product>>("/api/v1/products", "POST", data);

        public async Task<ApiResult<object>> UpdateAsync(string id, object data)
            => await RequestAsync<ApiResult<object>>($"/api/v1/products/{Uri.EscapeDataString(id)}", "PUT", data);

        public async Task<ApiResult<object>> RetireAsync(string id)
            => await RequestAsync<ApiResult<object>>($"/api/v1/products/{Uri.EscapeDataString(id)}/retire", "POST", new { });
    }
}
