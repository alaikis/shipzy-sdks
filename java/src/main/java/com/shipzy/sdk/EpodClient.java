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
import java.util.Map;

public class EcmrClient {
    private final HttpClient httpClient;
    private final EpodClient.ShipzyConfig config;
    private static final Gson gson = new Gson();

    public EcmrClient(EpodClient.ShipzyConfig c) {
        this.config = c;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(c.getTimeoutSeconds())).build();
    }
    public void setToken(String t) { config.setToken(t); }

    private <T> T request(String path, String method, Class<T> t, Object body) throws Exception {
        var builder = HttpRequest.newBuilder()
            .uri(URI.create(config.getBaseUrl().replaceAll("/$", "") + path))
            .header("Authorization", new EpodClient(config).getAuthHeader())
            .header("Content-Type", "application/json");
        if ("POST".equals(method) || "PUT".equals(method))
            builder.method(method, HttpRequest.BodyPublishers.ofString(body != null ? gson.toJson(body) : "{}"));
        else builder.GET();
        HttpResponse<String> resp = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() == 401) throw new EpodClient.ShipzyAuthException("Unauthorized");
        if (resp.statusCode() >= 400) throw new EpodClient.ShipzyException("HTTP " + resp.statusCode(), resp.statusCode());
        return gson.fromJson(resp.body(), t);
    }

    public Object list(int page, int pageSize) throws Exception {
        return request("/api/v1/shipment/ecmr/list?page=" + page + "&page_size=" + pageSize, "GET", Object.class, null);
    }
    public Object get(String id) throws Exception { return request("/api/v1/shipment/ecmr/" + id, "GET", Object.class, null); }
    public Object create(Object data) throws Exception { return request("/api/v1/shipment/ecmr/create", "POST", Object.class, data); }
    public Object generateFromOrder(String orderId) throws Exception { return request("/api/v1/shipment/ecmr/generate-from-order", "POST", Object.class, Map.of("order_id", orderId)); }
    public Object sign(String id) throws Exception { return request("/api/v1/shipment/ecmr/" + id + "/sign", "POST", Object.class, null); }
    public Object pdf(String id) throws Exception { return request("/api/v1/shipment/ecmr/" + id + "/pdf", "POST", Object.class, null); }
}

class ProductClient {
    private final HttpClient httpClient;
    private final EpodClient.ShipzyConfig config;
    private static final Gson gson = new Gson();

    public ProductClient(EpodClient.ShipzyConfig c) {
        this.config = c;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(c.getTimeoutSeconds())).build();
    }
    public void setToken(String t) { config.setToken(t); }

    private <T> T request(String path, String method, Class<T> t, Object body) throws Exception {
        var builder = HttpRequest.newBuilder()
            .uri(URI.create(config.getBaseUrl().replaceAll("/$", "") + path))
            .header("Authorization", new EpodClient(config).getAuthHeader())
            .header("Content-Type", "application/json");
        if ("POST".equals(method) || "PUT".equals(method))
            builder.method(method, HttpRequest.BodyPublishers.ofString(body != null ? gson.toJson(body) : "{}"));
        else builder.GET();
        HttpResponse<String> resp = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() == 401) throw new EpodClient.ShipzyAuthException("Unauthorized");
        if (resp.statusCode() >= 400) throw new EpodClient.ShipzyException("HTTP " + resp.statusCode(), resp.statusCode());
        return gson.fromJson(resp.body(), t);
    }

    public Object list(String status, String category, String search, Boolean activeOnly) throws Exception {
        StringBuilder q = new StringBuilder("?active_only=true");
        if (status != null) q.append("&status=").append(URLEncoder.encode(status, StandardCharsets.UTF_8));
        if (category != null) q.append("&category=").append(URLEncoder.encode(category, StandardCharsets.UTF_8));
        if (search != null) q.append("&search=").append(URLEncoder.encode(search, StandardCharsets.UTF_8));
        if (activeOnly != null) q.append("&active_only=").append(activeOnly);
        return request("/api/v1/products" + q, "GET", Object.class, null);
    }
    public Object get(String id) throws Exception { return request("/api/v1/products/" + id, "GET", Object.class, null); }
    public Object create(Object data) throws Exception { return request("/api/v1/products", "POST", Object.class, data); }
    public Object update(String id, Object data) throws Exception { return request("/api/v1/products/" + id, "PUT", Object.class, data); }
    public Object retire(String id) throws Exception { return request("/api/v1/products/" + id + "/retire", "POST", Object.class, null); }
}

