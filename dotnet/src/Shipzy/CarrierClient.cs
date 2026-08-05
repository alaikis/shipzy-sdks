using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class CarrierClient : ShipzyHttpClient
    {
        public CarrierClient(ZymeupConfig config) : base(config) { }

        public async Task<ApiResult<Carrier[]>> ListAsync(int page = 1, int pageSize = 25, string state = null)
        {
            var q = BuildQuery(("page", page), ("page_size", pageSize), ("state", state));
            return await RequestAsync<ApiResult<Carrier[]>>($"/api/v1/carrier/list{q}");
        }

        public async Task<ApiResult<Carrier>> GetAsync(string id)
            => await RequestAsync<ApiResult<Carrier>>($"/api/v1/carrier/{Uri.EscapeDataString(id)}");

        public async Task<ApiResult<Carrier>> CreateAsync(object data)
            => await RequestAsync<ApiResult<Carrier>>("/api/v1/carrier", "POST", data);

        public async Task<ApiResult<Carrier>> UpdateAsync(string id, object data)
            => await RequestAsync<ApiResult<Carrier>>($"/api/v1/carrier/{Uri.EscapeDataString(id)}", "PUT", data);

        public async Task<ApiResult<object>> DeleteAsync(string id)
            => await RequestAsync<ApiResult<object>>($"/api/v1/carrier/{Uri.EscapeDataString(id)}", "DELETE");
    }
}
