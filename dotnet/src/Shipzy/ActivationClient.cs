using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class ActivationClient : ShipzyHttpClient
    {
        public ActivationClient(ShipzyConfig config) : base(config) { }

        public async Task<ApiResult<ProviderListResponse>> ListProvidersAsync(string capability = null)
        {
            var q = capability != null ? $"?capability={Uri.EscapeDataString(capability)}" : "";
            return await RequestAsync<ApiResult<ProviderListResponse>>($"/api/v1/marketplace/providers{q}");
        }

        public async Task<ApiResult<Provider>> GetProviderAsync(string slug)
            => await RequestAsync<ApiResult<Provider>>($"/api/v1/marketplace/providers/{Uri.EscapeDataString(slug)}");

        public async Task<ApiResult<ActivationListResponse>> ListAsync()
            => await RequestAsync<ApiResult<ActivationListResponse>>("/api/v1/marketplace/activations");

        public async Task<ApiResult<ProviderActivation>> GetAsync(string id)
            => await RequestAsync<ApiResult<ProviderActivation>>($"/api/v1/marketplace/activations/{Uri.EscapeDataString(id)}");

        public async Task<ApiResult<ProviderActivation>> ActivateAsync(object data)
            => await RequestAsync<ApiResult<ProviderActivation>>("/api/v1/marketplace/activations", "POST", data);

        public async Task<ApiResult<object>> PauseAsync(string id)
            => await RequestAsync<ApiResult<object>>($"/api/v1/marketplace/activations/{Uri.EscapeDataString(id)}/pause", "POST", new { });

        public async Task<ApiResult<object>> ResumeAsync(string id)
            => await RequestAsync<ApiResult<object>>($"/api/v1/marketplace/activations/{Uri.EscapeDataString(id)}/resume", "POST", new { });

        public async Task<ApiResult<object>> RevokeAsync(string id, string reason = null)
            => await RequestAsync<ApiResult<object>>($"/api/v1/marketplace/activations/{Uri.EscapeDataString(id)}/revoke", "POST", new { reason = reason ?? "" });
    }
}
