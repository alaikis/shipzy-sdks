// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "ShipzySDK",
    platforms: [
        .iOS(.v15),
        .macOS(.v12),
    ],
    products: [
        .library(
            name: "ShipzySDK",
            targets: ["ShipzySDK"]
        ),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "ShipzySDK",
            dependencies: []
        ),
        .testTarget(
            name: "ShipzySDKTests",
            dependencies: ["ShipzySDK"]
        ),
    ]
)
