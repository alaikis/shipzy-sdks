import Foundation

// ============ Notification Models ============

public struct NotificationResult: Codable, Sendable {
    public let channel: String
    public let status: String
    public let message: String?
    public let url: String?
    public let error: String?
}

public struct NotificationSendRequest: Codable, Sendable {
    public let channels: [String]
    public let recipient: [String: String]
    public let template: String?
    public let data: [String: AnyCodable]?
    public let orderId: String?
    public let trackingNo: String?

    enum CodingKeys: String, CodingKey {
        case channels, recipient, template, data
        case orderId = "order_id"
        case trackingNo = "tracking_no"
    }
}

public struct NotificationSendResponse: Codable, Sendable {
    public let results: [NotificationResult]
}

public struct NotificationListResponse: Codable, Sendable {
    public let data: [NotificationResult]
    public let total: Int?
}

public struct AnyCodable: Codable, Sendable {
    public let value: Any

    public init(_ value: Any) {
        self.value = value
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let intVal = try? container.decode(Int.self) {
            value = intVal
        } else if let doubleVal = try? container.decode(Double.self) {
            value = doubleVal
        } else if let boolVal = try? container.decode(Bool.self) {
            value = boolVal
        } else if let stringVal = try? container.decode(String.self) {
            value = stringVal
        } else {
            value = NSNull()
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        if let intVal = value as? Int {
            try container.encode(intVal)
        } else if let doubleVal = value as? Double {
            try container.encode(doubleVal)
        } else if let boolVal = value as? Bool {
            try container.encode(boolVal)
        } else if let stringVal = value as? String {
            try container.encode(stringVal)
        }
    }
}

// ============ Notification Client ============

public class NotificationClient: HttpClient {
    public func send(_ data: [String: Any]) async throws -> NotificationSendResponse {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/notification/send", method: "POST", body: body)
    }

    public func sendToChannels(channels: [String], recipient: [String: Any], template: String? = nil, templateData: [String: Any]? = nil) async throws -> NotificationSendResponse {
        var payload: [String: Any] = [
            "channels": channels,
            "recipient": recipient
        ]
        if let template = template { payload["template"] = template }
        if let data = templateData { payload["data"] = data }
        let body = try JSONSerialization.data(withJSONObject: payload)
        return try await request("/api/v1/notification/send", method: "POST", body: body)
    }

    public func list(page: Int? = nil, pageSize: Int? = nil, channel: String? = nil) async throws -> NotificationListResponse {
        let q = buildQuery(["page": page?.description, "page_size": pageSize?.description, "channel": channel])
        return try await request("/api/v1/notification/list\(q)")
    }
}
