import Foundation

// ============ Product Models ============

public struct Product: Codable, Sendable {
    public let id: String
    public let merchantId: String?
    public let name: String
    public let sku: String?
    public let description: String?
    public let category: String?
    public let status: String?
    public let price: Double?
    public let currency: String?
    public let ageRestricted: Bool?
    public let createdAt: String?
    public let updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case id
        case merchantId = "merchant_id"
        case name, sku, description, category, status, price, currency
        case ageRestricted = "age_restricted"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

public struct ProductListResponse: Codable, Sendable {
    public let data: [Product]
    public let total: Int
    public let page: Int
    public let pageSize: Int

    enum CodingKeys: String, CodingKey {
        case data, total, page
        case pageSize = "page_size"
    }
}

// ============ Product Client ============

public class ProductClient: HttpClient {
    public func list(status: String? = nil, category: String? = nil, search: String? = nil, activeOnly: Bool? = nil) async throws -> ProductListResponse {
        let q = buildQuery([
            "status": status,
            "category": category,
            "search": search,
            "active_only": activeOnly != nil ? (activeOnly! ? "true" : "false") : nil
        ])
        return try await request("/api/v1/products\(q)")
    }

    public func get(_ id: String) async throws -> Product {
        return try await request("/api/v1/products/\(id)")
    }

    public func create(_ data: [String: Any]) async throws -> Product {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/products", method: "POST", body: body)
    }

    public func update(_ id: String, _ data: [String: Any]) async throws -> Product {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/products/\(id)", method: "PUT", body: body)
    }

    public func retire(_ id: String) async throws -> Product {
        return try await request("/api/v1/products/\(id)/retire", method: "POST", body: Data())
    }
}