class ActivationClient {
    private final HttpClient httpClient;
    private final EpodClient.ShipzyConfig config;
    private static final Gson gson = new Gson();

    public ActivationClient(EpodClient.ShipzyConfig c) {
        this.config = c;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(c.getTimeoutSeconds())).build();
    }
    public void setToken(String t) { config.setToken(t); }

    private <T> T request(String path, String method, Class<T> t, Object body) throws Exception {
        var builder = HttpRequest.newBuilder()
            .uri(URI.create(config.getBaseUrl().replaceAll("/$", "") + path))
            .header("Authorization", new EpodClient(config).getAuthHeader())
            .header("Content-Type", "application/json");
        if ("POST".equals(method) || "PUT".equals(method))
            builder.method(method, HttpRequest.BodyPublishers.ofString(body != null ? gson.toJson(body) : "{}"));
        else builder.GET();
        HttpResponse<String> resp = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() == 401) throw new EpodClient.ShipzyAuthException("Unauthorized");
        if (resp.statusCode() >= 400) throw new EpodClient.ShipzyException("HTTP " + resp.statusCode(), resp.statusCode());
        return gson.fromJson(resp.body(), t);
    }

    public Object listProviders(String capability) throws Exception {
        String q = capability != null ? "?capability=" + URLEncoder.encode(capability, StandardCharsets.UTF_8) : "";
        return request("/api/v1/marketplace/providers" + q, "GET", Object.class, null);
    }
    public Object getProvider(String slug) throws Exception { return request("/api/v1/marketplace/providers/" + slug, "GET", Object.class, null); }
    public Object listActivations(int page, int pageSize) throws Exception {
        return request("/api/v1/marketplace/activations?page=" + page + "&page_size=" + pageSize, "GET", Object.class, null);
    }
    public Object getActivation(String id) throws Exception { return request("/api/v1/marketplace/activations/" + id, "GET", Object.class, null); }
    public Object activate(Object data) throws Exception { return request("/api/v1/marketplace/activations", "POST", Object.class, data); }
    public Object pause(String id) throws Exception { return request("/api/v1/marketplace/activations/" + id + "/pause", "POST", Object.class, null); }
    public Object resume(String id) throws Exception { return request("/api/v1/marketplace/activations/" + id + "/resume", "POST", Object.class, null); }
    public Object revoke(String id, String reason) throws Exception { return request("/api/v1/marketplace/activations/" + id + "/revoke", "POST", Object.class, reason != null ? Map.of("reason", reason) : null); }
}

class TrackingClient {
    private final HttpClient httpClient;
    private final EpodClient.ShipzyConfig config;
    private static final Gson gson = new Gson();

    public TrackingClient(EpodClient.ShipzyConfig c) {
        this.config = c;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(c.getTimeoutSeconds())).build();
    }
    public void setToken(String t) { config.setToken(t); }

    private <T> T request(String path, String method, Class<T> t, Object body) throws Exception {
        var builder = HttpRequest.newBuilder()
            .uri(URI.create(config.getBaseUrl().replaceAll("/$", "") + path))
            .header("Authorization", new EpodClient(config).getAuthHeader())
            .header("Content-Type", "application/json");
        if ("POST".equals(method) || "PUT".equals(method))
            builder.method(method, HttpRequest.BodyPublishers.ofString(body != null ? gson.toJson(body) : "{}"));
        else builder.GET();
        HttpResponse<String> resp = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() == 401) throw new EpodClient.ShipzyAuthException("Unauthorized");
        if (resp.statusCode() >= 400) throw new EpodClient.ShipzyException("HTTP " + resp.statusCode(), resp.statusCode());
        return gson.fromJson(resp.body(), t);
    }

    public Object detail(String trackingNo) throws Exception { return request("/api/v1/tracking/" + trackingNo, "GET", Object.class, null); }
    public Object list(int page, int pageSize, String status, String trackingNo) throws Exception {
        String basePath = EpodClient.UserRole.CARRIER.equals(config.getRole()) ? "/api/v1/carrier/tracking/list" : "/api/v1/merchant/tracking/list";
        StringBuilder q = new StringBuilder("?page=" + page + "&page_size=" + pageSize);
        if (status != null) q.append("&status=").append(URLEncoder.encode(status, StandardCharsets.UTF_8));
        if (trackingNo != null) q.append("&tracking_no=").append(URLEncoder.encode(trackingNo, StandardCharsets.UTF_8));
        return request(basePath + q, "GET", Object.class, null);
    }
}

