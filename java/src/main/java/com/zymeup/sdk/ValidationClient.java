package com.zymeup.sdk;

import java.util.Map;

/**
 * Validation client — phone, postal code, email, tax ID validation.
 * Endpoints: POST /api/v1/validation/{phone,postal-code,email,tax-id}
 * No authentication required for validation endpoints.
 */
public class ValidationClient {
    private final ZymeupClient client;

    public ValidationClient(ZymeupClient client) {
        this.client = client;
    }

    /** POST /api/v1/validation/phone — verify phone number validity */
    public Map<String, Object> verifyPhone(String countryCode, String phone) throws Exception {
        String path = "/api/v1/validation/phone";
        java.net.http.HttpRequest request = client.newRequest(path)
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(
                        toJson(Map.of("country_code", countryCode, "phone", phone))))
                .build();
        var response = client.send(request);
        return parseResponse(response.body());
    }

    /** POST /api/v1/validation/phone/format — format phone to E.164 */
    public Map<String, Object> formatPhone(String countryCode, String phone) throws Exception {
        String path = "/api/v1/validation/phone/format";
        java.net.http.HttpRequest request = client.newRequest(path)
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(
                        toJson(Map.of("country_code", countryCode, "phone", phone))))
                .build();
        var response = client.send(request);
        return parseResponse(response.body());
    }

    /** POST /api/v1/validation/postal-code — validate postal code format */
    public Map<String, Object> validatePostalCode(String countryCode, String code) throws Exception {
        String path = "/api/v1/validation/postal-code";
        java.net.http.HttpRequest request = client.newRequest(path)
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(
                        toJson(Map.of("country_code", countryCode, "code", code))))
                .build();
        var response = client.send(request);
        return parseResponse(response.body());
    }

    /** POST /api/v1/validation/email — validate email deliverability */
    public Map<String, Object> validateEmail(String email) throws Exception {
        String path = "/api/v1/validation/email";
        java.net.http.HttpRequest request = client.newRequest(path)
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(
                        toJson(Map.of("email", email))))
                .build();
        var response = client.send(request);
        return parseResponse(response.body());
    }

    /** POST /api/v1/validation/tax-id — validate VAT / tax ID */
    public Map<String, Object> validateTaxId(String countryCode, String taxId) throws Exception {
        String path = "/api/v1/validation/tax-id";
        java.net.http.HttpRequest request = client.newRequest(path)
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(
                        toJson(Map.of("country_code", countryCode, "tax_id", taxId))))
                .build();
        var response = client.send(request);
        return parseResponse(response.body());
    }

    /** GET /api/v1/validation/health — check GWSTD service availability */
    public Map<String, Object> health() throws Exception {
        String path = "/api/v1/validation/health";
        java.net.http.HttpRequest request = client.newRequest(path).GET().build();
        var response = client.send(request);
        return parseResponse(response.body());
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseResponse(String body) {
        // Simple JSON parse — in production use Jackson or Gson
        if (body == null || body.isEmpty()) return Map.of();
        try {
            // Basic parse for expected structure
            var m = new java.util.HashMap<String, Object>();
            String trimmed = body.trim();
            if (!trimmed.startsWith("{")) return m;
            // Extract code
            int codeIdx = trimmed.indexOf("\"code\"");
            if (codeIdx >= 0) {
                int colon = trimmed.indexOf(':', codeIdx);
                int comma = trimmed.indexOf(',', colon);
                if (comma > colon) {
                    m.put("code", Integer.parseInt(trimmed.substring(colon + 1, comma).trim()));
                }
            }
            // Extract data
            int dataIdx = trimmed.indexOf("\"data\"");
            if (dataIdx >= 0) {
                int colon = trimmed.indexOf(':', dataIdx);
                int objStart = trimmed.indexOf('{', colon);
                int objEnd = trimmed.lastIndexOf('}');
                if (objStart > colon && objEnd > objStart) {
                    String dataStr = trimmed.substring(objStart, objEnd + 1);
                    m.put("data", parseJsonObject(dataStr));
                }
            }
            // Extract message
            int msgIdx = trimmed.indexOf("\"message\"");
            if (msgIdx >= 0) {
                int colon = trimmed.indexOf(':', msgIdx);
                int start = trimmed.indexOf('"', colon + 1) + 1;
                int end = trimmed.indexOf('"', start);
                if (end > start) m.put("message", trimmed.substring(start, end));
            }
            return m;
        } catch (Exception e) {
            return Map.of();
        }
    }

    private Map<String, Object> parseJsonObject(String json) {
        var m = new java.util.HashMap<String, Object>();
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
                } catch (NumberFormatException ex) {
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
