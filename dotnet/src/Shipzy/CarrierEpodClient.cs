using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class CarrierEpodClient : ShipzyHttpClient
    {
        public CarrierEpodClient(ShipzyConfig config) : base(config) { }

        public async Task<ApiResult<EpodListResponse>> ListAsync(int page = 1, int pageSize = 25, string status = null)
        {
            var q = BuildQuery(("page", page), ("page_size", pageSize), ("status", status));
            return await RequestAsync<ApiResult<EpodListResponse>>($"/api/v1/carrier/epod/list{q}");
        }

        public async Task<ApiResult<EpodDetail>> GetAsync(string id)
            => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/carrier/epod/{id}");

        public async Task<ApiResult<EpodDetail>> DeliverAsync(string id, object data = null)
            => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/carrier/epod/{id}/delivery", "POST", data);

        public async Task<ApiResult<EpodDetail>> FailAsync(string id, string remark)
            => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/carrier/epod/{id}/fail", "POST", new { remark });

        public async Task<ApiResult<EpodDetail>> CaptureProofAsync(string id, object data)
            => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/carrier/epod/{id}/capture-proof", "POST", data);

        public async Task<ApiResult<EpodDetail>> UploadPhotoAsync(string id, string photoUrl)
            => await RequestAsync<ApiResult<EpodDetail>>($"/api/v1/carrier/epod/{id}/photo", "POST", new { photo_url = photoUrl });
    }
}
