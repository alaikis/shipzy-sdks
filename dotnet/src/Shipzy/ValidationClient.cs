using System.Threading.Tasks;
using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class ValidationClient : ShipzyHttpClient
    {
        public ValidationClient(ZymeupConfig config) : base(config) { }

        public async Task<ApiResult<PhoneVerifyResult>> VerifyPhoneAsync(string countryCode, string phone)
            => await RequestAsync<ApiResult<PhoneVerifyResult>>("/api/v1/validation/phone", "POST", new { country_code = countryCode, phone });

        public async Task<ApiResult<PhoneFormatResult>> FormatPhoneAsync(string countryCode, string phone)
            => await RequestAsync<ApiResult<PhoneFormatResult>>("/api/v1/validation/phone/format", "POST", new { country_code = countryCode, phone });

        public async Task<ApiResult<PostalCodeResult>> ValidatePostalCodeAsync(string countryCode, string code)
            => await RequestAsync<ApiResult<PostalCodeResult>>("/api/v1/validation/postal-code", "POST", new { country_code = countryCode, code });

        public async Task<ApiResult<EmailValidationResult>> ValidateEmailAsync(string email)
            => await RequestAsync<ApiResult<EmailValidationResult>>("/api/v1/validation/email", "POST", new { email });

        public async Task<ApiResult<TaxIdValidationResult>> ValidateTaxIdAsync(string countryCode, string taxId)
            => await RequestAsync<ApiResult<TaxIdValidationResult>>("/api/v1/validation/tax-id", "POST", new { country_code = countryCode, tax_id = taxId });
    }
}
