const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const root_module = b.createModule(.{
        .root_source_file = b.path("src/shipzy.zig"),
        .target = target,
        .optimize = optimize,
    });

    const exe = b.addExecutable(.{
        .name = "shipzy-sdk",
        .root_module = root_module,
    });

    b.installArtifact(exe);

    const test_module = b.createModule(.{
        .root_source_file = b.path("src/shipzy.zig"),
        .target = target,
        .optimize = optimize,
    });

    const main_tests = b.addTest(.{
        .root_module = test_module,
    });

    const run_main_tests = b.addRunArtifact(main_tests);
    const test_step = b.step("test", "Run SDK tests");
    test_step.dependOn(&run_main_tests.step);
}