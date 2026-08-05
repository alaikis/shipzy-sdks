package com.zymeup.sdk;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class ZymeupClient {
    public static final String VERSION = "1.2.0";
    public static final String BASE_URL = "https://api.zymeup.com";

    private final String baseUrl;
    private final String apiKey;
    private final HttpClient httpClient;

    public EpodClient epod;
    public ValidationClient validation;

    public ZymeupClient(String apiKey) {
        this(apiKey, BASE_URL);
    }

    public ZymeupClient(String apiKey, String baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(30))
                .build();
        this.epod = new EpodClient(this);
        this.validation = new ValidationClient(this);
    }

    public HttpRequest.Builder newRequest(String path) {
        return HttpRequest.newBuilder()
                .uri(java.net.URI.create(baseUrl + path))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .header("User-Agent", "zymeup-sdk-java/" + VERSION)
                .timeout(Duration.ofSeconds(30));
    }

    public HttpResponse<String> send(HttpRequest request) throws Exception {
        return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    }
}
