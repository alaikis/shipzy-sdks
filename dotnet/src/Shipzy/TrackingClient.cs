using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class TrackingClient : ShipzyHttpClient
    {
        public TrackingClient(ZymeupConfig config) : base(config) { }

        public async Task<ApiResult<TrackingDetail>> DetailAsync(string trackingNo)
            => await RequestAsync<ApiResult<TrackingDetail>>($"/api/v1/tracking/{Uri.EscapeDataString(trackingNo)}");

        public async Task<ApiResult<TrackingListResponse>> ListAsync(int page = 1, int pageSize = 25, string status = null, string trackingNo = null)
        {
            var basePath = _config.Role == UserRole.Carrier
                ? "/api/v1/carrier/tracking/list"
                : "/api/v1/merchant/tracking/list";

            var q = BuildQuery(
                ("page", page),
                ("page_size", pageSize),
                ("status", status),
                ("tracking_no", trackingNo)
            );
            return await RequestAsync<ApiResult<TrackingListResponse>>($"{basePath}{q}");
        }
    }
}
