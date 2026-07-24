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

    public void setToken(String token) { this.config.setToken(token); }
    public ShipzyConfig getConfig() { return config; }

    private <T> T request(String path, String method, Class<T> responseType, Object body) throws Exception {
        var builder = HttpRequest.newBuilder()
            .uri(URI.create(config.getBaseUrl().replaceAll("/$", "") + path))
            .header("Authorization", "Bearer " + config.getToken())
            .header("Content-Type", "application/json");
        if ("POST".equals(method)) builder.POST(HttpRequest.BodyPublishers.ofString(body != null ? gson.toJson(body) : "{}"));
        else if ("PUT".equals(method)) builder.PUT(HttpRequest.BodyPublishers.ofString(body != null ? gson.toJson(body) : "{}"));
        else builder.GET();
        HttpResponse<String> response = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() == 401) throw new ShipzyAuthException("Unauthorized");
        if (response.statusCode() >= 400) throw new ShipzyException("HTTP " + response.statusCode() + ": " + response.body(), response.statusCode());
        return gson.fromJson(response.body(), responseType);
    }

    public EpodListResponse list(int page, int pageSize, String status, String trackingNo) throws Exception {
        StringBuilder q = new StringBuilder("?page=" + page + "&page_size=" + pageSize);
        if (status != null) q.append("&status=").append(URLEncoder.encode(status, StandardCharsets.UTF_8));
        if (trackingNo != null) q.append("&tracking_no=").append(URLEncoder.encode(trackingNo, StandardCharsets.UTF_8));
        return request("/api/v1/shipment/epod/list" + q, "GET", EpodListResponse.class, null);
    }

    public EpodDetail get(String epodId) throws Exception { return request("/api/v1/shipment/epod/" + epodId, "GET", EpodDetail.class, null); }
    public EpodDetail create(Object data) throws Exception { return request("/api/v1/shipment/epod/create", "POST", EpodDetail.class, data); }
    public EpodDetail generateFromOrder(String orderId) throws Exception { return request("/api/v1/shipment/epod/generate-from-order", "POST", EpodDetail.class, new java.util.Map.of("order_id", orderId)); }
    public EpodDetail update(String id, Object data) throws Exception { return request("/api/v1/shipment/epod/" + id + "/update", "PUT", EpodDetail.class, data); }
    public EpodDetail deliver(String id) throws Exception { return request("/api/v1/shipment/epod/" + id + "/delivery", "POST", EpodDetail.class, null); }
    public EpodDetail fail(String id, String remark) throws Exception { return request("/api/v1/shipment/epod/" + id + "/fail", "POST", EpodDetail.class, new java.util.Map.of("remark", remark)); }
    public SignUrlResponse generateSignUrl(String id) throws Exception { return request("/api/v1/shipment/epod/" + id + "/sign", "POST", SignUrlResponse.class, null); }

    public static class ShipzyConfig {
        private String baseUrl = "https://api.shipzy.me";
        private String token;
        private int timeoutSeconds = 30;
        public String getBaseUrl() { return baseUrl; } public void setBaseUrl(String v) { this.baseUrl = v; }
        public String getToken() { return token; } public void setToken(String v) { this.token = v; }
        public int getTimeoutSeconds() { return timeoutSeconds; } public void setTimeoutSeconds(int v) { this.timeoutSeconds = v; }
    }

    public static class EpodListResponse { public List<EpodListItem> data; public int total; public int page; @SerializedName("page_size") public int pageSize; }
    public static class EpodListItem { public String id; @SerializedName("tracking_no") public String trackingNo; public String status; @SerializedName("recipient_name") public String recipientName; @SerializedName("created_at") public String createdAt; }
    public static class EpodDetail { public String id; @SerializedName("tracking_no") public String trackingNo; public String status; @SerializedName("recipient_name") public String recipientName; @SerializedName("recipient_phone") public String recipientPhone; @SerializedName("created_at") public String createdAt; @SerializedName("updated_at") public String updatedAt; @SerializedName("sign_url") public String signUrl; @SerializedName("evidence_hash") public String evidenceHash; }
    public static class SignUrlResponse { @SerializedName("sign_url") public String signUrl; }
    public static class ShipzyException extends Exception { public final int statusCode; public ShipzyException(String m, int s) { super(m); this.statusCode = s; } }
    public static class ShipzyAuthException extends ShipzyException { public ShipzyAuthException(String m) { super(m, 401); } }
}