class UploadClient {
    private final HttpClient httpClient;
    private final EpodClient.ShipzyConfig config;
    private static final Gson gson = new Gson();

    public UploadClient(EpodClient.ShipzyConfig c) {
        this.config = c;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(c.getTimeoutSeconds())).build();
    }
    public void setToken(String t) { config.setToken(t); }

    private <T> T request(String path, String method, Class<T> t, Object body) throws Exception {
        var builder = HttpRequest.newBuilder()
            .uri(URI.create(config.getBaseUrl().replaceAll("/$", "") + path))
            .header("Authorization", new EpodClient(config).getAuthHeader())
            .header("Content-Type", "application/json");
        if ("POST".equals(method) || "PUT".equals(method))
            builder.method(method, HttpRequest.BodyPublishers.ofString(body != null ? gson.toJson(body) : "{}"));
        else builder.GET();
        HttpResponse<String> resp = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() == 401) throw new EpodClient.ShipzyAuthException("Unauthorized");
        if (resp.statusCode() >= 400) throw new EpodClient.ShipzyException("HTTP " + resp.statusCode(), resp.statusCode());
        return gson.fromJson(resp.body(), t);
    }

    public Object uploadFile(String endpoint, Object body) throws Exception { return request(endpoint, "POST", Object.class, body); }
    public Object brandingUploadLogo(Object body) throws Exception { return request("/api/v1/merchant/branding/logo", "POST", Object.class, body); }
}

class CarrierClient {
    private final HttpClient httpClient;
    private final EpodClient.ShipzyConfig config;
    private static final Gson gson = new Gson();

    public CarrierClient(EpodClient.ShipzyConfig c) {
        this.config = c;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(c.getTimeoutSeconds())).build();
    }
    public void setToken(String t) { config.setToken(t); }

    private <T> T request(String path, String method, Class<T> t, Object body) throws Exception {
        var builder = HttpRequest.newBuilder()
            .uri(URI.create(config.getBaseUrl().replaceAll("/$", "") + path))
            .header("Authorization", new EpodClient(config).getAuthHeader())
            .header("Content-Type", "application/json");
        if ("POST".equals(method) || "PUT".equals(method) || "DELETE".equals(method))
            builder.method(method, HttpRequest.BodyPublishers.ofString(body != null ? gson.toJson(body) : "{}"));
        else builder.GET();
        HttpResponse<String> resp = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() == 401) throw new EpodClient.ShipzyAuthException("Unauthorized");
        if (resp.statusCode() >= 400) throw new EpodClient.ShipzyException("HTTP " + resp.statusCode(), resp.statusCode());
        return gson.fromJson(resp.body(), t);
    }

    public Object list(int page, int pageSize, String state) throws Exception {
        StringBuilder q = new StringBuilder("?page=" + page + "&page_size=" + pageSize);
        if (state != null) q.append("&state=").append(URLEncoder.encode(state, StandardCharsets.UTF_8));
        return request("/api/v1/carrier/list" + q, "GET", Object.class, null);
    }
    public Object get(String id) throws Exception { return request("/api/v1/carrier/" + id, "GET", Object.class, null); }
    public Object create(Object data) throws Exception { return request("/api/v1/carrier", "POST", Object.class, data); }
    public Object update(String id, Object data) throws Exception { return request("/api/v1/carrier/" + id, "PUT", Object.class, data); }
    public Object delete(String id) throws Exception { return request("/api/v1/carrier/" + id, "DELETE", Object.class, null); }
}

class PlatformConfigClient {
    private final HttpClient httpClient;
    private final EpodClient.ShipzyConfig config;
    private static final Gson gson = new Gson();

