using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class NotificationClient : ShipzyHttpClient
    {
        public NotificationClient(ZymeupConfig config) : base(config) { }

        public async Task<ApiResult<NotificationResult>> SendEmailAsync(string to, string subject, string body)
            => await RequestAsync<ApiResult<NotificationResult>>("/api/v1/notifications/email", "POST", new { to, subject, body });

        public async Task<ApiResult<NotificationResult>> SendSmsAsync(string phone, string message)
            => await RequestAsync<ApiResult<NotificationResult>>("/api/v1/notifications/sms", "POST", new { phone, message });

        public async Task<ApiResult<NotificationResult>> SendWhatsAppAsync(string phone, string message)
            => await RequestAsync<ApiResult<NotificationResult>>("/api/v1/notifications/whatsapp", "POST", new { phone, message });

        public async Task<ApiResult<NotificationResult>> SendBulkAsync(object data)
            => await RequestAsync<ApiResult<NotificationResult>>("/api/v1/notifications/bulk", "POST", data);
    }
}
