import Foundation

// ============ Main SDK ============

public class ShipzyClient: @unchecked Sendable {
    public let epod: EpodClient
    public let order: OrderClient
    public let role: UserRole
    private var config: ShipzyConfig

    public init(config: ShipzyConfig = ShipzyConfig()) {
        self.config = config
        self.role = config.role
        self.epod = EpodClient(config: config)
        self.order = OrderClient(config: config)
    }

    public func updateToken(_ token: String) {
        self.config = ShipzyConfig(
            baseUrl: config.baseUrl,
            token: token,
            timeout: config.timeout,
            role: config.role,
            carrierCode: config.carrierCode
        )
        self.epod.setToken(token)
        self.order.setToken(token)
    }

    public func isMerchant() -> Bool {
        return role == .merchant
    }

    public func isCarrier() -> Bool {
        return role == .carrier
    }
}
