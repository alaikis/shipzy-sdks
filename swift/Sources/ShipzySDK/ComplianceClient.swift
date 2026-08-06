import Foundation

// ============ Compliance Models ============

public struct ComplianceCheckResult: Codable, Sendable {
    public let compliant: Bool
    public let restrictions: [Restriction]
    public let requiredDocuments: [String]
    public let tips: [String]
}

public struct Restriction: Codable, Sendable {
    public let type: String
    public let item: String
    public let message: String
}

public struct CountryRequirements: Codable, Sendable {
    public let countryCode: String
    public let restrictions: [String]
    public let requiredDocuments: [DocumentRequirement]
    public let notes: String
}

public struct DocumentRequirement: Codable, Sendable {
    public let type: String
    public let description: String
    public let required: Bool
}

// ============ Compliance Client ============

public class ComplianceClient: HttpClient {
    public func check(_ data: [String: Any]) async throws -> ComplianceCheckResult {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/compliance/check", method: "POST", body: body)
    }

    public func countryRequirements(_ countryCode: String) async throws -> CountryRequirements {
        return try await request("/api/v1/compliance/requirements/\(countryCode)")
    }

    public func validateHsCode(_ hsCode: String) async throws -> [String: Any] {
        return try await request("/api/v1/compliance/hscode/\(hsCode)/validate")
    }

    public func prohibitedItems() async throws -> [String: Any] {
        return try await request("/api/v1/compliance/prohibited")
    }

    public func createCustoms(_ data: [String: Any]) async throws -> [String: Any] {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/compliance/customs", method: "POST", body: body)
    }

    public func getCustoms(_ id: String) async throws -> [String: Any] {
        return try await request("/api/v1/compliance/customs/\(id)")
    }
}
