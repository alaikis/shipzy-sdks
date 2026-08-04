import Foundation

// ============ Age Verification Models ============

public struct AgeVerificationEvent: Codable, Sendable {
    public let id: String
    public let merchantId: String?
    public let parcelId: String?
    public let orderId: String?
    public let epodId: String?
    public let method: String
    public let pass: Bool
    public let minAgeRequired: Int
    public let checkerUserId: String?
    public let checkedAt: String?
    public let remark: String?
    public let countryCode: String?
    public let createdAt: String?
    public let updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case id
        case merchantId = "merchant_id"
        case parcelId = "parcel_id"
        case orderId = "order_id"
        case epodId = "epod_id"
        case method, pass
        case minAgeRequired = "min_age_required"
        case checkerUserId = "checker_user_id"
        case checkedAt = "checked_at"
        case remark
        case countryCode = "country_code"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

public struct AgeVerificationListResponse: Codable, Sendable {
    public let data: [AgeVerificationEvent]
    public let total: Int?
}

// ============ Age Verification Client ============

public class AgeVerificationClient: HttpClient {
    public func create(_ data: [String: Any]) async throws -> AgeVerificationEvent {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/age-verifications", method: "POST", body: body)
    }

    public func listByParcel(parcelId: String) async throws -> AgeVerificationListResponse {
        let q = buildQuery(["parcel_id": parcelId])
        return try await request("/api/v1/age-verifications\(q)")
    }

    public func listByOrder(orderId: String) async throws -> AgeVerificationListResponse {
        let q = buildQuery(["order_id": orderId])
        return try await request("/api/v1/age-verifications\(q)")
    }

    public func get(_ id: String) async throws -> AgeVerificationEvent {
        return try await request("/api/v1/age-verifications/\(id)")
    }
}
