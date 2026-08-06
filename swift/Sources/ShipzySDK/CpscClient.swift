import Foundation

// ============ CPSC Models ============

public struct CPSCSettings: Codable, Sendable {
    public let certifierId: String
    public let collectionId: String
    public let isProduction: Bool
    public let status: String?
    public let tokenExpiresAt: String?
    public let lastVerifiedAt: String?
}

// ============ CPSC Client ============

public class CpscClient: HttpClient {
    public func settings() async throws -> CPSCSettings {
        return try await request("/api/v1/cpsc/collections")
    }

    public func credential() async throws -> [String: Any] {
        return try await request("/api/v1/cpsc/credential")
    }

    public func saveCredential(_ data: [String: Any]) async throws -> [String: Any] {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/cpsc/credential", method: "POST", body: body)
    }

    public func importData(_ data: [String: Any]) async throws -> [String: Any] {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/cpsc/import", method: "POST", body: body)
    }

    public func importStatus(_ importId: String) async throws -> [String: Any] {
        return try await request("/api/v1/cpsc/import/\(importId)/status")
    }

    public func importLog(_ importId: String, errorsOnly: Bool = false) async throws -> [String: Any] {
        let q = buildQuery(["errorsOnly": errorsOnly ? "true" : "false"])
        return try await request("/api/v1/cpsc/import/\(importId)/log\(q)")
    }

    public func exportData(_ filter: [String: Any] = [:]) async throws -> [String: Any] {
        let q = buildQuery(filter)
        return try await request("/api/v1/cpsc/export\(q)")
    }

    public func exportAsync(_ filter: [String: Any] = [:]) async throws -> [String: Any] {
        let q = buildQuery(filter)
        return try await request("/api/v1/cpsc/export-async\(q)")
    }

    public func exportAsyncStatus(_ exportId: String) async throws -> [String: Any] {
        return try await request("/api/v1/cpsc/export-async/\(exportId)/status")
    }

    public func exportAsyncData(_ exportId: String) async throws -> [String: Any] {
        return try await request("/api/v1/cpsc/export-async/\(exportId)/data")
    }

    public func certificates(_ data: [String: Any]) async throws -> [String: Any] {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/cpsc/certificates", method: "POST", body: body)
    }

    public func tradeParties(partyType: String? = nil) async throws -> [String: Any] {
        let q = partyType != nil ? "?tradePartyType=\(partyType!)" : ""
        return try await request("/api/v1/cpsc/trade-parties\(q)")
    }

    public func tokenExpiration() async throws -> [String: Any] {
        return try await request("/api/v1/cpsc/token-expiration")
    }
}
