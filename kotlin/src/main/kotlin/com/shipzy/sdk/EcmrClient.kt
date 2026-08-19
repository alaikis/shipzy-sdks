package com.shipzy.sdk

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.request.*
import io.ktor.http.*

class EcmrClient(private val config: ShipzyConfig) {
    private val client = HttpClient(CIO) { install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L } }
    fun setToken(token: String) { config.token = token }
    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Get, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) {
            this.method = method; header(HttpHeaders.Authorization, "Bearer ${config.token}"); header(HttpHeaders.ContentType, ContentType.Application.Json)
            if (body != null) setBody(body)
        }
        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)
        return response.body()
    }
    suspend fun list(page: Int = 1, pageSize: Int = 25): Any = request("/api/v1/shipment/ecmr/list?page=$page&page_size=$pageSize")
    suspend fun get(id: String): Any = request("/api/v1/shipment/ecmr/$id")
    suspend fun create(data: Any): Any = request("/api/v1/shipment/ecmr/create", HttpMethod.Post, data)
    suspend fun generateFromOrder(orderId: String): Any = request("/api/v1/shipment/ecmr/generate-from-order", HttpMethod.Post, mapOf("order_id" to orderId))
    suspend fun sign(id: String): Any = request("/api/v1/shipment/ecmr/$id/sign", HttpMethod.Post)
    suspend fun pdf(id: String): Any = request("/api/v1/shipment/ecmr/$id/pdf", HttpMethod.Post)
    suspend fun update(id: String, data: Any): Any = request("/api/v1/shipment/ecmr/$id/update", HttpMethod.Post, data)
    suspend fun cancel(id: String): Any = request("/api/v1/shipment/ecmr/$id/cancel", HttpMethod.Post)
    suspend fun validate(id: String): Any = request("/api/v1/shipment/ecmr/$id/validate", HttpMethod.Post)
    suspend fun submitToAuthority(id: String): Any = request("/api/v1/shipment/ecmr/$id/submit-to-authority", HttpMethod.Post)
}

class ProductClient(private val config: ShipzyConfig) {
    private val client = HttpClient(CIO) { install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L } }
    fun setToken(token: String) { config.token = token }
    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Get, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) {
            this.method = method; header(HttpHeaders.Authorization, "Bearer ${config.token}"); header(HttpHeaders.ContentType, ContentType.Application.Json)
            if (body != null) setBody(body)
        }
        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)
        return response.body()
    }
    suspend fun list(status: String? = null, category: String? = null, search: String? = null): Any = request("/api/v1/products?active_only=true${status?.let { "&status=$it" } ?: ""}${category?.let { "&category=$it" } ?: ""}${search?.let { "&search=$it" } ?: ""}")
    suspend fun get(id: String): Any = request("/api/v1/products/$id")
    suspend fun create(data: Any): Any = request("/api/v1/products", HttpMethod.Post, data)
    suspend fun update(id: String, data: Any): Any = request("/api/v1/products/$id", HttpMethod.Put, data)
    suspend fun retire(id: String): Any = request("/api/v1/products/$id/retire", HttpMethod.Post)
}

class ActivationClient(private val config: ShipzyConfig) {
    private val client = HttpClient(CIO) { install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L } }
    fun setToken(token: String) { config.token = token }
    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Get, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) {
            this.method = method; header(HttpHeaders.Authorization, "Bearer ${config.token}"); header(HttpHeaders.ContentType, ContentType.Application.Json)
            if (body != null) setBody(body)
        }
        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)
        return response.body()
    }
    suspend fun listProviders(capability: String? = null): Any = request("/api/v1/marketplace/providers${capability?.let { "?capability=$it" } ?: ""}")
    suspend fun getProvider(slug: String): Any = request("/api/v1/marketplace/providers/$slug")
    suspend fun listActivations(page: Int = 1, pageSize: Int = 25): Any = request("/api/v1/marketplace/activations?page=$page&page_size=$pageSize")
    suspend fun getActivation(id: String): Any = request("/api/v1/marketplace/activations/$id")
    suspend fun activate(data: Any): Any = request("/api/v1/marketplace/activations", HttpMethod.Post, data)
    suspend fun pause(id: String): Any = request("/api/v1/marketplace/activations/$id/pause", HttpMethod.Post)
    suspend fun resume(id: String): Any = request("/api/v1/marketplace/activations/$id/resume", HttpMethod.Post)
    suspend fun revoke(id: String, reason: String? = null): Any = request("/api/v1/marketplace/activations/$id/revoke", HttpMethod.Post, (reason?.let { mapOf<String, Any>("reason" to it) } ?: mapOf<String, Any>()))
}

