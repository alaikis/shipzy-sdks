import Foundation

// ============ Upload Client ============

public class UploadClient: HttpClient {
    public func uploadFile(endpoint: String, data: Data, filename: String) async throws -> [String: Any] {
        guard let url = URL(string: config.baseUrl.trimmingCharacters(in: CharacterSet(charactersIn: "/")) + endpoint) else {
            throw ZymeupError(message: "Invalid URL", statusCode: 0)
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.timeoutInterval = config.timeout

        let boundary = "----SwiftSDKBoundary\(UUID().uuidString)"
        urlRequest.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

        if let token = config.token {
            urlRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        var body = Data()
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"file\"; filename=\"\(filename)\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: application/octet-stream\r\n\r\n".data(using: .utf8)!)
        body.append(data)
        body.append("\r\n--\(boundary)--\r\n".data(using: .utf8)!)

        urlRequest.httpBody = body

        let (responseData, response) = try await session.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw ZymeupError(message: "Invalid response", statusCode: 0)
        }

        if httpResponse.statusCode == 401 {
            throw ZymeupAuthError(message: "Unauthorized")
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            let errorMessage = String(data: responseData, encoding: .utf8) ?? "HTTP \(httpResponse.statusCode)"
            throw ZymeupError(message: errorMessage, statusCode: httpResponse.statusCode)
        }

        return try JSONSerialization.jsonObject(with: responseData, options: []) as? [String: Any] ?? [:]
    }

    public func brandingUploadLogo(data: Data, filename: String = "logo.png") async throws -> [String: Any] {
        return try await uploadFile(endpoint: "/api/v1/merchant/branding/logo", data: data, filename: filename)
    }
}
