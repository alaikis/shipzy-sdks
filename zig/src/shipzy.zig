const std = @import("std");
const Allocator = std.mem.Allocator;

pub const ShipzyConfig = struct {
    base_url: []const u8 = "https://api.shipzy.me",
    token: ?[]const u8 = null,
    timeout_seconds: u64 = 30,
};

pub const EpodListItem = struct {
    id: []const u8,
    tracking_no: []const u8,
    status: []const u8,
    recipient_name: ?[]const u8,
    created_at: []const u8,
};

pub const EpodListResponse = struct {
    data: []EpodListItem,
    total: i64,
    page: i32,
    page_size: i32,
};

pub const EpodDetail = struct {
    id: []const u8,
    tracking_no: []const u8,
    status: []const u8,
    recipient_name: ?[]const u8,
    recipient_phone: ?[]const u8,
    created_at: []const u8,
    updated_at: []const u8,
    sign_url: ?[]const u8,
    evidence_hash: ?[]const u8,
};

pub const SignUrlResponse = struct {
    sign_url: []const u8,
};

pub const ShipzyError = error{
    Unauthorized,
    HttpError,
    OutOfMemory,
    InvalidJson,
};

pub const EpodClient = struct {
    allocator: Allocator,
    config: ShipzyConfig,
    http_client: std.http.Client,

    pub fn init(allocator: Allocator, config: ShipzyConfig) EpodClient {
        return .{
            .allocator = allocator,
            .config = config,
            .http_client = std.http.Client{ .allocator = allocator },
        };
    }

    pub fn deinit(self: *EpodClient) void {
        self.http_client.deinit();
    }

    pub fn setToken(self: *EpodClient, token: []const u8) {
        self.config.token = token;
    }

    fn request(self: *EpodClient, path: []const u8, method: std.http.Method) !std.http.Client.Response {
        const url = try std.fmt.allocPrint(self.allocator, "{s}{s}", .{ self.config.base_url, path });
        defer self.allocator.free(url);

        var headers = std.http.Headers.init(self.allocator);
        defer headers.deinit();

        if (self.config.token) |token| {
            try headers.append("Authorization", try std.fmt.allocPrint(self.allocator, "Bearer {s}", .{token}));
        }
        try headers.append("Content-Type", "application/json");

        var req = try self.http_client.request(method, try std.Uri.parse(url), headers);
        defer req.deinit();

        try req.start();
        try req.wait();

        if (req.response.status == .unauthorized) return ShipzyError.Unauthorized;
        if (req.response.status != .ok) return ShipzyError.HttpError;

        return req.response;
    }

    pub fn list(self: *EpodClient, page: i32, page_size: i32) !void {
        const path = try std.fmt.allocPrint(self.allocator, "/api/v1/shipment/epod/list?page={d}&page_size={d}", .{ page, page_size });
        defer self.allocator.free(path);
        _ = try self.request(path, .GET);
    }

    pub fn get(self: *EpodClient, epod_id: []const u8) !void {
        const path = try std.fmt.allocPrint(self.allocator, "/api/v1/shipment/epod/{s}", .{epod_id});
        defer self.allocator.free(path);
        _ = try self.request(path, .GET);
    }

    pub fn generateSignUrl(self: *EpodClient, epod_id: []const u8) !void {
        const path = try std.fmt.allocPrint(self.allocator, "/api/v1/shipment/epod/{s}/sign", .{epod_id});
        defer self.allocator.free(path);
        _ = try self.request(path, .POST);
    }
};
