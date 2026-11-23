# Tracking Contract Update — Tasks（build 阶段）

## 阶段：build

- [x] 创建 openspec change 目录（proposal.md / design.md / tasks.md / .impetus.yaml）
- [x] Go：`go/tms/tracking.go` 新增可选字段（TrackingResult / TrackingEvent / TrackingListItem）
- [x] Node/TS：`node/src/tracking.ts` 新增可选字段（TrackingDetail / TrackingEvent / TrackingListItem）
- [x] Rust：`rust/src/tracking.rs` 新增可选字段（TrackingDetail / TrackingEvent / TrackingListItem）
- [x] .NET：`dotnet/src/Shipzy/Models/TrackingModels.cs` 新增可选字段
- [x] Swift：`swift/Sources/ShipzySDK/TrackingClient.swift` 新增可选字段
- [x] Python / PHP / Ruby：docstring / docblock / 注释补充字段说明（动态透传）
- [x] 根 `CHANGELOG.md` 追加未发布条目（版本号不动）
- [x] `README.md` 补充"非 API 承运商"说明与支持矩阵
- [x] 静态核查 + 编译/语法验证（各语言按能力执行；Swift 待编译验证）
- [x] 更新 `.impetus.yaml`：build → verify（mv 覆盖问题手动推进）
- [x] 提交并推送 origin main

## 阶段：verify

- [x] 静态核查通过：字段全可选、方法签名不变、既有调用方零影响；编译验证：Go build ✅ / Node tsc --noEmit ✅ / Rust cargo check --offline ✅ / .NET dotnet build ✅（0 错误）/ Python py_compile ✅ / PHP php -l ✅ / Ruby ruby -c ✅；Swift 在 Windows 无工具链 → **待编译验证**（标注交接）。
- [x] `.impetus.yaml` 手动推进至 verify 并通过 guard（9/9 检查项核对）
- [x] 产出 `requirements/` 交接文档，标注跨仓依赖（主仓 / falcon / carrier-progress-model / user.shipzy.me）

## 阶段：archive（后续）

- [ ] 按 /impetus 归档 change（等主仓与消费仓同步后执行）
