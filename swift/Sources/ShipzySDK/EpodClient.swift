import Foundation

// ============ EPOD Models ============

public struct EpodListItem: Codable, Sendable {
    public let id: String
    public let trackingNo: String
    public let status: String
    public let recipientName: String?
    public let createdAt: String
}

public struct EpodListResponse: Codable, Sendable {
    public let data: [EpodListItem]
    public let total: Int
    public let page: Int
    public let pageSize: Int
}

public struct EpodDetail: Codable, Sendable {
    public let id: String
    public let trackingNo: String
    public let status: String
    public let recipientName: String?
    public let recipientPhone: String?
    public let deliveryAddress: [String: String]?
    public let senderAddress: [String: String]?
    public let proofType: String?
    public let createdAt: String
    public let updatedAt: String
    public let signUrl: String?
    public let evidenceHash: String?
    public let documentHash: String?
    public let signatureData: String?
    public let photoUrl: String?
}

public struct SignUrlResponse: Codable, Sendable {
    public let signUrl: String
}

// ============ EPOD Client ============

public class EpodClient: HttpClient {
    public func list(page: Int? = nil, pageSize: Int? = nil, status: String? = nil, trackingNo: String? = nil) async throws -> EpodListResponse {
        let q = buildQuery(["page": page?.description, "page_size": pageSize?.description, "status": status, "tracking_no": trackingNo])
        return try await request("/api/v1/shipment/epod/list\(q)")
    }

    public func get(_ id: String) async throws -> EpodDetail {
        return try await request("/api/v1/shipment/epod/\(id)")
    }

    public func create(_ data: [String: Any]) async throws -> EpodDetail {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/shipment/epod/create", method: "POST", body: body)
    }

    public func generateFromOrder(_ orderId: String, options: [String: Any] = [:]) async throws -> EpodDetail {
        var data = options
        data["order_id"] = orderId
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/shipment/epod/generate-from-order", method: "POST", body: body)
    }

    public func update(_ id: String, _ data: [String: Any]) async throws -> EpodDetail {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/shipment/epod/\(id)/update", method: "PUT", body: body)
    }

    public func deliver(_ id: String, data: [String: Any] = [:]) async throws -> EpodDetail {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/shipment/epod/\(id)/delivery", method: "POST", body: body)
    }

    public func fail(_ id: String, remark: String) async throws -> EpodDetail {
        let body = try JSONSerialization.data(withJSONObject: ["remark": remark])
        return try await request("/api/v1/shipment/epod/\(id)/fail", method: "POST", body: body)
    }

    public func captureProof(_ id: String, _ data: [String: Any]) async throws -> EpodDetail {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/shipment/epod/\(id)/capture-proof", method: "POST", body: body)
    }

    public func generateSignUrl(_ id: String) async throws -> SignUrlResponse {
        return try await request("/api/v1/shipment/epod/\(id)/sign", method: "POST", body: Data())
    }

    public func generatePdf(_ id: String) async throws -> [String: String?] {
        return try await request("/api/v1/shipment/epod/\(id)/pdf", method: "POST", body: Data())
    }
}
