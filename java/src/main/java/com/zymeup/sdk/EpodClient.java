package com.zymeup.sdk;

import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

public class EpodClient {
    private final ZymeupClient client;

    public EpodClient(ZymeupClient client) {
        this.client = client;
    }

    public Map<String, Object> list(int page, int pageSize, String status) throws Exception {
        StringBuilder path = new StringBuilder("/api/v1/shipment/epod/list?");
        if (page > 0) path.append("page=").append(page).append("&");
        if (pageSize > 0) path.append("page_size=").append(pageSize).append("&");
        if (status != null) path.append("status=").append(status);
        
        HttpRequest request = client.newRequest(path.toString()).GET().build();
        HttpResponse<String> response = client.send(request);
        return parseResponse(response.body());
    }

    public Map<String, Object> get(String id) throws Exception {
        HttpRequest request = client.newRequest("/api/v1/shipment/epod/" + id).GET().build();
        HttpResponse<String> response = client.send(request);
        return parseResponse(response.body());
    }

    public Map<String, Object> generateSignUrl(String id) throws Exception {
        HttpRequest request = client.newRequest("/api/v1/shipment/epod/" + id + "/sign")
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = client.send(request);
        return parseResponse(response.body());
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseResponse(String body) {
        // Simplified - in production use Jackson or Gson
        return new HashMap<>();
    }
}
