using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class NotificationResult
    {
        public string Channel { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public string Url { get; set; }
        public string Error { get; set; }
    }
}
