using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class OrderClient : ShipzyHttpClient
    {
        public OrderClient(ZymeupConfig config) : base(config) { }

        public async Task<ApiResult<OrderListResponse>> ListAsync(int page = 1, int pageSize = 25, string status = null)
        {
            var q = BuildQuery(
                ("page", page),
                ("page_size", pageSize),
                ("status", status)
            );
            return await RequestAsync<ApiResult<OrderListResponse>>($"/api/v1/order/list{q}");
        }

        public async Task<ApiResult<OrderDetail>> GetAsync(string id)
            => await RequestAsync<ApiResult<OrderDetail>>($"/api/v1/order/{id}");

        public async Task<ApiResult<OrderDetail>> CreateAsync(object data)
            => await RequestAsync<ApiResult<OrderDetail>>("/api/v1/order/create", "POST", data);

        public async Task<ApiResult<OrderDetail>> CreateWithDocumentsAsync(object data)
            => await RequestAsync<ApiResult<OrderDetail>>("/api/v1/order/create-with-documents", "POST", data);

        public async Task<ApiResult<OrderDetail>> UpdateAsync(string id, object data)
            => await RequestAsync<ApiResult<OrderDetail>>($"/api/v1/order/{id}/update", "POST", data);

        public async Task<ApiResult<OrderDetail>> CancelAsync(string id)
            => await RequestAsync<ApiResult<OrderDetail>>($"/api/v1/order/{id}/cancel", "POST", new { });
    }
}
