import Foundation

// ============ HTTP Client Base ============

public class HttpClient: @unchecked Sendable {
    protected var config: ShipzyConfig
    private let session: URLSession

    public init(config: ShipzyConfig = ShipzyConfig()) {
        self.config = config
        self.session = URLSession(configuration: .default)
    }

    public func setToken(_ token: String) {
        self.config = ShipzyConfig(
            baseUrl: config.baseUrl,
            token: token,
            timeout: config.timeout,
            role: config.role,
            carrierCode: config.carrierCode
        )
    }

    private func getAuthHeader() -> String {
        if config.role == .carrier, let carrierCode = config.carrierCode, let token = config.token {
            return "Bearer \(carrierCode):\(token)"
        }
        return "Bearer \(config.token ?? "")"
    }

    protected func request<T: Decodable & Sendable>(
        _ path: String,
        method: String = "GET",
        body: Data? = nil
    ) async throws -> T {
        guard let url = URL(string: config.baseUrl.trimmingCharacters(in: CharacterSet(charactersIn: "/")) + path) else {
            throw ShipzyError(message: "Invalid URL", statusCode: 0)
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = method
        urlRequest.timeoutInterval = config.timeout
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let token = config.token {
            urlRequest.setValue(getAuthHeader(), forHTTPHeaderField: "Authorization")
        }

        if let body = body {
            urlRequest.httpBody = body
        }

        let (data, response) = try await session.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw ShipzyError(message: "Invalid response", statusCode: 0)
        }

        if httpResponse.statusCode == 401 {
            throw ShipzyAuthError(message: "Unauthorized")
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            let errorMessage = String(data: data, encoding: .utf8) ?? "HTTP \(httpResponse.statusCode)"
            throw ShipzyError(message: errorMessage, statusCode: httpResponse.statusCode)
        }

        return try JSONDecoder().decode(T.self, from: data)
    }

    protected func buildQuery(_ params: [String: String?]) -> String {
        let parts = params.compactMap { key, value -> String? in
            guard let value = value else { return nil }
            return "\(key.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? key)=\(value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? value)"
        }
        return parts.isEmpty ? "" : "?" + parts.joined(separator: "&")
    }
}