class TrackingClient(private val config: ShipzyConfig) {
    private val client = HttpClient(CIO) { install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L } }
    fun setToken(token: String) { config.token = token }
    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Get, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) {
            this.method = method; header(HttpHeaders.Authorization, "Bearer ${config.token}"); header(HttpHeaders.ContentType, ContentType.Application.Json)
            if (body != null) setBody(body)
        }
        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)
        return response.body()
    }
    suspend fun detail(trackingNo: String): Any = request("/api/v1/tracking/$trackingNo")
    suspend fun list(page: Int = 1, pageSize: Int = 25, status: String? = null, trackingNo: String? = null): Any {
        val basePath = if (config.role == UserRole.CARRIER) "/api/v1/carrier/tracking/list" else "/api/v1/merchant/tracking/list"
        val q = listOfNotNull("page=$page", "page_size=$pageSize", status?.let { "status=$it" }, trackingNo?.let { "tracking_no=$it" }).joinToString("&")
        return request("$basePath?$q")
    }
}

class UploadClient(private val config: ShipzyConfig) {
    private val client = HttpClient(CIO) { install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L } }
    fun setToken(token: String) { config.token = token }
    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Post, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) {
            this.method = method; header(HttpHeaders.Authorization, "Bearer ${config.token}"); header(HttpHeaders.ContentType, ContentType.Application.Json)
            if (body != null) setBody(body)
        }
        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)
        return response.body()
    }
    suspend fun uploadFile(endpoint: String, body: Any): Any = request(endpoint, HttpMethod.Post, body)
    }

class CarrierClient(private val config: ShipzyConfig) {
    private val client = HttpClient(CIO) { install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L } }
    fun setToken(token: String) { config.token = token }
    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Get, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) {
            this.method = method; header(HttpHeaders.Authorization, "Bearer ${config.token}"); header(HttpHeaders.ContentType, ContentType.Application.Json)
            if (body != null) setBody(body)
        }
        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)
        return response.body()
    }
    suspend fun list(page: Int = 1, pageSize: Int = 25, state: String? = null): Any {
        val q = listOfNotNull("page=$page", "page_size=$pageSize", state?.let { "state=$it" }).joinToString("&")
        return request("/api/v1/carrier/list?$q")
    }
    suspend fun get(id: String): Any = request("/api/v1/carrier/$id")
    suspend fun create(data: Any): Any = request("/api/v1/carrier/register", HttpMethod.Post, data)
    suspend fun update(id: String, data: Any): Any = request("/api/v1/carrier/$id", HttpMethod.Put, data)
    suspend fun delete(id: String): Any = request("/api/v1/carrier/$id", HttpMethod.Delete)
}

class PlatformConfigClient(private val config: ShipzyConfig) {
    private val client = HttpClient(CIO) { install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L } }
    fun setToken(token: String) { config.token = token }
    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Get, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) {
            this.method = method; header(HttpHeaders.Authorization, "Bearer ${config.token}"); header(HttpHeaders.ContentType, ContentType.Application.Json)
            if (body != null) setBody(body)
        }
        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)
        return response.body()
    }
    suspend fun list(): Any = request("/api/v1/admin/platform-configs")
    suspend fun update(id: String, data: Any): Any = request("/api/v1/admin/platform-configs/$id", HttpMethod.Put, data)
}