class OrderClient {
    private final HttpClient httpClient; private final EpodClient.ShipzyConfig config;
    public OrderClient(EpodClient.ShipzyConfig c) { this.config = c; this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(c.getTimeoutSeconds())).build(); }
    public void setToken(String t) { this.config.setToken(t); }
    private static final Gson gson = new Gson();
    private <T> T req(String p, String m, Class<T> t, Object b) throws Exception {
        var builder = HttpRequest.newBuilder().uri(URI.create(config.getBaseUrl().replaceAll("/$", "") + p)).header("Authorization", "Bearer " + config.getToken()).header("Content-Type", "application/json");
        if ("POST".equals(m)) builder.POST(HttpRequest.BodyPublishers.ofString(b != null ? gson.toJson(b) : "{}")); else builder.GET();
        var resp = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() == 401) throw new EpodClient.ShipzyAuthException("Unauthorized");
        if (resp.statusCode() >= 400) throw new EpodClient.ShipzyException("HTTP " + resp.statusCode(), resp.statusCode());
        return gson.fromJson(resp.body(), t);
    }
    public Object list(int p, int ps, String s) throws Exception { return req("/api/v1/order/list?page=" + p + "&page_size=" + ps + (s != null ? "&status=" + URLEncoder.encode(s, StandardCharsets.UTF_8) : ""), "GET", Object.class, null); }
    public Object get(String id) throws Exception { return req("/api/v1/order/" + id, "GET", Object.class, null); }
    public Object create(Object d) throws Exception { return req("/api/v1/order/create", "POST", Object.class, d); }
    public Object update(String id, Object d) throws Exception { return req("/api/v1/order/" + id + "/update", "POST", Object.class, d); }
    public Object cancel(String id) throws Exception { return req("/api/v1/order/" + id + "/cancel", "POST", Object.class, null); }
}

class AddressClient {
    private final HttpClient httpClient; private final EpodClient.ShipzyConfig config;
    public AddressClient(EpodClient.ShipzyConfig c) { this.config = c; this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(c.getTimeoutSeconds())).build(); }
    public void setToken(String t) { this.config.setToken(t); }
    private static final Gson gson = new Gson();
    private <T> T req(String p, Class<T> t, Object b) throws Exception {
        var builder = HttpRequest.newBuilder().uri(URI.create(config.getBaseUrl().replaceAll("/$", "") + p)).header("Authorization", "Bearer " + config.getToken()).header("Content-Type", "application/json");
        builder.POST(HttpRequest.BodyPublishers.ofString(b != null ? gson.toJson(b) : "{}"));
        var resp = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() == 401) throw new EpodClient.ShipzyAuthException("Unauthorized");
        if (resp.statusCode() >= 400) throw new EpodClient.ShipzyException("HTTP " + resp.statusCode(), resp.statusCode());
        return gson.fromJson(resp.body(), t);
    }
    public Object list(Object p) throws Exception { return req("/api/v1/merchant/addresses/list", Object.class, p); }
    public Object create(Object d) throws Exception { return req("/api/v1/merchant/addresses/create", Object.class, d); }
    public Object update(String id, Object d) throws Exception { return req("/api/v1/merchant/addresses/" + id + "/update", Object.class, d); }
    public Object delete(String id) throws Exception { return req("/api/v1/merchant/addresses/" + id + "/delete", Object.class, null); }
}

class CarrierEpodClient {
    private final HttpClient httpClient; private final EpodClient.ShipzyConfig config;
    public CarrierEpodClient(EpodClient.ShipzyConfig c) { this.config = c; this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(c.getTimeoutSeconds())).build(); }
    public void setToken(String t) { this.config.setToken(t); }
    private static final Gson gson = new Gson();
    private <T> T req(String p, String m, Class<T> t, Object b) throws Exception {
        var builder = HttpRequest.newBuilder().uri(URI.create(config.getBaseUrl().replaceAll("/$", "") + p)).header("Authorization", "Bearer " + config.getToken()).header("Content-Type", "application/json");
        if ("POST".equals(m)) builder.POST(HttpRequest.BodyPublishers.ofString(b != null ? gson.toJson(b) : "{}")); else builder.GET();
        var resp = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() == 401) throw new EpodClient.ShipzyAuthException("Unauthorized");
        if (resp.statusCode() >= 400) throw new EpodClient.ShipzyException("HTTP " + resp.statusCode(), resp.statusCode());
        return gson.fromJson(resp.body(), t);
    }
    public EpodClient.EpodListResponse list(int p, int ps, String s) throws Exception {
        return req("/api/v1/carrier/epod/list?page=" + p + "&page_size=" + ps + (s != null ? "&status=" + URLEncoder.encode(s, StandardCharsets.UTF_8) : ""), "GET", EpodClient.EpodListResponse.class, null);
    }
    public EpodClient.EpodDetail get(String id) throws Exception { return req("/api/v1/carrier/epod/" + id, "GET", EpodClient.EpodDetail.class, null); }
    public EpodClient.EpodDetail deliver(String id) throws Exception { return req("/api/v1/carrier/epod/" + id + "/delivery", "POST", EpodClient.EpodDetail.class, null); }
    public EpodClient.EpodDetail fail(String id, String remark) throws Exception { return req("/api/v1/carrier/epod/" + id + "/fail", "POST", EpodClient.EpodDetail.class, new java.util.Map.of("remark", remark)); }
}

class ShipzyClient {
    public final EpodClient epod; public final OrderClient order; public final AddressClient address; public final CarrierEpodClient carrierEpod;
    public ShipzyClient(EpodClient.ShipzyConfig c) { epod = new EpodClient(c); order = new OrderClient(c); address = new AddressClient(c); carrierEpod = new CarrierEpodClient(c); }
    public void updateToken(String t) { epod.setToken(t); order.setToken(t); address.setToken(t); carrierEpod.setToken(t); }
}
