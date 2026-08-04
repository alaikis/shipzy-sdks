using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class SupportTicketClient : ShipzyHttpClient
    {
        public SupportTicketClient(ShipzyConfig config) : base(config) { }

        public async Task<ApiResult<SupportTicket>> CreateAsync(object data)
            => await RequestAsync<ApiResult<SupportTicket>>("/api/v1/shipment/support/tickets", "POST", data);

        public async Task<ApiResult<SupportTicketListResponse>> ListAsync(string status = null)
        {
            var q = status != null ? $"?status={Uri.EscapeDataString(status)}" : "";
            return await RequestAsync<ApiResult<SupportTicketListResponse>>($"/api/v1/shipment/support/tickets{q}");
        }

        public async Task<ApiResult<SupportTicket>> GetAsync(string id)
            => await RequestAsync<ApiResult<SupportTicket>>($"/api/v1/shipment/support/tickets/{id}");

        public async Task<ApiResult<TicketMessage>> AddMessageAsync(string ticketId, object data)
            => await RequestAsync<ApiResult<TicketMessage>>($"/api/v1/shipment/support/tickets/{ticketId}/messages", "POST", data);
    }
}
