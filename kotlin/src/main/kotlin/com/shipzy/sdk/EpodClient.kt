package com.shipzy.sdk

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

enum class UserRole { MERCHANT, CARRIER }

data class ShipzyConfig(
    val baseUrl: String = "https://api.shipzy.me",
    var token: String = "",
    val timeoutSeconds: Int = 30,
    var role: UserRole = UserRole.MERCHANT,
    var carrierCode: String = ""
)

@Serializable
data class EpodListResponse(val data: List<EpodListItem> = emptyList(), val total: Int = 0, val page: Int = 0, @SerialName("page_size") val pageSize: Int = 0)
@Serializable
data class EpodListItem(val id: String = "", @SerialName("tracking_no") val trackingNo: String = "", val status: String = "", @SerialName("recipient_name") val recipientName: String? = null, @SerialName("created_at") val createdAt: String = "")
@Serializable
data class EpodDetail(val id: String = "", @SerialName("tracking_no") val trackingNo: String = "", val status: String = "", @SerialName("recipient_name") val recipientName: String? = null, @SerialName("recipient_phone") val recipientPhone: String? = null, @SerialName("created_at") val createdAt: String = "", @SerialName("updated_at") val updatedAt: String = "", @SerialName("sign_url") val signUrl: String? = null, @SerialName("evidence_hash") val evidenceHash: String? = null)
@Serializable
data class SignUrlResponse(@SerialName("sign_url") val signUrl: String = "")

open class ShipzyException(message: String, val statusCode: Int) : Exception(message)
class ShipzyAuthException(message: String) : ShipzyException(message, 401)

class EpodClient(private val config: ShipzyConfig) {
    private val json = Json { ignoreUnknownKeys = true; isLenient = true }
    private val client = HttpClient(CIO) { install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L } }
    fun setToken(token: String) { config.token = token }
    private fun getAuthHeader(): String = if (config.role == UserRole.CARRIER && config.carrierCode.isNotEmpty()) "Bearer ${config.carrierCode}:${config.token}" else "Bearer ${config.token}"
    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Get, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) {
            this.method = method; header(HttpHeaders.Authorization, getAuthHeader()); header(HttpHeaders.ContentType, ContentType.Application.Json)
            if (body != null) setBody(body)
        }
        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)
        return response.body()
    }
    suspend fun list(page: Int = 1, pageSize: Int = 25, status: String? = null, trackingNo: String? = null): EpodListResponse {
        val q = listOfNotNull("page=$page", "page_size=$pageSize", status?.let { "status=${java.net.URLEncoder.encode(it, "UTF-8")}" }, trackingNo?.let { "tracking_no=${java.net.URLEncoder.encode(it, "UTF-8")}" }).joinToString("&")
        return request("/api/v1/shipment/epod/list?$q")
    }
    suspend fun get(id: String): EpodDetail = request("/api/v1/shipment/epod/$id")
    suspend fun create(data: Any): EpodDetail = request("/api/v1/shipment/epod/create", HttpMethod.Post, data)
    suspend fun generateFromOrder(orderId: String): EpodDetail = request("/api/v1/shipment/epod/generate-from-order", HttpMethod.Post, mapOf("order_id" to orderId))
    suspend fun update(id: String, data: Any): EpodDetail = request("/api/v1/shipment/epod/$id/update", HttpMethod.Put, data)
    suspend fun deliver(id: String): EpodDetail = request("/api/v1/shipment/epod/$id/delivery", HttpMethod.Post)
    suspend fun fail(id: String, remark: String): EpodDetail = request("/api/v1/shipment/epod/$id/fail", HttpMethod.Post, mapOf("remark" to remark))
    suspend fun generateSignUrl(id: String): SignUrlResponse = request("/api/v1/shipment/epod/$id/sign", HttpMethod.Post)
}

