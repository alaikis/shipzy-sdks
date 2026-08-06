import Foundation

// ============ Carrier Address Client ============

public class CarrierAddressClient: HttpClient {
    public func list(_ params: [String: Any] = [:]) async throws -> TenantAddressListResponse {
        let body = try JSONSerialization.data(withJSONObject: params)
        return try await request("/api/v1/carrier/sdk/addresses/list", method: "POST", body: body)
    }

    public func create(_ data: [String: Any]) async throws -> TenantAddress {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/carrier/sdk/addresses/create", method: "POST", body: body)
    }

    public func update(_ id: String, _ data: [String: Any]) async throws -> TenantAddress {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/carrier/sdk/addresses/\(id)/update", method: "POST", body: body)
    }

    public func delete(_ id: String) async throws -> [String: Bool] {
        return try await request("/api/v1/carrier/sdk/addresses/\(id)/delete", method: "POST", body: Data())
    }

    public func setDefault(_ id: String) async throws -> TenantAddress {
        return try await request("/api/v1/carrier/sdk/addresses/\(id)/set-default", method: "POST", body: Data())
    }
}
