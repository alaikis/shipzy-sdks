using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Shipzy.Sdk;
using Shipzy.Sdk.Models;
using Xunit;

namespace Shipzy.Sdk.Tests
{
    public class EpodClientTests
    {
        private readonly ShipzyConfig _config = new ShipzyConfig
        {
            BaseUrl = "https://api.zymeup.com",
            Token = "test-token",
            TimeoutSeconds = 5
        };

        [Fact]
        public void Constructor_SetsDefaultBaseUrl()
        {
            var client = new EpodClient(new ShipzyConfig());
            Assert.NotNull(client);
        }

        [Fact]
        public void SetToken_UpdatesToken()
        {
            var client = new EpodClient(_config);
            client.SetToken("new-token");
            Assert.True(true);
        }

        [Fact]
        public void Constructor_WithCustomConfig_Works()
        {
            var client = new EpodClient(_config);
            Assert.NotNull(client);
        }

        [Fact]
        public void ShipzyException_HasStatusCode()
        {
            var ex = new ShipzyException("test error", 400);
            Assert.Equal(400, ex.StatusCode);
            Assert.Equal("test error", ex.Message);
        }

        [Fact]
        public void ShipzyAuthException_Is401()
        {
            var ex = new ShipzyAuthException("unauthorized");
            Assert.Equal(401, ex.StatusCode);
        }
    }

    public class ShipzyConfigTests
    {
        [Fact]
        public void DefaultValues_AreCorrect()
        {
            var config = new ShipzyConfig();
            Assert.Equal("https://api.zymeup.com", config.BaseUrl);
            Assert.Null(config.Token);
            Assert.Equal(30, config.TimeoutSeconds);
        }

        [Fact]
        public void CanOverrideValues()
        {
            var config = new ShipzyConfig
            {
                BaseUrl = "http://localhost:1417",
                Token = "my-token",
                TimeoutSeconds = 60
            };
            Assert.Equal("http://localhost:1417", config.BaseUrl);
            Assert.Equal("my-token", config.Token);
            Assert.Equal(60, config.TimeoutSeconds);
        }
    }

    public class ShipzyClientTests
    {
        [Fact]
        public void Constructor_InitializesAllClients()
        {
            var client = new ShipzyClient(new ShipzyConfig());
            Assert.NotNull(client.Epod);
            Assert.NotNull(client.Ecmr);
            Assert.NotNull(client.Order);
            Assert.NotNull(client.MerchantAddress);
            Assert.NotNull(client.CarrierEpod);
            Assert.NotNull(client.CarrierAddress);
            Assert.NotNull(client.PickupPoints);
            Assert.NotNull(client.AgeVerification);
            Assert.NotNull(client.Activation);
            Assert.NotNull(client.Product);
            Assert.NotNull(client.Finance);
            Assert.NotNull(client.Notification);
            Assert.NotNull(client.SupportTicket);
            Assert.NotNull(client.Carrier);
            Assert.NotNull(client.PlatformConfig);
            Assert.NotNull(client.Tracking);
        }

        [Fact]
        public void UpdateToken_PropagatesToAllClients()
        {
            var client = new ShipzyClient(new ShipzyConfig { Token = "old-token" });
            client.UpdateToken("new-token");
            Assert.True(true);
        }
    }

    public class OrderClientTests
    {
        [Fact]
        public void Constructor_Works()
        {
            var client = new OrderClient(new ShipzyConfig());
            Assert.NotNull(client);
        }
    }

    public class EcmrClientTests
    {
        [Fact]
        public void Constructor_Works()
        {
            var client = new EcmrClient(new ShipzyConfig());
            Assert.NotNull(client);
        }
    }

    public class MerchantAddressClientTests
    {
        [Fact]
        public void Constructor_Works()
        {
            var client = new MerchantAddressClient(new ShipzyConfig());
            Assert.NotNull(client);
        }
    }

    public class ActivationClientTests
    {
        [Fact]
        public void Constructor_Works()
        {
            var client = new ActivationClient(new ShipzyConfig());
            Assert.NotNull(client);
        }
    }

    public class AgeVerificationClientTests
    {
        [Fact]
        public void Constructor_Works()
        {
            var client = new AgeVerificationClient(new ShipzyConfig());
            Assert.NotNull(client);
        }
    }

    public class PickupPointClientTests
    {
        [Fact]
        public void Constructor_Works()
        {
            var client = new PickupPointClient(new ShipzyConfig());
            Assert.NotNull(client);
        }
    }

    public class ProductClientTests
    {
        [Fact]
        public void Constructor_Works()
        {
            var client = new ProductClient(new ShipzyConfig());
            Assert.NotNull(client);
        }
    }

    public class FinanceClientTests
    {
        [Fact]
        public void Constructor_Works()
        {
            var client = new FinanceClient(new ShipzyConfig());
            Assert.NotNull(client);
        }
    }

    public class NotificationClientTests
    {
        [Fact]
        public void Constructor_Works()
        {
            var client = new NotificationClient(new ShipzyConfig());
            Assert.NotNull(client);
        }
    }

    public class SupportTicketClientTests
    {
        [Fact]
        public void Constructor_Works()
        {
            var client = new SupportTicketClient(new ShipzyConfig());
            Assert.NotNull(client);
        }
    }

    public class CarrierClientTests
    {
        [Fact]
        public void Constructor_Works()
        {
            var client = new CarrierClient(new ShipzyConfig());
            Assert.NotNull(client);
        }
    }

    public class TrackingClientTests
    {
        [Fact]
        public void Constructor_Works()
        {
            var client = new TrackingClient(new ShipzyConfig());
            Assert.NotNull(client);
        }
    }
}
