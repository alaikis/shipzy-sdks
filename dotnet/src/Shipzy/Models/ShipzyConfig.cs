namespace Shipzy.Sdk.Models
{
    public enum UserRole { Merchant, Carrier }

    public class ShipzyConfig
    {
        public string BaseUrl { get; set; } = "https://api.zymeup.com";
        public string Token { get; set; }
        public int TimeoutSeconds { get; set; } = 30;
        public UserRole Role { get; set; } = UserRole.Merchant;
        public string CarrierCode { get; set; }
    }
}
