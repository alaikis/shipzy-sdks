using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class EcmrClient : ShipzyHttpClient
    {
        public EcmrClient(ZymeupConfig config) : base(config) { }

        public async Task<ApiResult<EcmrListResponse>> ListAsync(int page = 1, int pageSize = 25)
        {
            var q = BuildQuery(("page", page), ("page_size", pageSize));
            return await RequestAsync<ApiResult<EcmrListResponse>>($"/api/v1/shipment/ecmr/list{q}");
        }

        public async Task<ApiResult<EcmrDetail>> GetAsync(string id)
            => await RequestAsync<ApiResult<EcmrDetail>>($"/api/v1/shipment/ecmr/{id}");

        public async Task<ApiResult<EcmrDetail>> CreateAsync(object data)
            => await RequestAsync<ApiResult<EcmrDetail>>("/api/v1/shipment/ecmr/create", "POST", data);

        public async Task<ApiResult<EcmrDetail>> GenerateFromOrderAsync(string orderId)
            => await RequestAsync<ApiResult<EcmrDetail>>("/api/v1/shipment/ecmr/generate-from-order", "POST", new { order_id = orderId });

        public async Task<ApiResult<EcmrDetail>> SignAsync(string id)
            => await RequestAsync<ApiResult<EcmrDetail>>($"/api/v1/shipment/ecmr/{id}/sign", "POST", new { });

        public async Task<ApiResult<EcmrDetail>> PdfAsync(string id)
            => await RequestAsync<ApiResult<EcmrDetail>>($"/api/v1/shipment/ecmr/{id}/pdf", "POST", new { });
    }
}
