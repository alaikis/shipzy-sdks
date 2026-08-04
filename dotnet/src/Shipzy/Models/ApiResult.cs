using System.Text.Json.Serialization;

namespace Shipzy.Sdk.Models
{
    public class ApiResult<T>
    {
        [JsonPropertyName("code")]
        public int Code { get; set; }

        [JsonPropertyName("data")]
        public T Data { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; }
    }
}
