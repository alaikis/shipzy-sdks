using Shipzy.Sdk.Models;

namespace Shipzy.Sdk
{
    public class ShipzyClient
    {
        public EpodClient Epod { get; }
        public EcmrClient Ecmr { get; }
        public OrderClient Order { get; }
        public MerchantAddressClient MerchantAddress { get; }
        public CarrierEpodClient CarrierEpod { get; }
        public CarrierAddressClient CarrierAddress { get; }
        public PickupPointClient PickupPoints { get; }
        public AgeVerificationClient AgeVerification { get; }
        public ActivationClient Activation { get; }
        public ProductClient Product { get; }
        public FinanceClient Finance { get; }
        public NotificationClient Notification { get; }
        public SupportTicketClient SupportTicket { get; }
        public CarrierClient Carrier { get; }
        public PlatformConfigClient PlatformConfig { get; }
        public TrackingClient Tracking { get; }
        public ValidationClient Validation { get; }

        public ShipzyClient(ShipzyConfig config)
        {
            Epod = new EpodClient(config);
            Ecmr = new EcmrClient(config);
            Order = new OrderClient(config);
            MerchantAddress = new MerchantAddressClient(config);
            CarrierEpod = new CarrierEpodClient(config);
            CarrierAddress = new CarrierAddressClient(config);
            PickupPoints = new PickupPointClient(config);
            AgeVerification = new AgeVerificationClient(config);
            Activation = new ActivationClient(config);
            Product = new ProductClient(config);
            Finance = new FinanceClient(config);
            Notification = new NotificationClient(config);
            SupportTicket = new SupportTicketClient(config);
            Carrier = new CarrierClient(config);
            PlatformConfig = new PlatformConfigClient(config);
            Tracking = new TrackingClient(config);
            Validation = new ValidationClient(config);
        }

        public void UpdateToken(string token)
        {
            Epod.SetToken(token);
            Ecmr.SetToken(token);
            Order.SetToken(token);
            MerchantAddress.SetToken(token);
            CarrierEpod.SetToken(token);
            CarrierAddress.SetToken(token);
            PickupPoints.SetToken(token);
            AgeVerification.SetToken(token);
            Activation.SetToken(token);
            Product.SetToken(token);
            Finance.SetToken(token);
            Notification.SetToken(token);
            SupportTicket.SetToken(token);
            Carrier.SetToken(token);
            PlatformConfig.SetToken(token);
            Tracking.SetToken(token);
            Validation.SetToken(token);
        }
    }
}
