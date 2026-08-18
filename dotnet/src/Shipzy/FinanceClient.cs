using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class FinanceClient : ShipzyHttpClient
    {
        public FinanceClient(ZymeupConfig config) : base(config) { }

        public async Task<ApiResult<Invoice[]>> GetInvoicesAsync()
            => await RequestAsync<ApiResult<Invoice[]>>("/api/v1/invoices");

        public async Task<ApiResult<Subscription[]>> ListSubscriptionsAsync()
            => await RequestAsync<ApiResult<Subscription[]>>("/api/v1/subscriptions");

        public async Task<ApiResult<object>> CancelSubscriptionAsync(string id)
            => await RequestAsync<ApiResult<object>>($"/api/v1/subscriptions/{Uri.EscapeDataString(id)}/cancel", "POST");

        public async Task<ApiResult<object>> RestoreSubscriptionAsync(string id)
            => await RequestAsync<ApiResult<object>>($"/api/v1/subscriptions/{Uri.EscapeDataString(id)}/restore", "POST");

        public async Task<ApiResult<object>> DownloadInvoiceAsync(string id)
            => await RequestAsync<ApiResult<object>>($"/api/v1/invoices/{Uri.EscapeDataString(id)}/download");
    }
}