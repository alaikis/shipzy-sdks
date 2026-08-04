import XCTest
@testable import ShipzySDK

final class ShipzySDKTests: XCTestCase {
    func testVersion() {
        XCTAssertEqual(VERSION, "2.0.0")
    }

    func testShipzyConfigDefaults() {
        let config = ShipzyConfig()
        XCTAssertEqual(config.baseUrl, "https://api.shipzy.me")
        XCTAssertNil(config.token)
        XCTAssertEqual(config.timeout, 30)
        XCTAssertEqual(config.role, .merchant)
        XCTAssertNil(config.carrierCode)
    }

    func testShipzyClientInit() {
        let config = ShipzyConfig()
        let client = ShipzyClient(config: config)
        XCTAssertEqual(client.role, .merchant)
        XCTAssertTrue(client.isMerchant())
        XCTAssertFalse(client.isCarrier())
    }
}
