import Foundation

// ============ Validation Models ============

public struct PhoneVerifyResult: Codable, Sendable {
    public let valid: Bool
    public let formatted: String
    public let countryCode: String

    enum CodingKeys: String, CodingKey {
        case valid, formatted
        case countryCode = "country_code"
    }
}

public struct PhoneFormatResult: Codable, Sendable {
    public let formatted: String
}

public struct PostalCodeResult: Codable, Sendable {
    public let valid: Bool
    public let message: String
    public let source: String
}

public struct EmailValidationResult: Codable, Sendable {
    public let valid: Bool
    public let status: String
    public let message: String
    public let source: String
    public let formatted: String
}

public struct TaxIdValidationResult: Codable, Sendable {
    public let valid: Bool
    public let message: String
    public let source: String
}

// ============ Validation Client ============

public class ValidationClient: HttpClient {
    public func verifyPhone(_ countryCode: String, _ phone: String) async throws -> PhoneVerifyResult {
        let body = try JSONSerialization.data(withJSONObject: ["country_code": countryCode, "phone": phone])
        return try await request("/api/v1/validation/phone", method: "POST", body: body)
    }

    public func formatPhone(_ countryCode: String, _ phone: String) async throws -> PhoneFormatResult {
        let body = try JSONSerialization.data(withJSONObject: ["country_code": countryCode, "phone": phone])
        return try await request("/api/v1/validation/phone/format", method: "POST", body: body)
    }

    public func validatePostalCode(_ countryCode: String, _ code: String) async throws -> PostalCodeResult {
        let body = try JSONSerialization.data(withJSONObject: ["country_code": countryCode, "code": code])
        return try await request("/api/v1/validation/postal-code", method: "POST", body: body)
    }

    public func validateEmail(_ email: String) async throws -> EmailValidationResult {
        let body = try JSONSerialization.data(withJSONObject: ["email": email])
        return try await request("/api/v1/validation/email", method: "POST", body: body)
    }

    public func validateTaxId(_ countryCode: String, _ taxId: String) async throws -> TaxIdValidationResult {
        let body = try JSONSerialization.data(withJSONObject: ["country_code": countryCode, "tax_id": taxId])
        return try await request("/api/v1/validation/tax-id", method: "POST", body: body)
    }
}