class OrderClient(private val config: ShipzyConfig) {
    private val client = HttpClient(CIO) { install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L } }
    fun setToken(token: String) { config.token = token }
    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Get, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) { this.method = method; header(HttpHeaders.Authorization, "Bearer ${config.token}"); header(HttpHeaders.ContentType, ContentType.Application.Json); if (body != null) setBody(body) }
        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)
        return response.body()
    }
    suspend fun list(page: Int = 1, pageSize: Int = 25, status: String? = null): EpodListResponse {
        val q = listOfNotNull("page=$page", "page_size=$pageSize", status?.let { "status=${java.net.URLEncoder.encode(it, "UTF-8")}" }).joinToString("&")
        return request("/api/v1/order/list?$q")
    }
    suspend fun get(id: String): Any = request("/api/v1/order/$id")
    suspend fun create(data: Any): Any = request("/api/v1/order/create", HttpMethod.Post, data)
    suspend fun update(id: String, data: Any): Any = request("/api/v1/order/$id/update", HttpMethod.Post, data)
    suspend fun cancel(id: String): Any = request("/api/v1/order/$id/cancel", HttpMethod.Post)
}

class AddressClient(private val config: ShipzyConfig) {
    private val client = HttpClient(CIO) { install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L } }
    fun setToken(token: String) { config.token = token }
    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Post, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) { this.method = method; header(HttpHeaders.Authorization, "Bearer ${config.token}"); header(HttpHeaders.ContentType, ContentType.Application.Json); if (body != null) setBody(body) }
        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)
        return response.body()
    }
    suspend fun list(params: Any? = null): Any = request("/api/v1/merchant/addresses/list", body = params)
    suspend fun create(data: Any): Any = request("/api/v1/merchant/addresses/create", body = data)
    suspend fun update(id: String, data: Any): Any = request("/api/v1/merchant/addresses/$id/update", body = data)
    suspend fun delete(id: String): Any = request("/api/v1/merchant/addresses/$id/delete")
}

class CarrierEpodClient(private val config: ShipzyConfig) {
    private val client = HttpClient(CIO) { install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L } }
    fun setToken(token: String) { config.token = token }
    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Get, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) { this.method = method; header(HttpHeaders.Authorization, "Bearer ${config.token}"); header(HttpHeaders.ContentType, ContentType.Application.Json); if (body != null) setBody(body) }
        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)
        return response.body()
    }
    suspend fun list(page: Int = 1, pageSize: Int = 25, status: String? = null): EpodListResponse {
        val q = listOfNotNull("page=$page", "page_size=$pageSize", status?.let { "status=${java.net.URLEncoder.encode(it, "UTF-8")}" }).joinToString("&")
        return request("/api/v1/carrier/epod/list?$q")
    }
    suspend fun get(id: String): EpodDetail = request("/api/v1/carrier/epod/$id")
    suspend fun deliver(id: String): EpodDetail = request("/api/v1/carrier/epod/$id/delivery", HttpMethod.Post)
    suspend fun fail(id: String, remark: String): EpodDetail = request("/api/v1/carrier/epod/$id/fail", HttpMethod.Post, mapOf("remark" to remark))
}

class ShipzyClient(config: ShipzyConfig) {
    val epod = EpodClient(config)
    val order = OrderClient(config)
    val address = AddressClient(config)
    val carrierEpod = CarrierEpodClient(config)
    val validation = ValidationClient(config)
    val role = config.role
    fun updateToken(token: String) {
        epod.setToken(token); order.setToken(token); address.setToken(token)
        carrierEpod.setToken(token); validation.setToken(token)
    }
    fun isMerchant() = role == UserRole.MERCHANT
    fun isCarrier() = role == UserRole.CARRIER
}

class ValidationClient(private val config: ShipzyConfig) {
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
    suspend fun verifyPhone(countryCode: String, phone: String): Map<String, Any> =
        request("/api/v1/validation/phone", HttpMethod.Post, mapOf("country_code" to countryCode, "phone" to phone))
    suspend fun formatPhone(countryCode: String, phone: String): Map<String, Any> =
        request("/api/v1/validation/phone/format", HttpMethod.Post, mapOf("country_code" to countryCode, "phone" to phone))
    suspend fun validatePostalCode(countryCode: String, code: String): Map<String, Any> =
        request("/api/v1/validation/postal-code", HttpMethod.Post, mapOf("country_code" to countryCode, "code" to code))
    suspend fun validateEmail(email: String): Map<String, Any> =
        request("/api/v1/validation/email", HttpMethod.Post, mapOf("email" to email))
    suspend fun validateTaxId(countryCode: String, taxId: String): Map<String, Any> =
        request("/api/v1/validation/tax-id", HttpMethod.Post, mapOf("country_code" to countryCode, "tax_id" to taxId))
    suspend fun health(): Map<String, Any> =
        request("/api/v1/validation/health", HttpMethod.Get)
}