    public PlatformConfigClient(EpodClient.ShipzyConfig c) {
        this.config = c;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(c.getTimeoutSeconds())).build();
    }
    public void setToken(String t) { config.setToken(t); }

    private <T> T request(String path, String method, Class<T> t, Object body) throws Exception {
        var builder = HttpRequest.newBuilder()
            .uri(URI.create(config.getBaseUrl().replaceAll("/$", "") + path))
            .header("Authorization", new EpodClient(config).getAuthHeader())
            .header("Content-Type", "application/json");
        if ("POST".equals(method) || "PUT".equals(method))
            builder.method(method, HttpRequest.BodyPublishers.ofString(body != null ? gson.toJson(body) : "{}"));
        else builder.GET();
        HttpResponse<String> resp = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() == 401) throw new EpodClient.ShipzyAuthException("Unauthorized");
        if (resp.statusCode() >= 400) throw new EpodClient.ShipzyException("HTTP " + resp.statusCode(), resp.statusCode());
        return gson.fromJson(resp.body(), t);
    }

    public Object list() throws Exception { return request("/api/v1/admin/platform-configs", "GET", Object.class, null); }
    public Object update(String id, Object data) throws Exception { return request("/api/v1/admin/platform-configs/" + id, "PUT", Object.class, data); }
}

class ComplianceClient {
    private final HttpClient httpClient;
    private final EpodClient.ShipzyConfig config;
    private static final Gson gson = new Gson();

    public ComplianceClient(EpodClient.ShipzyConfig c) {
        this.config = c;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(c.getTimeoutSeconds())).build();
    }
    public void setToken(String t) { config.setToken(t); }

    private <T> T request(String path, String method, Class<T> t, Object body) throws Exception {
        var builder = HttpRequest.newBuilder()
            .uri(URI.create(config.getBaseUrl().replaceAll("/$", "") + path))
            .header("Authorization", new EpodClient(config).getAuthHeader())
            .header("Content-Type", "application/json");
        if ("POST".equals(method) || "PUT".equals(method))
            builder.method(method, HttpRequest.BodyPublishers.ofString(body != null ? gson.toJson(body) : "{}"));
        else builder.GET();
        HttpResponse<String> resp = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() == 401) throw new EpodClient.ShipzyAuthException("Unauthorized");
        if (resp.statusCode() >= 400) throw new EpodClient.ShipzyException("HTTP " + resp.statusCode(), resp.statusCode());
        return gson.fromJson(resp.body(), t);
    }

    public Object check(Object data) throws Exception { return request("/api/v1/compliance/check", "POST", Object.class, data); }
    public Object countryRequirements(String countryCode) throws Exception { return request("/api/v1/compliance/requirements/" + countryCode, "GET", Object.class, null); }
    public Object createCustoms(Object data) throws Exception { return request("/api/v1/compliance/customs", "POST", Object.class, data); }
    public Object getCustoms(String id) throws Exception { return request("/api/v1/compliance/customs/" + id, "GET", Object.class, null); }
    public Object validateHsCode(String hsCode) throws Exception { return request("/api/v1/compliance/hscode/" + hsCode + "/validate", "GET", Object.class, null); }
    public Object prohibitedItems() throws Exception { return request("/api/v1/compliance/prohibited", "GET", Object.class, null); }
}

class CpscClient {
    private final HttpClient httpClient;
    private final EpodClient.ShipzyConfig config;
    private static final Gson gson = new Gson();

