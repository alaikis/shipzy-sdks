package com.zymeup.sdk;

public record Carrier(
    String id,
    String name,
    String code,
    String trackingProvider,
    String trackingSlug,
    String status
) {}