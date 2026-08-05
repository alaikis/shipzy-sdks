using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class EpodClient : ShipzyHttpClient
    {
        public EpodClient(ZymeupConfig config) : base(config) { }

        public async Task<ApiResult<EpodListResponse>> ListAsync(
            int page = 1, int pageSize = 25, string status = null, string trackingNo = null)
        {
            var q = BuildQuery(
                ("page", page),
                ("page_size", pageSize),
                ("status", status),
                ("tracking_no", trackingNo)
            );
            return await RequestAsync<ApiResult<EpodListResponse>>($"/api/v1/shipment/epod/list{q}");
        }

        public async Task<ApiResult<EpodDetail>> GetAsync(string id)
            => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/shipment/epod/{id}");

        public async Task<ApiResult<EpodDetail>> CreateAsync(object data)
            => await RequestAsync<ApiResult<EpodDetail>>("/api/v1/shipment/epod/create", "POST", data);

        public async Task<ApiResult<EpodDetail>> GenerateFromOrderAsync(string orderId, object options = null)
            => await RequestAsync<ApiResult<EpodDetail>>("/api/v1/shipment/epod/generate-from-order", "POST", new { order_id = orderId, options });

        public async Task<ApiResult<EpodDetail>> UpdateAsync(string id, object data)
            => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/shipment/epod/{id}/update", "PUT", data);

        public async Task<ApiResult<EpodDetail>> DeliverAsync(string id, object data = null)
            => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/shipment/epod/{id}/delivery", "POST", data);

        public async Task<ApiResult<EpodDetail>> FailAsync(string id, string remark)
            => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/shipment/epod/{id}/fail", "POST", new { remark });

        public async Task<ApiResult<EpodDetail>> CaptureProofAsync(string id, object data)
            => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/shipment/epod/{id}/capture-proof", "POST", data);

        public async Task<ApiResult<EpodDetail>> VerifyAsync(string id)
            => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/shipment/epod/{id}/verify", "POST", new { });

        public async Task<ApiResult<SignUrlResponse>> GenerateSignUrlAsync(string id)
            => await RequestAsync<ApiResult<SignUrlResponse>>($"/api/v1/shipment/epod/{id}/sign", "POST", new { });

        public async Task<ApiResult<EpodDetail>> GeneratePdfAsync(string id)
            => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/shipment/epod/{id}/pdf", "POST", new { });
    }
}