    public CpscClient(EpodClient.ShipzyConfig c) {
        this.config = c;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(c.getTimeoutSeconds())).build();
    }
    public void setToken(String t) { config.setToken(t); }

    private <T> T request(String path, String method, Class<T> t, Object body) throws Exception {
        var builder = HttpRequest.newBuilder()
            .uri(URI.create(config.getBaseUrl().replaceAll("/$", "") + path))
            .header("Authorization", new EpodClient(config).getAuthHeader())
            .header("Content-Type", "application/json");
        if ("POST".equals(method) || "PUT".equals(method))
            builder.method(method, HttpRequest.BodyPublishers.ofString(body != null ? gson.toJson(body) : "{}"));
        else builder.GET();
        HttpResponse<String> resp = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() == 401) throw new EpodClient.ShipzyAuthException("Unauthorized");
        if (resp.statusCode() >= 400) throw new EpodClient.ShipzyException("HTTP " + resp.statusCode(), resp.statusCode());
        return gson.fromJson(resp.body(), t);
    }

    public Object getCollections() throws Exception { return request("/api/v1/cpsc/collections", "GET", Object.class, null); }
    public Object getCredential() throws Exception { return request("/api/v1/cpsc/credential", "GET", Object.class, null); }
    public Object saveCredential(Object data) throws Exception { return request("/api/v1/cpsc/credential", "POST", Object.class, data); }
    public Object importData(Object data) throws Exception { return request("/api/v1/cpsc/import", "POST", Object.class, data); }
    public Object getImportStatus(String importId) throws Exception { return request("/api/v1/cpsc/import/" + importId + "/status", "GET", Object.class, null); }
    public Object getImportLog(String importId, boolean errorsOnly) throws Exception { return request("/api/v1/cpsc/import/" + importId + "/log?errorsOnly=" + errorsOnly, "GET", Object.class, null); }
    public Object exportData(Map<String, Object> filter) throws Exception {
        StringBuilder q = new StringBuilder();
        if (filter != null) filter.forEach((k, v) -> q.append("&").append(k).append("=").append(v));
        return request("/api/v1/cpsc/export" + q, "GET", Object.class, null);
    }
    public Object exportAsync(Map<String, Object> filter) throws Exception {
        StringBuilder q = new StringBuilder();
        if (filter != null) filter.forEach((k, v) -> q.append("&").append(k).append("=").append(v));
        return request("/api/v1/cpsc/export-async" + q, "GET", Object.class, null);
    }
    public Object getExportAsyncStatus(String exportId) throws Exception { return request("/api/v1/cpsc/export-async/" + exportId + "/status", "GET", Object.class, null); }
    public Object getExportAsyncData(String exportId) throws Exception { return request("/api/v1/cpsc/export-async/" + exportId + "/data", "GET", Object.class, null); }
    public Object getCertificates(Object data) throws Exception { return request("/api/v1/cpsc/certificates", "POST", Object.class, data); }
    public Object getTradeParties(String partyType) throws Exception {
        String q = partyType != null ? "?tradePartyType=" + URLEncoder.encode(partyType, StandardCharsets.UTF_8) : "";
        return request("/api/v1/cpsc/trade-parties" + q, "GET", Object.class, null);
    }
    public Object getTokenExpiration() throws Exception { return request("/api/v1/cpsc/token-expiration", "GET", Object.class, null); }
}

class ShipzyClient {
    public final EpodClient epod;
    public final OrderClient order;
    public final AddressClient address;
    public final CarrierEpodClient carrierEpod;
    public final EcmrClient ecmr;
    public final ProductClient product;
    public final ActivationClient activation;
    public final TrackingClient tracking;
    public final UploadClient upload;
    public final CarrierClient carrier;
    public final PlatformConfigClient platformConfig;
    public final ComplianceClient compliance;
    public final CpscClient cpsc;
    public final EpodClient.UserRole role;

    public ShipzyClient(EpodClient.ShipzyConfig c) {
        epod = new EpodClient(c);
        order = new OrderClient(c);
        address = new AddressClient(c);
        carrierEpod = new CarrierEpodClient(c);
        ecmr = new EcmrClient(c);
        product = new ProductClient(c);
        activation = new ActivationClient(c);
        tracking = new TrackingClient(c);
        upload = new UploadClient(c);
        carrier = new CarrierClient(c);
        platformConfig = new PlatformConfigClient(c);
        compliance = new ComplianceClient(c);
        cpsc = new CpscClient(c);
        role = c.getRole();
    }

    public void updateToken(String t) {
        epod.setToken(t); order.setToken(t); address.setToken(t);
        carrierEpod.setToken(t); ecmr.setToken(t); product.setToken(t);
        activation.setToken(t); tracking.setToken(t); upload.setToken(t);
        carrier.setToken(t); platformConfig.setToken(t); compliance.setToken(t); cpsc.setToken(t);
    }

    public boolean isMerchant() { return role == EpodClient.UserRole.MERCHANT; }
    public boolean isCarrier() { return role == EpodClient.UserRole.CARRIER; }
}
