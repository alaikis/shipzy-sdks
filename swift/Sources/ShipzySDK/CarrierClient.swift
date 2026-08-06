import Foundation

// ============ Carrier Models ============

public struct Carrier: Codable, Sendable {
    public let id: Int
    public let name: String
    public let code: String
    public let carrierType: String
    public let trackingType: String
    public let businessType: String
    public let state: String
    public let description: String
    public let website: String
    public let contactEmail: String?
    public let contactPhone: String?
    public let createdAt: String
    public let updatedAt: String

    enum CodingKeys: String, CodingKey {
        case id, name, code
        case carrierType = "carrier_type"
        case trackingType = "tracking_type"
        case businessType = "business_type"
        case state, description, website
        case contactEmail = "contact_email"
        case contactPhone = "contact_phone"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

// ============ Carrier Client ============

public class CarrierClient: HttpClient {
    public func list(page: Int? = nil, pageSize: Int? = nil, state: String? = nil) async throws -> [Carrier] {
        let q = buildQuery(["page": page?.description, "page_size": pageSize?.description, "state": state])
        return try await request("/api/v1/carrier/list\(q)")
    }

    public func get(_ id: String) async throws -> Carrier {
        return try await request("/api/v1/carrier/\(id)")
    }

    public func create(_ data: [String: Any]) async throws -> Carrier {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/carrier", method: "POST", body: body)
    }

    public func update(_ id: String, _ data: [String: Any]) async throws -> Carrier {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/carrier/\(id)", method: "PUT", body: body)
    }

    public func delete(_ id: String) async throws -> [String: Bool] {
        return try await request("/api/v1/carrier/\(id)", method: "DELETE", body: Data())
    }
}
