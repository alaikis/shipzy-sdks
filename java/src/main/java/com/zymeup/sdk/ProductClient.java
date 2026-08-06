package com.zymeup.sdk;

import java.util.Map;
import java.util.HashMap;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ProductClient {
    private final ZymeupClient client;

    public ProductClient(ZymeupClient client) {
        this.client = client;
    }

    public Map<String, Object> list(String status, String category, String search) throws Exception {
        StringBuilder path = new StringBuilder("/api/v1/products?active_only=true");
        if (status != null) path.append("&status=").append(status);
        if (category != null) path.append("&category=").append(category);
        if (search != null) path.append("&search=").append(search);
        HttpRequest request = client.newRequest(path.toString()).GET().build();
        HttpResponse<String> response = client.send(request);
        return parseResponse(response.body());
    }

    public Map<String, Object> get(String id) throws Exception {
        HttpRequest request = client.newRequest("/api/v1/products/" + id).GET().build();
        HttpResponse<String> response = client.send(request);
        return parseResponse(response.body());
    }

    public Map<String, Object> create(Map<String, Object> data) throws Exception {
        HttpRequest request = client.newRequest("/api/v1/products")
                .POST(HttpRequest.BodyPublishers.ofString(toJson(data))).build();
        HttpResponse<String> response = client.send(request);
        return parseResponse(response.body());
    }

    public Map<String, Object> update(String id, Map<String, Object> data) throws Exception {
        HttpRequest request = client.newRequest("/api/v1/products/" + id)
                .PUT(HttpRequest.BodyPublishers.ofString(toJson(data))).build();
        HttpResponse<String> response = client.send(request);
        return parseResponse(response.body());
    }

    public Map<String, Object> retire(String id) throws Exception {
        HttpRequest request = client.newRequest("/api/v1/products/" + id + "/retire")
                .POST(HttpRequest.BodyPublishers.noBody()).build();
        HttpResponse<String> response = client.send(request);
        return parseResponse(response.body());
    }

    private Map<String, Object> parseResponse(String body) {
        if (body == null || body.isEmpty()) return new HashMap<>();
        return body.trim().startsWith("{") ? parseJsonObject(body) : new HashMap<>();
    }

    private Map<String, Object> parseJsonObject(String json) {
        var m = new HashMap<String, Object>();
        int i = 0;
        while (i < json.length()) {
            int keyStart = json.indexOf('"', i);
            if (keyStart < 0) break;
            keyStart++;
            int keyEnd = json.indexOf('"', keyStart);
            if (keyEnd < 0) break;
            String key = json.substring(keyStart, keyEnd);
            int colon = json.indexOf(':', keyEnd);
            if (colon < 0) break;
            char ch = json.charAt(colon + 1);
            if (ch == '"') {
                int valStart = colon + 2;
                int valEnd = json.indexOf('"', valStart);
                m.put(key, json.substring(valStart, valEnd));
                i = valEnd + 1;
            } else if (ch == 't' || ch == 'f') {
                m.put(key, ch == 't');
                i = json.indexOf(',', colon) + 1;
            } else if (Character.isDigit(ch) || ch == '-') {
                int numEnd = colon + 1;
                while (numEnd < json.length() && "0123456789.eE+-".indexOf(json.charAt(numEnd)) >= 0) numEnd++;
                try {
                    if (json.substring(colon + 1, numEnd).contains("."))
                        m.put(key, Double.parseDouble(json.substring(colon + 1, numEnd)));
                    else
                        m.put(key, Long.parseLong(json.substring(colon + 1, numEnd)));
                } catch (NumberFormatException e) {
                    m.put(key, json.substring(colon + 1, numEnd));
                }
                i = numEnd;
            } else {
                i = json.indexOf(',', colon) + 1;
            }
        }
        return m;
    }

    private String toJson(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder("{");
        boolean first = true;
        for (var entry : map.entrySet()) {
            if (!first) sb.append(",");
            first = false;
            sb.append("\"").append(entry.getKey()).append("\":\"")
              .append(entry.getValue().toString().replace("\"", "\\\"")).append("\"");
        }
        sb.append("}");
        return sb.toString();
    }
}
