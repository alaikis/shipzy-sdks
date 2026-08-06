import Foundation

// ============ Carrier EPOD Client ============

public class CarrierEpodClient: HttpClient {
    public func list(page: Int? = nil, pageSize: Int? = nil, status: String? = nil) async throws -> EpodListResponse {
        let q = buildQuery(["page": page?.description, "page_size": pageSize?.description, "status": status])
        return try await request("/api/v1/carrier/epod/list\(q)")
    }

    public func get(_ id: String) async throws -> EpodDetail {
        return try await request("/api/v1/carrier/epod/\(id)")
    }

    public func deliver(_ id: String, data: [String: Any] = [:]) async throws -> EpodDetail {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/carrier/epod/\(id)/delivery", method: "POST", body: body)
    }

    public func fail(_ id: String, remark: String) async throws -> EpodDetail {
        let body = try JSONSerialization.data(withJSONObject: ["remark": remark])
        return try await request("/api/v1/carrier/epod/\(id)/fail", method: "POST", body: body)
    }

    public func captureProof(_ id: String, _ data: [String: Any]) async throws -> EpodDetail {
        let body = try JSONSerialization.data(withJSONObject: data)
        return try await request("/api/v1/carrier/epod/\(id)/capture-proof", method: "POST", body: body)
    }

    public func uploadPhoto(_ id: String, photoUrl: String) async throws -> EpodDetail {
        let body = try JSONSerialization.data(withJSONObject: ["photo_url": photoUrl])
        return try await request("/api/v1/carrier/epod/\(id)/photo", method: "POST", body: body)
    }
}
