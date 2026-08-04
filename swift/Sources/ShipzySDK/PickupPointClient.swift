import Foundation

// ============ Pickup Point Models ============

public struct PickupPoint: Codable, Sendable {
    public let id: String
    public let merchantId: String?
    public let type: String?
    public let name: String
    public let address: [String: String]?
    public let contactPhone: String?
    public let contactEmail: String?
    public let openingHours: String?
    public let status: String?
    public let latitude: Double?
    public let longitude: Double?
    public let countryCode: String?
    public let createdAt: String?
    public let updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case id
        case merchantId = "merchant_id"
        case type, name, address
        case contactPhone = "contact_phone"
        case contactEmail = "contact_email"
        case openingHours = "opening_hours"
        case status, latitude, longitude
        case countryCode = "country_code"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

public struct PickupPointListResponse: Codable, Sendable {
    public let data: [PickupPoint]
    public let total: Int
}

// ============ Pickup Point Client ============

public class PickupPointClient: HttpClient {
    public func list(activeOnly: Bool? = nil) async throws -> PickupPointListResponse {
        let q = buildQuery(["active_only": activeOnly != nil ? (activeOnly! ? "true" : "false") : nil])
        return try await request("/api/v1/admin/pickup-points/\(q)")
    }

    public func get(_ id: String) async throws -> PickupPoint {
        return try await request("/api/v1/admin/pickup-points/\(id)")
    }

    public func create(_ data: [String: Any]) async throws -> PickupPoint {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/admin/pickup-points/", method: "POST", body: body)
    }

    public func update(_ id: String, _ data: [String: Any]) async throws -> PickupPoint {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/admin/pickup-points/\(id)", method: "PUT", body: body)
    }

    public func deactivate(_ id: String) async throws -> PickupPoint {
        return try await request("/api/v1/admin/pickup-points/\(id)/deactivate", method: "POST", body: Data())
    }
}
