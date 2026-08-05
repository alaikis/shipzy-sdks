import Foundation

// ============ Version ============

public let VERSION = "2.0.2"

// ============ Config ============

public struct ZymeupConfig: Sendable {
    public let baseUrl: String
    public let token: String?
    public let timeout: TimeInterval
    public let role: UserRole
    public let carrierCode: String?

    public init(
        baseUrl: String = "https://api.zymeup.com",
        token: String? = nil,
        timeout: TimeInterval = 30,
        role: UserRole = .merchant,
        carrierCode: String? = nil
    ) {
        self.baseUrl = baseUrl
        self.token = token
        self.timeout = timeout
        self.role = role
        self.carrierCode = carrierCode
    }
}

// ============ User Role ============

public enum UserRole: String, Sendable {
    case merchant
    case carrier
}

// ============ Errors ============

public struct ZymeupError: Error, Sendable, CustomStringConvertible {
    public let message: String
    public let statusCode: Int

    public var description: String {
        "[\(statusCode)] \(message)"
    }
}

public struct ZymeupAuthError: Error, Sendable, CustomStringConvertible {
    public let message: String

    public var description: String {
        "[401] \(message)"
    }
}
