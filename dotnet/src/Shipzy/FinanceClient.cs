using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class FinanceClient : ShipzyHttpClient
    {
        public FinanceClient(ZymeupConfig config) : base(config) { }

        public async Task<ApiResult<Invoice[]>> GetInvoicesAsync()
            => await RequestAsync<ApiResult<Invoice[]>>("/api/finance/invoices");

        public async Task<ApiResult<Subscription[]>> ListSubscriptionsAsync()
            => await RequestAsync<ApiResult<Subscription[]>>("/api/finance/subscriptions");

        public async Task<ApiResult<object>> CancelSubscriptionAsync(string id)
            => await RequestAsync<ApiResult<object>>($"/api/finance/subscriptions/{Uri.EscapeDataString(id)}/cancel", "POST");

        public async Task<ApiResult<object>> RestoreSubscriptionAsync(string id)
            => await RequestAsync<ApiResult<object>>($"/api/finance/subscriptions/{Uri.EscapeDataString(id)}/restore", "POST");

        public async Task<ApiResult<object>> DownloadInvoiceAsync(string id)
            => await RequestAsync<ApiResult<object>>($"/api/v1/merchant/invoices/{Uri.EscapeDataString(id)}/download");
    }
}
