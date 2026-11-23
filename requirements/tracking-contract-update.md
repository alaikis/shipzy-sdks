# Tracking Contract Update — 交接文档（shipzy-sdks）

> 任务：SDK 跟踪契约对齐主仓 `non-api-carrier-tracking`（EMS/EUB/国内主流非 API 承运商抓取链路），新增向后兼容可选字段。
> change：`openspec/changes/tracking-contract-update`（phase: build → verify ✅）

## 1. 交付内容

| 项 | 状态 | 说明 |
|---|---|---|
| Go `go/tms/tracking.go` | ✅ build 通过 | `TrackingResult`/`TrackingEvent` 新增 4 可选字段；`TrackingListItem` 新增 3 可选字段（omitempty） |
| Node/TS `node/src/tracking.ts` | ✅ tsc --noEmit 通过 | `TrackingDetail`/`TrackingEvent` 新增 4 可选字段；`TrackingListItem` 新增 3（`?` 可选） |
| Rust `rust/src/tracking.rs` | ✅ cargo check --offline 通过 | 同 Node 模型，`Option<String>` + serde rename |
| .NET `dotnet/src/Shipzy/Models/TrackingModels.cs` | ✅ dotnet build 通过（0 错误） | `TrackingDetail`/`TrackingEvent` +4、`TrackingListItem` +3（string 可空，JsonPropertyName） |
| Swift `swift/Sources/ShipzySDK/TrackingClient.swift` | ⏳ **待编译验证** | 已按 Codable 增加可选属性与 CodingKeys；Windows 无 Swift 工具链，需在 macOS/CI 编译确认 |
| Python `python/zymeup_sdk/tracking.py` | ✅ py_compile 通过 | dict 透传；get/list docstring 补充字段说明 |
| PHP `php/src/TrackingClient.php` | ✅ php -l 通过 | array 透传；get docblock 补充说明 |
| Ruby `ruby/lib/zymeup.rb` | ✅ ruby -c 通过 | Hash 透传；detail/list 注释补充说明 |
| `README.md` | ✅ | 新增 "Tracking — Non-API Carriers (Scrape Sources)" 字段表与兼容说明 |
| `CHANGELOG.md` | ⚠️ 已更新未提交 | 追加"未发布"条目；**文件本身为仓库遗留未跟踪文件**，本次修改在工作区，未纳入本次 commit（避免整文件历史入库），建议后续随发版流程整体纳入版本库 |
| `openspec/changes/tracking-contract-update/` | ✅ | proposal / design / tasks / .impetus.yaml（phase=verify, passed） |

## 2. 契约定义（新增可选字段）

| 字段 | 类型 | 取值 | 模型位置 |
|---|---|---|---|
| `data_source` | string | `api` \| `scrape` | TrackingDetail/Result、TrackingEvent、TrackingListItem |
| `last_scrape_at` | string | ISO 8601 | TrackingDetail/Result、TrackingEvent、TrackingListItem |
| `scrape_status` | string | `ok` \| `throttled` \| `cooldown` \| `blocked` \| `aggregator_fallback` | TrackingDetail/Result、TrackingEvent、TrackingListItem |
| `raw_status_text` | string | 承运商原始状态文本（SDK 侧补充字段） | TrackingDetail/Result、TrackingEvent |

- 所有字段可选；服务端缺省不返回；既有字段与签名完全不变 → 向后兼容，旧服务端响应新 SDK 可正常解析。
- Java / Kotlin / Zig：仓库无 tracking 契约模块，不涉及。

## 3. 验证记录

- Go `build ./...` EXIT=0；Node `tsc --noEmit` EXIT=0；Rust `cargo check --offline` Finished（2m33s）；.NET `dotnet build` 0 错误；Python/PHP/Ruby 语法检查通过。
- **待编译验证**：Swift（无本地工具链）；建议 CI 或 macOS 环境执行 `swift build` 复核。
- .NET build 输出存在全仓既有 nullable warnings（CS8618/CS8625，非本次引入）。

## 4. 跨仓依赖标注

| 仓库 | change / 状态 | 依赖关系 |
|---|---|---|
| `api.shipzy.me` | `non-api-carrier-tracking`（design.md §3.5/§3.6/§3.7，推送 468725f） | 上游契约来源；公开 API 返回可选字段，SDK 缺省可空对齐 |
| `carrier-progress-model` | `DataSource` 枚举（76550ca/ce96025） | 枚举取值来源（api/non-api/aggregator_fallback）；SDK 以主仓 `api\|scrape` 为基准 |
| `me.shipzy.falcon` | 双通道抓取与聚合器备援（5ca0cc7） | 生产 `scrape_status`/`last_scrape_at` 数据 |
| `user.shipzy.me` | `tracking-source-indicator`（推送 28f8baa） | 下游消费 SDK/API 字段做来源标识与降级提示展示 |

## 5. 遗留 / 后续

- Swift 编译验证待环境补齐后回填。
- `CHANGELOG.md`/`AGENTS.md` 为仓库遗留未跟踪文件，未纳入本次 commit。
- 版本号未变更（顶层 `VERSION=2.0.2`；node 2.1.5 / epod-elements 1.1.1 漂移维持）——发版动作等待架构决策后单独执行。
- archive 阶段：等主仓与消费仓（falcon / 前端）契约同步验证后按 /impetus 归档。
