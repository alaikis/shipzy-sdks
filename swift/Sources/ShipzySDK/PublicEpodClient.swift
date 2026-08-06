import Foundation

// ============ Public EPOD Models ============

public struct PublicSignDetail: Codable, Sendable {
    public let trackingNo: String
    public let recipientName: String
    public let deliveryAddressSummary: String
    public let destinationCountryCode: String
    public let policyUrl: String
    public let policyVersionHash: String
    public let signatureLevelRequired: String
    public let allowedProofTypes: [String]
    public let signatureWaived: Bool
    public let expiresAt: String
}

public struct PublicConsentResponse: Codable, Sendable {
    public let consentId: String
    public let policyVersionHash: String
}

public struct PublicCaptureResponse: Codable, Sendable {
    public let evidenceHash: String
    public let status: String
    public let hashLocked: Bool
}

// ============ Public EPOD Client (no auth required) ============

public class PublicEpodClient {
    private let baseUrl: String

    public init(baseUrl: String = "https://api.zymeup.com") {
        self.baseUrl = baseUrl.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
    }

    public func getSignDetail(_ signToken: String) async throws -> PublicSignDetail {
        guard let url = URL(string: "\(baseUrl)/api/v1/open/epod/sign/\(signToken)") else {
            throw ZymeupError(message: "Invalid URL", statusCode: 0)
        }
        let (data, response) = try await URLSession.shared.data(from: url)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw ZymeupError(message: "HTTP error", statusCode: 400)
        }
        return try JSONDecoder().decode(PublicSignDetail.self, from: data)
    }

    public func consent(_ signToken: String, consentTypes: [String], policyVersionHash: String) async throws -> PublicConsentResponse {
        guard let url = URL(string: "\(baseUrl)/api/v1/open/epod/sign/\(signToken)/consent") else {
            throw ZymeupError(message: "Invalid URL", statusCode: 0)
        }
        let body = try JSONSerialization.data(withJSONObject: ["consent_types": consentTypes, "policy_version_hash": policyVersionHash])
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = body
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw ZymeupError(message: "HTTP error", statusCode: 400)
        }
        return try JSONDecoder().decode(PublicConsentResponse.self, from: data)
    }

    public func capture(_ signToken: String, consentId: String, signatureData: String, proofType: String = "signature") async throws -> PublicCaptureResponse {
        guard let url = URL(string: "\(baseUrl)/api/v1/open/epod/sign/\(signToken)/capture") else {
            throw ZymeupError(message: "Invalid URL", statusCode: 0)
        }
        let body = try JSONSerialization.data(withJSONObject: ["consent_id": consentId, "signature_data": signatureData, "proof_type": proofType])
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = body
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw ZymeupError(message: "HTTP error", statusCode: 400)
        }
        return try JSONDecoder().decode(PublicCaptureResponse.self, from: data)
    }
}
