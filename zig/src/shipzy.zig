const std = @import("std");
const Allocator = std.mem.Allocator;

pub const VERSION = "2.0.2";

pub const ShipzyConfig = struct {
    base_url: []const u8 = "https://api.zymeup.com/api/v1",
    token: ?[]const u8 = null,
    timeout_seconds: u64 = 30,
};

pub const ShipzyError = error{
    Unauthorized,
    HttpError,
    OutOfMemory,
    InvalidJson,
};

pub const ShipzyClient = struct {
    allocator: Allocator,
    config: ShipzyConfig,
    http_client: std.http.Client,

    pub fn init(allocator: Allocator, config: ShipzyConfig) ShipzyClient {
        return .{
            .allocator = allocator,
            .config = config,
            .http_client = std.http.Client{ .allocator = allocator },
        };
    }

    pub fn deinit(self: *ShipzyClient) void {
        self.http_client.deinit();
    }

    pub fn setToken(self: *ShipzyClient, token: []const u8) void {
        self.config.token = token;
    }

    fn request(self: *ShipzyClient, method: std.http.Method, path: []const u8, body: ?[]const u8) !std.http.Client.FetchResult {
        var url = std.ArrayList(u8).init(self.allocator);
        defer url.deinit();
        try url.appendSlice(self.config.base_url);
        try url.appendSlice(path);

        var headers = std.http.Headers{ .allocator = self.allocator };
        defer headers.deinit();

        if (self.config.token) |token| {
            const auth = try std.fmt.allocPrint(self.allocator, "Bearer {s}", .{token});
            defer self.allocator.free(auth);
            try headers.append("Authorization", auth);
        }
        try headers.append("Content-Type", "application/json");
        try headers.append("User-Agent", "zymeup-sdk-zig/" ++ VERSION);

        const result = try self.http_client.fetch(.{
            .method = method,
            .location = .{ .url = url.items },
            .headers = headers,
            .payload = body,
            .connect_timeout_ms = self.config.timeout_seconds * 1000,
        });
        if (result.status == .unauthorized) return ShipzyError.Unauthorized;
        if (@intFromEnum(result.status) >= 400) return ShipzyError.HttpError;
        return result;
    }

    fn get(self: *ShipzyClient, path: []const u8) ![]const u8 {
        const result = try self.request(.GET, path, null);
        defer result.deinit();
        return try result.reader().readAllAlloc(self.allocator, std.math.maxInt(usize));
    }

    fn post(self: *ShipzyClient, path: []const u8, body: ?[]const u8) ![]const u8 {
        const result = try self.request(.POST, path, body);
        defer result.deinit();
        return try result.reader().readAllAlloc(self.allocator, std.math.maxInt(usize));
    }

    fn put(self: *ShipzyClient, path: []const u8, body: ?[]const u8) ![]const u8 {
        const result = try self.request(.PUT, path, body);
        defer result.deinit();
        return try result.reader().readAllAlloc(self.allocator, std.math.maxInt(usize));
    }

    fn del(self: *ShipzyClient, path: []const u8) ![]const u8 {
        const result = try self.request(.DELETE, path, null);
        defer result.deinit();
        return try result.reader().readAllAlloc(self.allocator, std.math.maxInt(usize));
    }

    pub fn carrierList(self: *ShipzyClient, page: u32, page_size: u32) ![]const u8 {
        const path = try std.fmt.allocPrint(self.allocator, "/carrier/list?page={d}&page_size={d}", .{ page, page_size });
        defer self.allocator.free(path);
        return self.get(path);
    }

    pub fn trackingList(self: *ShipzyClient, page: u32, page_size: u32) ![]const u8 {
        const path = try std.fmt.allocPrint(self.allocator, "/merchant/tracking/list?page={d}&page_size={d}", .{ page, page_size });
        defer self.allocator.free(path);
        return self.get(path);
    }

    pub fn ecmrList(self: *ShipzyClient, page: u32, page_size: u32) ![]const u8 {
        const path = try std.fmt.allocPrint(self.allocator, "/shipment/ecmr/list?page={d}&page_size={d}", .{ page, page_size });
        defer self.allocator.free(path);
        return self.get(path);
    }

    pub fn ecmrDetail(self: *ShipzyClient, id: []const u8) ![]const u8 {
        const path = try std.fmt.allocPrint(self.allocator, "/shipment/ecmr/{s}", .{id});
        defer self.allocator.free(path);
        return self.get(path);
    }

    pub fn epodList(self: *ShipzyClient, page: u32, page_size: u32) ![]const u8 {
        const path = try std.fmt.allocPrint(self.allocator, "/shipment/epod/list?page={d}&page_size={d}", .{ page, page_size });
        defer self.allocator.free(path);
        return self.get(path);
    }

    pub fn orderList(self: *ShipzyClient, page: u32, page_size: u32) ![]const u8 {
        const path = try std.fmt.allocPrint(self.allocator, "/order/list?page={d}&page_size={d}", .{ page, page_size });
        defer self.allocator.free(path);
        return self.get(path);
    }
};

test "ShipzyConfig defaults" {
    const config = ShipzyConfig{};
    try std.testing.expectEqualStrings("https://api.zymeup.com/api/v1", config.base_url);
    try std.testing.expectEqual(@as(?[]const u8, null), config.token);
    try std.testing.expectEqual(@as(u64, 30), config.timeout_seconds);
}

test "ShipzyClient init" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();
    const config = ShipzyConfig{};
    var client = ShipzyClient.init(allocator, config);
    client.deinit();
}
