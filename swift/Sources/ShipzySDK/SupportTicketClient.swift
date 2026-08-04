import Foundation

// ============ Support Ticket Models ============

public struct SupportTicket: Codable, Sendable {
    public let id: String
    public let subject: String
    public let description: String?
    public let status: String?
    public let priority: String?
    public let category: String?
    public let orderId: String?
    public let trackingNo: String?
    public let createdAt: String?
    public let updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case id, subject, description, status, priority, category
        case orderId = "order_id"
        case trackingNo = "tracking_no"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

public struct SupportTicketListResponse: Codable, Sendable {
    public let data: [SupportTicket]
    public let total: Int
    public let page: Int
    public let pageSize: Int

    enum CodingKeys: String, CodingKey {
        case data, total, page
        case pageSize = "page_size"
    }
}

public struct SupportTicketComment: Codable, Sendable {
    public let id: String
    public let ticketId: String
    public let author: String?
    public let content: String
    public let createdAt: String?

    enum CodingKeys: String, CodingKey {
        case id
        case ticketId = "ticket_id"
        case author, content
        case createdAt = "created_at"
    }
}

// ============ Support Ticket Client ============

public class SupportTicketClient: HttpClient {
    public func list(page: Int? = nil, pageSize: Int? = nil, status: String? = nil, priority: String? = nil) async throws -> SupportTicketListResponse {
        let q = buildQuery([
            "page": page?.description,
            "page_size": pageSize?.description,
            "status": status,
            "priority": priority
        ])
        return try await request("/api/v1/support/tickets\(q)")
    }

    public func get(_ id: String) async throws -> SupportTicket {
        return try await request("/api/v1/support/tickets/\(id)")
    }

    public func create(_ data: [String: Any]) async throws -> SupportTicket {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/support/tickets", method: "POST", body: body)
    }

    public func update(_ id: String, _ data: [String: Any]) async throws -> SupportTicket {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/support/tickets/\(id)/update", method: "POST", body: body)
    }

    public func close(_ id: String) async throws -> SupportTicket {
        return try await request("/api/v1/support/tickets/\(id)/close", method: "POST", body: Data())
    }

    public func addComment(_ id: String, content: String) async throws -> SupportTicketComment {
        let body = try JSONSerialization.data(withJSONObject: ["content": content])
        return try await request("/api/v1/support/tickets/\(id)/comments", method: "POST", body: body)
    }
}
