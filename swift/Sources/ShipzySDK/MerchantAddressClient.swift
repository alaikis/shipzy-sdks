import Foundation

// ============ Merchant Address Models ============

public struct TenantAddress: Codable, Sendable {
    public let id: String
    public let fullName: String?
    public let companyName: String?
    public let street: String?
    public let houseNumber: String?
    public let postalCode: String?
    public let city: String?
    public let countryCode: String?
    public let phone: String?
    public let email: String?
    public let isDefault: Bool?
    public let createdAt: String?
    public let updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case id
        case fullName = "full_name"
        case companyName = "company_name"
        case street
        case houseNumber = "house_number"
        case postalCode = "postal_code"
        case city
        case countryCode = "country_code"
        case phone, email
        case isDefault = "is_default"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

public struct TenantAddressListResponse: Codable, Sendable {
    public let data: [TenantAddress]
    public let total: Int
    public let page: Int
    public let pageSize: Int

    enum CodingKeys: String, CodingKey {
        case data, total, page
        case pageSize = "page_size"
    }
}

// ============ Merchant Address Client ============

public class MerchantAddressClient: HttpClient {
    public func list(_ filter: [String: Any]? = nil) async throws -> TenantAddressListResponse {
        if let filter = filter {
            let body = try JSONSerialization.data(withJSONObject: filter)
            return try await request("/api/v1/merchant/addresses/list", method: "POST", body: body)
        }
        return try await request("/api/v1/merchant/addresses/list", method: "POST", body: Data())
    }

    public func get(_ id: String) async throws -> TenantAddress {
        return try await request("/api/v1/merchant/addresses/\(id)")
    }

    public func create(_ data: [String: Any]) async throws -> TenantAddress {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/merchant/addresses/create", method: "POST", body: body)
    }

    public func update(_ id: String, _ data: [String: Any]) async throws -> TenantAddress {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/merchant/addresses/\(id)/update", method: "POST", body: body)
    }

    public func delete(_ id: String) async throws -> [String: String] {
        return try await request("/api/v1/merchant/addresses/\(id)/delete", method: "POST", body: Data())
    }

    public func setDefault(_ id: String, type: String? = nil) async throws -> TenantAddress {
        var data: [String: Any] = [:]
        if let type = type { data["type"] = type }
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/merchant/addresses/\(id)/set-default", method: "POST", body: body)
    }
}
