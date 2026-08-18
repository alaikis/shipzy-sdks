import Foundation

// ============ ECMR Models ============

public struct EcmrListItem: Codable, Sendable {
    public let id: String
    public let documentNo: String
    public let status: String
    public let createdAt: String?

    enum CodingKeys: String, CodingKey {
        case id
        case documentNo = "document_no"
        case status
        case createdAt = "created_at"
    }
}

public struct EcmrListResponse: Codable, Sendable {
    public let data: [EcmrListItem]
    public let total: Int
    public let page: Int
    public let pageSize: Int

    enum CodingKeys: String, CodingKey {
        case data, total, page
        case pageSize = "page_size"
    }
}

public struct EcmrDetail: Codable, Sendable {
    public let id: String
    public let documentNo: String?
    public let status: String?
    public let senderAddress: [String: String]?
    public let receiverAddress: [String: String]?
    public let goodsDescription: String?
    public let hsCode: String?
    public let quantity: Double?
    public let weight: Double?
    public let volume: Double?
    public let freightCost: Double?
    public let insuranceCost: Double?
    public let pickupDate: String?
    public let notes: String?
    public let signatureData: String?
    public let documentHash: String?
    public let signingCertificate: String?
    public let createdAt: String?
    public let updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case id
        case documentNo = "document_no"
        case status
        case senderAddress = "sender_address"
        case receiverAddress = "receiver_address"
        case goodsDescription = "goods_description"
        case hsCode = "hs_code"
        case quantity, weight, volume
        case freightCost = "freight_cost"
        case insuranceCost = "insurance_cost"
        case pickupDate = "pickup_date"
        case notes
        case signatureData = "signature_data"
        case documentHash = "document_hash"
        case signingCertificate = "signing_certificate"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

// ============ ECMR Client ============

public class EcmrClient: HttpClient {
    public func list(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> EcmrListResponse {
        let q = buildQuery(["page": page?.description, "page_size": pageSize?.description, "status": status])
        return try await request("/api/v1/shipment/ecmr/list\(q)")
    }

    public func get(_ id: String) async throws -> EcmrDetail {
        return try await request("/api/v1/shipment/ecmr/\(id)")
    }

    public func create(_ data: [String: Any]) async throws -> EcmrDetail {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/shipment/ecmr/create", method: "POST", body: body)
    }

    public func generateFromOrder(_ orderId: String, options: [String: Any] = [:]) async throws -> EcmrDetail {
        var data = options
        data["order_id"] = orderId
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/shipment/ecmr/generate-from-order", method: "POST", body: body)
    }

    public func update(_ id: String, _ data: [String: Any]) async throws -> EcmrDetail {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/shipment/ecmr/\(id)/update", method: "POST", body: body)
    }

    public func cancel(_ id: String) async throws -> [String: String] {
        return try await request("/api/v1/shipment/ecmr/\(id)/cancel", method: "POST", body: Data())
    }

    public func validate(_ id: String) async throws -> [String: Bool] {
        return try await request("/api/v1/shipment/ecmr/\(id)/validate", method: "POST", body: Data())
    }

    public func submitToAuthority(_ id: String) async throws -> [String: String] {
        return try await request("/api/v1/shipment/ecmr/\(id)/submit-to-authority", method: "POST", body: Data())
    }

    public func sign(_ id: String) async throws -> SignUrlResponse {
        return try await request("/api/v1/shipment/ecmr/\(id)/sign", method: "POST", body: Data())
    }

    public func pdf(_ id: String) async throws -> [String: String?] {
        return try await request("/api/v1/shipment/ecmr/\(id)/pdf", method: "POST", body: Data())
    }
}