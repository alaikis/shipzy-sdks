package com.shipzy.sdk;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class EpodClientTest {

    @Test
    void constructor_withDefaultConfig_works() {
        EpodClient.ShipzyConfig config = new EpodClient.ShipzyConfig();
        EpodClient client = new EpodClient(config);
        assertNotNull(client);
    }

    @Test
    void constructor_withCustomConfig_works() {
        EpodClient.ShipzyConfig config = new EpodClient.ShipzyConfig();
        config.setBaseUrl("http://localhost:1417");
        config.setToken("test-token");
        config.setTimeoutSeconds(60);
        EpodClient client = new EpodClient(config);
        assertNotNull(client);
    }

    @Test
    void setToken_updatesToken() {
        EpodClient.ShipzyConfig config = new EpodClient.ShipzyConfig();
        EpodClient client = new EpodClient(config);
        assertDoesNotThrow(() -> client.setToken("new-token"));
    }

    @Test
    void config_defaultValues_areCorrect() {
        EpodClient.ShipzyConfig config = new EpodClient.ShipzyConfig();
        assertEquals("https://api.shipzy.me", config.getBaseUrl());
        assertNull(config.getToken());
        assertEquals(30, config.getTimeoutSeconds());
    }

    @Test
    void config_canOverrideValues() {
        EpodClient.ShipzyConfig config = new EpodClient.ShipzyConfig();
        config.setBaseUrl("http://localhost:1417");
        config.setToken("my-token");
        config.setTimeoutSeconds(60);
        assertEquals("http://localhost:1417", config.getBaseUrl());
        assertEquals("my-token", config.getToken());
        assertEquals(60, config.getTimeoutSeconds());
    }

    @Test
    void shipzyException_hasStatusCode() {
        ShipzyException ex = new ShipzyException("test error", 400);
        assertEquals(400, ex.statusCode);
        assertEquals("test error", ex.getMessage());
    }

    @Test
    void shipzyAuthException_is401() {
        ShipzyAuthException ex = new ShipzyAuthException("unauthorized");
        assertEquals(401, ex.statusCode);
    }
}
