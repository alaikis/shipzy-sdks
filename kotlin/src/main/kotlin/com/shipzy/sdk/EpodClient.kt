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

data class ShipzyConfig(
    val baseUrl: String = "https://api.shipzy.me",
    var token: String = "",
    val timeoutSeconds: Int = 30
)

@Serializable
data class EpodListResponse(
    val data: List<EpodListItem> = emptyList(),
    val total: Int = 0,
    val page: Int = 0,
    @SerialName("page_size") val pageSize: Int = 0
)

@Serializable
data class EpodListItem(
    val id: String = "",
    @SerialName("tracking_no") val trackingNo: String = "",
    val status: String = "",
    @SerialName("recipient_name") val recipientName: String? = null,
    @SerialName("created_at") val createdAt: String = ""
)

@Serializable
data class EpodDetail(
    val id: String = "",
    @SerialName("tracking_no") val trackingNo: String = "",
    val status: String = "",
    @SerialName("recipient_name") val recipientName: String? = null,
    @SerialName("recipient_phone") val recipientPhone: String? = null,
    @SerialName("created_at") val createdAt: String = "",
    @SerialName("updated_at") val updatedAt: String = "",
    @SerialName("sign_url") val signUrl: String? = null,
    @SerialName("evidence_hash") val evidenceHash: String? = null
)

@Serializable
data class SignUrlResponse(
    @SerialName("sign_url") val signUrl: String = ""
)

open class ShipzyException(message: String, val statusCode: Int) : Exception(message)
class ShipzyAuthException(message: String) : ShipzyException(message, 401)

class EpodClient(private val config: ShipzyConfig) {

    private val json = Json { ignoreUnknownKeys = true; isLenient = true }
    private val client = HttpClient(CIO) {
        install(HttpTimeout) { requestTimeoutMillis = config.timeoutSeconds * 1000L }
    }

    fun setToken(token: String) {
        config.token = token
    }

    private suspend inline fun <reified T> request(path: String, method: HttpMethod = HttpMethod.Get, body: Any? = null): T {
        val response = client.request(config.baseUrl.trimEnd('/') + path) {
            this.method = method
            header(HttpHeaders.Authorization, "Bearer ${config.token}")
            header(HttpHeaders.ContentType, ContentType.Application.Json)
            if (body != null) setBody(body)
        }

        if (response.status == HttpStatusCode.Unauthorized) throw ShipzyAuthException("Unauthorized")
        if (!response.status.isSuccess()) throw ShipzyException("HTTP ${response.status.value}", response.status.value)

        return response.body()
    }

    suspend fun list(page: Int = 1, pageSize: Int = 25, status: String? = null, trackingNo: String? = null): EpodListResponse {
        val query = listOfNotNull(
            "page=$page",
            "page_size=$pageSize",
            status?.let { "status=${java.net.URLEncoder.encode(it, "UTF-8")}" },
            trackingNo?.let { "tracking_no=${java.net.URLEncoder.encode(it, "UTF-8")}" }
        ).joinToString("&")
        return request("/api/v1/shipment/epod/list?$query")
    }

    suspend fun get(epodId: String): EpodDetail {
        return request("/api/v1/shipment/epod/$epodId")
    }

    suspend fun generateSignUrl(epodId: String): SignUrlResponse {
        return request("/api/v1/shipment/epod/$epodId/sign", HttpMethod.Post)
    }
}
