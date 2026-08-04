import Foundation

// ============ Activation Models ============

public struct ActivationProvider: Codable, Sendable {
    public let slug: String
    public let name: String
    public let capabilities: [String]
    public let status: String?
}

public struct ActivationProviderListResponse: Codable, Sendable {
    public let data: [ActivationProvider]
    public let total: Int?
}

public struct ProviderActivation: Codable, Sendable {
    public let id: String
    public let providerSlug: String
    public let merchantId: String?
    public let status: String
    public let createdAt: String?
    public let updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case id
        case providerSlug = "provider_slug"
        case merchantId = "merchant_id"
        case status
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

public struct ActivationListResponse: Codable, Sendable {
    public let data: [ProviderActivation]
    public let total: Int?
}

// ============ Activation Client ============

public class ActivationClient: HttpClient {
    public func listProviders(capability: String? = nil) async throws -> ActivationProviderListResponse {
        let q = buildQuery(["capability": capability])
        return try await request("/api/v1/marketplace/providers\(q)")
    }

    public func getProvider(_ slug: String) async throws -> ActivationProvider {
        return try await request("/api/v1/marketplace/providers/\(slug)")
    }

    public func list() async throws -> ActivationListResponse {
        return try await request("/api/v1/marketplace/activations")
    }

    public func get(_ id: String) async throws -> ProviderActivation {
        return try await request("/api/v1/marketplace/activations/\(id)")
    }

    public func activate(_ data: [String: Any]) async throws -> ProviderActivation {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/marketplace/activations", method: "POST", body: body)
    }

    public func pause(_ id: String) async throws -> ProviderActivation {
        return try await request("/api/v1/marketplace/activations/\(id)/pause", method: "POST", body: Data())
    }

    public func resume(_ id: String) async throws -> ProviderActivation {
        return try await request("/api/v1/marketplace/activations/\(id)/resume", method: "POST", body: Data())
    }

    public func revoke(_ id: String, reason: String? = nil) async throws -> ProviderActivation {
        var data: [String: Any] = [:]
        if let reason = reason { data["reason"] = reason }
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/marketplace/activations/\(id)/revoke", method: "POST", body: body)
    }
}
