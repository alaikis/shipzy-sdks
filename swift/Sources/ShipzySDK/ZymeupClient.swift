import Foundation

// ============ Main SDK ============

public class ZymeupClient: @unchecked Sendable {
    public let epod: EpodClient
    public let order: OrderClient
    public let ecmr: EcmrClient
    public let merchantAddress: MerchantAddressClient
    public let activation: ActivationClient
    public let ageVerification: AgeVerificationClient
    public let pickupPoints: PickupPointClient
    public let product: ProductClient
    public let finance: FinanceClient
    public let notification: NotificationClient
    public let supportTicket: SupportTicketClient
    public let validation: ValidationClient
    public let role: UserRole
    private var config: ZymeupConfig

    public init(config: ZymeupConfig = ZymeupConfig()) {
        self.config = config
        self.role = config.role
        self.epod = EpodClient(config: config)
        self.order = OrderClient(config: config)
        self.ecmr = EcmrClient(config: config)
        self.merchantAddress = MerchantAddressClient(config: config)
        self.activation = ActivationClient(config: config)
        self.ageVerification = AgeVerificationClient(config: config)
        self.pickupPoints = PickupPointClient(config: config)
        self.product = ProductClient(config: config)
        self.finance = FinanceClient(config: config)
        self.notification = NotificationClient(config: config)
        self.supportTicket = SupportTicketClient(config: config)
        self.validation = ValidationClient(config: config)
    }

    public func updateToken(_ token: String) {
        self.config = ZymeupConfig(
            baseUrl: config.baseUrl,
            token: token,
            timeout: config.timeout,
            role: config.role,
            carrierCode: config.carrierCode
        )
        self.epod.setToken(token)
        self.order.setToken(token)
        self.ecmr.setToken(token)
        self.merchantAddress.setToken(token)
        self.activation.setToken(token)
        self.ageVerification.setToken(token)
        self.pickupPoints.setToken(token)
        self.product.setToken(token)
        self.finance.setToken(token)
        self.notification.setToken(token)
        self.supportTicket.setToken(token)
        self.validation.setToken(token)
    }

    public func isMerchant() -> Bool {
        return role == .merchant
    }

    public func isCarrier() -> Bool {
        return role == .carrier
    }
}
