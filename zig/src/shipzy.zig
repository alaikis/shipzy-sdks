const std = @import("std");
const Allocator = std.mem.Allocator;

pub const VERSION = "1.1.1";

pub const UserRole = enum { merchant, carrier };

pub const ShipzyConfig = struct {
    base_url: []const u8 = "https://api.shipzy.me",
    token: ?[]const u8 = null,
    timeout_seconds: u64 = 30,
    role: UserRole = .merchant,
    carrier_code: ?[]const u8 = null,
};

pub const EpodListItem = struct { id: []const u8, tracking_no: []const u8, status: []const u8, recipient_name: ?[]const u8, created_at: []const u8 };
pub const EpodListResponse = struct { data: []EpodListItem, total: i64, page: i32, page_size: i32 };
pub const EpodDetail = struct { id: []const u8, tracking_no: []const u8, status: []const u8, recipient_name: ?[]const u8, recipient_phone: ?[]const u8, created_at: []const u8, updated_at: []const u8, sign_url: ?[]const u8, evidence_hash: ?[]const u8 };
pub const SignUrlResponse = struct { sign_url: []const u8 };

pub const ShipzyError = error{ Unauthorized, HttpError, OutOfMemory, InvalidJson };

pub const EpodClient = struct {
    allocator: Allocator,
    config: ShipzyConfig,
    http_client: std.http.Client,

    pub fn init(allocator: Allocator, config: ShipzyConfig) EpodClient {
        return .{ .allocator = allocator, .config = config, .http_client = std.http.Client{ .allocator = allocator } };
    }
    pub fn deinit(self: *EpodClient) void { self.http_client.deinit(); }
    pub fn setToken(self: *EpodClient, token: []const u8) { self.config.token = token; }
};

pub const OrderClient = struct {
    allocator: Allocator,
    config: ShipzyConfig,
    http_client: std.http.Client,
    pub fn init(allocator: Allocator, config: ShipzyConfig) OrderClient { return .{ .allocator = allocator, .config = config, .http_client = std.http.Client{ .allocator = allocator } }; }
    pub fn deinit(self: *OrderClient) void { self.http_client.deinit(); }
    pub fn setToken(self: *OrderClient, token: []const u8) { self.config.token = token; }
};

pub const AddressClient = struct {
    allocator: Allocator,
    config: ShipzyConfig,
    http_client: std.http.Client,
    pub fn init(allocator: Allocator, config: ShipzyConfig) AddressClient { return .{ .allocator = allocator, .config = config, .http_client = std.http.Client{ .allocator = allocator } }; }
    pub fn deinit(self: *AddressClient) void { self.http_client.deinit(); }
    pub fn setToken(self: *AddressClient, token: []const u8) { self.config.token = token; }
};

pub const CarrierEpodClient = struct {
    allocator: Allocator,
    config: ShipzyConfig,
    http_client: std.http.Client,
    pub fn init(allocator: Allocator, config: ShipzyConfig) CarrierEpodClient { return .{ .allocator = allocator, .config = config, .http_client = std.http.Client{ .allocator = allocator } }; }
    pub fn deinit(self: *CarrierEpodClient) void { self.http_client.deinit(); }
    pub fn setToken(self: *CarrierEpodClient, token: []const u8) { self.config.token = token; }
};

pub const ShipzyClient = struct {
    epod: EpodClient,
    order: OrderClient,
    address: AddressClient,
    carrier_epod: CarrierEpodClient,
    role: UserRole,

    pub fn init(allocator: Allocator, config: ShipzyConfig) ShipzyClient {
        return .{
            .epod = EpodClient.init(allocator, config),
            .order = OrderClient.init(allocator, config),
            .address = AddressClient.init(allocator, config),
            .carrier_epod = CarrierEpodClient.init(allocator, config),
            .role = config.role,
        };
    }
    pub fn deinit(self: *ShipzyClient) void {
        self.epod.deinit(); self.order.deinit(); self.address.deinit(); self.carrier_epod.deinit();
    }
    pub fn updateToken(self: *ShipzyClient, token: []const u8) {
        self.epod.setToken(token); self.order.setToken(token); self.address.setToken(token); self.carrier_epod.setToken(token);
    }
};

test "ShipzyConfig defaults" {
    const config = ShipzyConfig{};
    try std.expectEqualStrings("https://api.shipzy.me", config.base_url);
    try std.expectEqual(null, config.token);
    try std.expectEqual(@as(u64, 30), config.timeout_seconds);
}

test "ShipzyClient init" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    const config = ShipzyConfig{};
    var client = ShipzyClient.init(allocator, config);
    client.deinit();
}
