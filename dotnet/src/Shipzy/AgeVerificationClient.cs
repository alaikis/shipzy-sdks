using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class AgeVerificationClient : ShipzyHttpClient
    {
        public AgeVerificationClient(ShipzyConfig config) : base(config) { }

        public async Task<ApiResult<AgeVerificationEvent>> CreateAsync(object data)
            => await RequestAsync<ApiResult<AgeVerificationEvent>>("/api/v1/age-verifications", "POST", data);

        public async Task<ApiResult<AgeVerificationListResponse>> ListByParcelAsync(string parcelId)
            => await RequestAsync<ApiResult<AgeVerificationListResponse>>($"/api/v1/age-verifications?parcel_id={Uri.EscapeDataString(parcelId)}");

        public async Task<ApiResult<AgeVerificationListResponse>> ListByOrderAsync(string orderId)
            => await RequestAsync<ApiResult<AgeVerificationListResponse>>($"/api/v1/age-verifications?order_id={Uri.EscapeDataString(orderId)}");
    }
}
