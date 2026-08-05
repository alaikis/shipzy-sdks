using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class MerchantAddressClient : ShipzyHttpClient
    {
        public MerchantAddressClient(ZymeupConfig config) : base(config) { }

        public async Task<ApiResult<AddressListResponse>> ListAsync(object filter = null)
            => await RequestAsync<ApiResult<AddressListResponse>>("/api/v1/merchant/addresses/list", "POST", filter);

        public async Task<ApiResult<AddressItem>> CreateAsync(object data)
            => await RequestAsync<ApiResult<AddressItem>>("/api/v1/merchant/addresses/create", "POST", data);

        public async Task<ApiResult<AddressItem>> UpdateAsync(string id, object data)
            => await RequestAsync<ApiResult<AddressItem>>($"/api/v1/merchant/addresses/{id}/update", "POST", data);

        public async Task<ApiResult<object>> DeleteAsync(string id)
            => await RequestAsync<ApiResult<object>>($"/api/v1/merchant/addresses/{id}/delete", "POST", new { });

        public async Task<ApiResult<AddressItem>> SetDefaultAsync(string id)
            => await RequestAsync<ApiResult<AddressItem>>($"/api/v1/merchant/addresses/{id}/set-default", "POST", new { });
    }
}
