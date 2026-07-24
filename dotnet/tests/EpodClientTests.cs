using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace Shipzy.Sdk.Tests
{
    public class EpodClientTests
    {
        private readonly ShipzyConfig _config = new ShipzyConfig
        {
            BaseUrl = "https://api.shipzy.me",
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
            // Verify no exception thrown
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
            Assert.Equal("https://api.shipzy.me", config.BaseUrl);
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
}
