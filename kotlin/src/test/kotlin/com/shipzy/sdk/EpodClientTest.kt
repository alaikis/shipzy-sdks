package com.shipzy.sdk

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class EpodClientTest {

    @Test
    fun constructor_withDefaultConfig_works() {
        val config = ShipzyConfig()
        val client = EpodClient(config)
        assertNotNull(client)
    }

    @Test
    fun constructor_withCustomConfig_works() {
        val config = ShipzyConfig(
            baseUrl = "http://localhost:1417",
            token = "test-token",
            timeoutSeconds = 60
        )
        val client = EpodClient(config)
        assertNotNull(client)
    }

    @Test
    fun setToken_updatesToken() {
        val config = ShipzyConfig()
        val client = EpodClient(config)
        client.setToken("new-token")
        // No exception
    }

    @Test
    fun config_defaultValues_areCorrect() {
        val config = ShipzyConfig()
        assertEquals("https://api.shipzy.me", config.baseUrl)
        assertNull(config.token)
        assertEquals(30, config.timeoutSeconds)
    }

    @Test
    fun config_canOverrideValues() {
        val config = ShipzyConfig(
            baseUrl = "http://localhost:1417",
            token = "my-token",
            timeoutSeconds = 60
        )
        assertEquals("http://localhost:1417", config.baseUrl)
        assertEquals("my-token", config.token)
        assertEquals(60, config.timeoutSeconds)
    }

    @Test
    fun shipzyException_hasStatusCode() {
        val ex = ShipzyException("test error", 400)
        assertEquals(400, ex.statusCode)
        assertEquals("test error", ex.message)
    }

    @Test
    fun shipzyAuthException_is401() {
        val ex = ShipzyAuthException("unauthorized")
        assertEquals(401, ex.statusCode)
    }
}
