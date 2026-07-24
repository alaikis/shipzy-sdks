const std = @import("std");
const shipzy = @import("shipzy.zig");

test "ShipzyConfig defaults" {
    const config = shipzy.ShipzyConfig{};
    try std.expectEqualStrings("https://api.shipzy.me", config.base_url);
    try std.expectEqual(null, config.token);
    try std.expectEqual(@as(u64, 30), config.timeout_seconds);
}

test "EpodClient init with default config" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const config = shipzy.ShipzyConfig{};
    var client = shipzy.EpodClient.init(allocator, config);
    client.deinit();
}
