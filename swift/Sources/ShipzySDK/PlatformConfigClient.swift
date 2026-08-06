import Foundation

// ============ Platform Config Models ============

public struct PlatformConfig: Codable, Sendable {
    public let id: String
    public let key: String
    public let value: String
    public let isSecret: Bool
    public let category: String
    public let description: String
    public let updatedAt: String

    enum CodingKeys: String, CodingKey {
        case id, key, value
        case isSecret = "is_secret"
        case category, description
        case updatedAt = "updated_at"
    }
}

public struct PlatformConfigListResponse: Codable, Sendable {
    public let data: [PlatformConfig]
}

// ============ Platform Config Client ============

public class PlatformConfigClient: HttpClient {
    public func list() async throws -> [PlatformConfig] {
        return try await request("/api/v1/admin/platform-configs")
    }

    public func update(_ id: String, _ data: [String: Any]) async throws -> PlatformConfig {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/admin/platform-configs/\(id)", method: "PUT", body: body)
    }
}
