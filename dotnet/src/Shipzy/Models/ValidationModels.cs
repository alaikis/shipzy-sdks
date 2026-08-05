namespace Shipzy.Sdk.Models
{
    public class PhoneVerifyResult
    {
        public bool Valid { get; set; }
        public string Formatted { get; set; }
        public string CountryCode { get; set; }
    }

    public class PhoneFormatResult
    {
        public string Formatted { get; set; }
    }

    public class PostalCodeResult
    {
        public bool Valid { get; set; }
        public string Message { get; set; }
        public string Source { get; set; }
    }

    public class EmailValidationResult
    {
        public bool Valid { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public string Source { get; set; }
        public string Formatted { get; set; }
    }

    public class TaxIdValidationResult
    {
        public bool Valid { get; set; }
        public string Message { get; set; }
        public string Source { get; set; }
    }
}
