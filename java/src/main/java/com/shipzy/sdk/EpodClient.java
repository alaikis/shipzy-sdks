package com.shipzy.sdk;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import java.util.List;

public class EpodClient {

    private final HttpClient httpClient;
    private final ShipzyConfig config;
    private static final Gson gson = new Gson();

    public EpodClient(ShipzyConfig config) {
        this.config = config;
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(config.getTimeoutSeconds()))
            .build();
    }

    public void setToken(String token) {
        this.config.setToken(token);
    }

    private <T> T request(String path, String method, Class<T> responseType, Object body) throws Exception {
        var builder = HttpRequest.newBuilder()
            .uri(URI.create(config.getBaseUrl().replaceAll("/$", "") + path))
            .header("Authorization", "Bearer " + config.getToken())
            .header("Content-Type", "application/json");

        if ("POST".equals(method)) {
            builder.POST(HttpRequest.BodyPublishers.ofString(body != null ? gson.toJson(body) : "{}"));
        } else {
            builder.GET();
        }

        HttpResponse<String> response = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 401) {
            throw new ShipzyAuthException("Unauthorized");
        }
        if (response.statusCode() >= 400) {
            throw new ShipzyException("HTTP " + response.statusCode() + ": " + response.body(), response.statusCode());
        }

        return gson.fromJson(response.body(), responseType);
    }

    public EpodListResponse list(int page, int pageSize, String status, String trackingNo) throws Exception {
        StringBuilder query = new StringBuilder("?page=" + page + "&page_size=" + pageSize);
        if (status != null) query.append("&status=").append(URLEncoder.encode(status, StandardCharsets.UTF_8));
        if (trackingNo != null) query.append("&tracking_no=").append(URLEncoder.encode(trackingNo, StandardCharsets.UTF_8));
        return request("/api/v1/shipment/epod/list" + query, "GET", EpodListResponse.class, null);
    }

    public EpodDetail get(String epodId) throws Exception {
        return request("/api/v1/shipment/epod/" + epodId, "GET", EpodDetail.class, null);
    }

    public SignUrlResponse generateSignUrl(String epodId) throws Exception {
        return request("/api/v1/shipment/epod/" + epodId + "/sign", "POST", SignUrlResponse.class, null);
    }

    // Config class
    public static class ShipzyConfig {
        private String baseUrl = "https://api.shipzy.me";
        private String token;
        private int timeoutSeconds = 30;

        public String getBaseUrl() { return baseUrl; }
        public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public int getTimeoutSeconds() { return timeoutSeconds; }
        public void setTimeoutSeconds(int timeoutSeconds) { this.timeoutSeconds = timeoutSeconds; }
    }

    // Response/Error classes
    public static class EpodListResponse {
        public List<EpodListItem> data;
        public int total;
        public int page;
        @SerializedName("page_size") public int pageSize;
    }

    public static class EpodListItem {
        public String id;
        @SerializedName("tracking_no") public String trackingNo;
        public String status;
        @SerializedName("recipient_name") public String recipientName;
        @SerializedName("created_at") public String createdAt;
    }

    public static class EpodDetail {
        public String id;
        @SerializedName("tracking_no") public String trackingNo;
        public String status;
        @SerializedName("recipient_name") public String recipientName;
        @SerializedName("recipient_phone") public String recipientPhone;
        @SerializedName("created_at") public String createdAt;
        @SerializedName("updated_at") public String updatedAt;
        @SerializedName("sign_url") public String signUrl;
        @SerializedName("evidence_hash") public String evidenceHash;
    }

    public static class SignUrlResponse {
        @SerializedName("sign_url") public String signUrl;
    }

    public static class ShipzyException extends Exception {
        public final int statusCode;
        public ShipzyException(String message, int statusCode) {
            super(message);
            this.statusCode = statusCode;
        }
    }

    public static class ShipzyAuthException extends ShipzyException {
        public ShipzyAuthException(String message) { super(message, 401); }
    }
}