class ComplianceClient(private val config: ShipzyConfig) {
    private val client = HttpClient(CIO) { install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L } }
    fun setToken(token: String) { config.token = token }
    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Get, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) {
            this.method = method; header(HttpHeaders.Authorization, "Bearer ${config.token}"); header(HttpHeaders.ContentType, ContentType.Application.Json)
            if (body != null) setBody(body)
        }
        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)
        return response.body()
    }
    suspend fun check(data: Any): Any = request("/api/v1/compliance/check", HttpMethod.Post, data)
    suspend fun countryRequirements(countryCode: String): Any = request("/api/v1/compliance/requirements/$countryCode")
    suspend fun validateHsCode(hsCode: String): Any = request("/api/v1/compliance/hscode/$hsCode/validate")
    suspend fun createCustoms(data: Any): Any = request("/api/v1/compliance/customs", HttpMethod.Post, data)
    suspend fun getCustoms(id: String): Any = request("/api/v1/compliance/customs/$id")
}

class FinanceClient(private val config: ShipzyConfig) {
    private val client = HttpClient(CIO) { install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L } }
    fun setToken(token: String) { config.token = token }
    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Get, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) {
            this.method = method; header(HttpHeaders.Authorization, "Bearer ${config.token}"); header(HttpHeaders.ContentType, ContentType.Application.Json)
            if (body != null) setBody(body)
        }
        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)
        return response.body()
    }
    suspend fun listInvoices(page: Int = 1, pageSize: Int = 25): Any = request("/api/v1/invoices?page=$page&page_size=$pageSize")
    suspend fun getInvoice(id: String): Any = request("/api/v1/invoices/$id")
}

class CpscClient(private val config: ShipzyConfig) {
    private val client = HttpClient(CIO) { install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L } }
    fun setToken(token: String) { config.token = token }
    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Get, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) {
            this.method = method; header(HttpHeaders.Authorization, "Bearer ${config.token}"); header(HttpHeaders.ContentType, ContentType.Application.Json)
            if (body != null) setBody(body)
        }
        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)
        return response.body()
    }
    suspend fun getCollections(): Any = request("/api/v1/cpsc/collections")
    suspend fun getCredential(): Any = request("/api/v1/cpsc/credential")
    suspend fun saveCredential(data: Any): Any = request("/api/v1/cpsc/credential", HttpMethod.Post, data)
    suspend fun importData(data: Any): Any = request("/api/v1/cpsc/import", HttpMethod.Post, data)
    suspend fun getImportStatus(importId: String): Any = request("/api/v1/cpsc/import/$importId/status")
    suspend fun getImportLog(importId: String, errorsOnly: Boolean = false): Any = request("/api/v1/cpsc/import/$importId/log?errorsOnly=$errorsOnly")
    suspend fun exportData(filter: Map<String, Any> = emptyMap()): Any {
        val q = filter.map { "${it.key}=${it.value}" }.joinToString("&", prefix = "?")
        return request("/api/v1/cpsc/export$q")
    }
    suspend fun exportAsync(filter: Map<String, Any> = emptyMap()): Any {
        val q = filter.map { "${it.key}=${it.value}" }.joinToString("&", prefix = "?")
        return request("/api/v1/cpsc/export-async$q")
    }
    suspend fun getExportAsyncStatus(exportId: String): Any = request("/api/v1/cpsc/export-async/$exportId/status")
    suspend fun getExportAsyncData(exportId: String): Any = request("/api/v1/cpsc/export-async/$exportId/data")
    suspend fun getCertificates(data: Any): Any = request("/api/v1/cpsc/certificates", HttpMethod.Post, data)
    suspend fun getTradeParties(partyType: String? = null): Any {
        val q = partyType?.let { "?tradePartyType=$it" } ?: ""
        return request("/api/v1/cpsc/trade-parties$q")
    }
    suspend fun getTokenExpiration(): Any = request("/api/v1/cpsc/token-expiration")
}
