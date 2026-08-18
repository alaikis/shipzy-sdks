import Foundation

// ============ Finance Models ============

public struct Invoice: Codable, Sendable {
    public let id: String
    public let invoiceNumber: String?
    public let amount: Double?
    public let currency: String?
    public let status: String?
    public let description: String?
    public let createdAt: String?
    public let paidAt: String?
    public let downloadUrl: String?

    enum CodingKeys: String, CodingKey {
        case id
        case invoiceNumber = "invoice_number"
        case amount, currency, status, description
        case createdAt = "created_at"
        case paidAt = "paid_at"
        case downloadUrl = "download_url"
    }
}

public struct InvoiceListResponse: Codable, Sendable {
    public let data: [Invoice]
    public let total: Int?
}

public struct Subscription: Codable, Sendable {
    public let id: String
    public let status: String?
    public let plan: String?
    public let price: Double?
    public let currency: String?
    public let startDate: String?
    public let nextBillingDate: String?
    public let cancelAtPeriodEnd: Bool?
    public let createdAt: String?

    enum CodingKeys: String, CodingKey {
        case id, status, plan, price, currency
        case startDate = "start_date"
        case nextBillingDate = "next_billing_date"
        case cancelAtPeriodEnd = "cancel_at_period_end"
        case createdAt = "created_at"
    }
}

public struct SubscriptionListResponse: Codable, Sendable {
    public let data: [Subscription]
    public let total: Int?
}

// ============ Finance Client ============

public class FinanceClient: HttpClient {
    public func getInvoices() async throws -> InvoiceListResponse {
        return try await request("/api/v1/invoices")
    }

    public func listSubscriptions() async throws -> SubscriptionListResponse {
        return try await request("/api/v1/subscriptions")
    }

    public func cancelSubscription(_ id: String) async throws -> Subscription {
        return try await request("/api/v1/subscriptions/\(id)/cancel", method: "POST", body: Data())
    }

    public func restoreSubscription(_ id: String) async throws -> Subscription {
        return try await request("/api/v1/subscriptions/\(id)/restore", method: "POST", body: Data())
    }

    public func downloadInvoice(_ id: String) async throws -> Invoice {
        return try await request("/api/v1/invoices/\(id)/download")
    }
}