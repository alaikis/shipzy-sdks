using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class UploadClient : ShipzyHttpClient
    {
        public UploadClient(ZymeupConfig config) : base(config) { }

        public async Task<ApiResult<object>> UploadFileAsync(string endpoint, byte[] fileBytes, string fileName)
        {
            var multipart = new MultipartFormDataContent();
            var stream = new MemoryStream(fileBytes);
            var streamContent = new StreamContent(stream);
            streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            multipart.Add(streamContent, "file", fileName);

            var req = new HttpRequestMessage(HttpMethod.Post, endpoint)
            {
                Content = multipart
            };

            if (!string.IsNullOrEmpty(_config.Token))
                req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetAuthHeader());

            var resp = await _http.SendAsync(req);
            var content = await resp.Content.ReadAsStringAsync();

            if (resp.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                throw new ShipzyAuthException("Unauthorized");

            if (!resp.IsSuccessStatusCode)
                throw new ShipzyException($"HTTP {(int)resp.StatusCode}: {content}", (int)resp.StatusCode);

            return System.Text.Json.JsonSerializer.Deserialize<ApiResult<object>>(content, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<ApiResult<object>> BrandingUploadLogoAsync(byte[] fileBytes, string fileName = "logo.png")
            => await UploadFileAsync("/api/v1/merchant/branding/logo", fileBytes, fileName);
    }
}
