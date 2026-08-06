import Foundation

// ============ Tracking Models ============

public struct TrackingEvent: Codable, Sendable {
    public let remark: String?
    public let eventTime: String
    public let eventType: String
    public let location: TrackingLocation?

    enum CodingKeys: String, CodingKey {
        case remark
        case eventTime = "event_time"
        case eventType = "event_type"
        case location
    }
}

public struct TrackingLocation: Codable, Sendable {
    public let lat: Double
    public let lng: Double
    public let label: String?
}

public struct TrackingDetail: Codable, Sendable {
    public let trackingNo: String
    public let status: String
    public let carrierName: String?
    public let latestEvent: String?
    public let estimatedDelivery: String?
    public let actualDelivery: String?
    public let origin: TrackingAddress?
    public let destination: TrackingAddress?
    public let events: [TrackingEvent]

    enum CodingKeys: String, CodingKey {
        case trackingNo = "tracking_no"
        case status
        case carrierName = "carrier_name"
        case latestEvent = "latest_event"
        case estimatedDelivery = "estimated_delivery"
        case actualDelivery = "actual_delivery"
        case origin
        case destination
        case events
    }
}

public struct TrackingAddress: Codable, Sendable {
    public let fullName: String?
    public let city: String?
    public let countryCode: String?
    public let latitude: Double?
    public let longitude: Double?

    enum CodingKeys: String, CodingKey {
        case fullName = "full_name"
        case city
        case countryCode = "country_code"
        case latitude
        case longitude
    }
}

public struct TrackingListItem: Codable, Sendable {
    public let trackingNo: String
    public let status: String
    public let carrierName: String?
    public let latestEvent: String?
    public let updatedAt: String

    enum CodingKeys: String, CodingKey {
        case trackingNo = "tracking_no"
        case status
        case carrierName = "carrier_name"
        case latestEvent = "latest_event"
        case updatedAt = "updated_at"
    }
}

public struct TrackingListResponse: Codable, Sendable {
    public let data: [TrackingListItem]
    public let total: Int
    public let page: Int
    public let pageSize: Int

    enum CodingKeys: String, CodingKey {
        case data, total, page
        case pageSize = "page_size"
    }
}

// ============ Tracking Client ============

public class TrackingClient: HttpClient {
    public func detail(_ trackingNo: String) async throws -> TrackingDetail {
        return try await request("/api/v1/tracking/\(trackingNo)")
    }

    public func list(page: Int? = nil, pageSize: Int? = nil, status: String? = nil, trackingNo: String? = nil) async throws -> TrackingListResponse {
        let basePath = config.role == .carrier ? "/api/v1/carrier/tracking/list" : "/api/v1/merchant/tracking/list"
        let q = buildQuery(["page": page?.description, "page_size": pageSize?.description, "status": status, "tracking_no": trackingNo])
        return try await request("\(basePath)\(q)")
    }
}
