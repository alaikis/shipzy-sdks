import Foundation

// ============ Order Models ============

public struct OrderListItem: Codable, Sendable {
    public let id: String
    public let orderNo: String
    public let status: String
    public let customerName: String?
    public let totalAmount: Double?
    public let currency: String?
    public let createdAt: String
}

public struct OrderListResponse: Codable, Sendable {
    public let data: [OrderListItem]
    public let total: Int
    public let page: Int
    public let pageSize: Int
}

public struct OrderDetail: Codable, Sendable {
    public let id: String
    public let orderNo: String
    public let status: String
    public let customerName: String?
    public let customerEmail: String?
    public let customerPhone: String?
    public let totalAmount: Double?
    public let currency: String?
    public let notes: String?
    public let createdAt: String
    public let updatedAt: String
}

// ============ Order Client ============

public class OrderClient: HttpClient {
    public func list(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> OrderListResponse {
        let q = buildQuery(["page": page?.description, "page_size": pageSize?.description, "status": status])
        return try await request("/api/v1/order/list\(q)")
    }

    public func get(_ id: String) async throws -> OrderDetail {
        return try await request("/api/v1/order/\(id)")
    }

    public func create(_ data: [String: Any]) async throws -> OrderDetail {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/order/create", method: "POST", body: body)
    }

    public func createWithDocuments(_ data: [String: Any]) async throws -> OrderDetail {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/order/create-with-documents", method: "POST", body: body)
    }

    public func update(_ id: String, _ data: [String: Any]) async throws -> OrderDetail {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/order/\(id)/update", method: "POST", body: body)
    }

    public func cancel(_ id: String) async throws -> OrderDetail {
        return try await request("/api/v1/order/\(id)/cancel", method: "POST", body: Data())
    }
}
