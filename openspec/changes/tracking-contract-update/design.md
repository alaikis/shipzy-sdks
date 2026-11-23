# Tracking Contract Update — Design（shipzy-sdks）

> 本 change 为子仓协同 change，主仓锚点为 `api.shipzy.me` 的 `openspec/changes/non-api-carrier-tracking/design.md`（§3.5 后端契约、§3.6 SDK 契约、§5 多仓协同拆分）。本文件只定义 shipzy-sdks 侧的契约落地。

## 1. 字段定义

主仓公开 API（`trackings` 详情与列表响应）新增可选字段，SDK 契约同步增加，**服务端缺省不返回，SDK 必须可空**：

| 字段 | 类型 | 取值 / 说明 |
|---|---|---|
| `data_source` | string | `api`（API 聚合）\| `scrape`（官网/接口抓取） |
| `last_scrape_at` | string | 最近一次抓取时间（ISO 8601）；API 来源可不返回 |
| `scrape_status` | string | `ok` \| `throttled` \| `cooldown` \| `blocked` \| `aggregator_fallback` |
| `raw_status_text` | string | 承运商原始状态文本（SDK 侧补充字段，主仓未强制；用于展示原文/调试） |

## 2. 落点（按语言）

### 2.1 强类型语言 — 新增可选字段

统一规则：
- `TrackingDetail` / `TrackingResult`（详情）：新增全部 4 个可选字段。
- `TrackingEvent`（事件）：新增全部 4 个可选字段（抓取源事件可携带来源与原始文本）。
- `TrackingListItem`（列表项）：新增 `data_source` / `last_scrape_at` / `scrape_status` 3 个可选字段（列表契约对应主仓 §3.5 列表响应；不含 `raw_status_text`）。

| 语言 | 文件 | 模型 |
|---|---|---|
| Go | `go/tms/tracking.go` | `TrackingResult`（详情）、`TrackingEvent`、`TrackingListItem` |
| Node/TS | `node/src/tracking.ts` | `TrackingDetail`、`TrackingEvent`、`TrackingListItem` |
| Rust | `rust/src/tracking.rs` | `TrackingDetail`、`TrackingEvent`、`TrackingListItem` |
| .NET | `dotnet/src/Shipzy/Models/TrackingModels.cs` | `TrackingDetail`、`TrackingEvent`、`TrackingListItem` |
| Swift | `swift/Sources/ShipzySDK/TrackingClient.swift` | `TrackingDetail`、`TrackingEvent`、`TrackingListItem` |

### 2.2 动态语言 — 自动透传 + 注释说明

- Python（`python/zymeup_sdk/tracking.py`）：返回 `Dict[str, Any]`，新增字段随响应自动透传；在 `get`/`list` docstring 补充字段说明。
- PHP（`php/src/TrackingClient.php`）：返回 `array`，自动透传；`get`/`list` docblock 补充说明。
- Ruby（`ruby/lib/zymeup.rb`）：返回 `Hash`，自动透传；`detail`/`list` 注释补充说明。

### 2.3 不涉及

- Java / Kotlin / Zig：仓库内无 tracking 契约模块（kotlin 仅有构建产物残留，源码无 TrackingClient），本次不动。
- 所有语言的方法签名、URL、既有字段一律不变；无任何破坏性变更。

## 3. 版本与文档

- 顶层 `VERSION`（2.0.2）与任意语言包版本号**禁止擅改**（AGENTS.md 版本基线：node 2.1.5 / epod-elements 1.1.1 存在漂移，收敛待架构决策）。
- 根 `CHANGELOG.md` 追加"未发布"条目记录本次契约变更。
- `README.md` 补充"非 API 承运商（抓取来源）"说明与字段说明（对齐主仓 §3.6 要求）。

## 4. 验证策略

- 静态核查：既有调用方（各语言示例/测试）不因新增可选字段受影响。
- 编译验证：Go / Node / Rust / .NET 在本机可编译则编译；Swift 在 Windows 无工具链 → 标注"待编译验证"；Python / PHP / Ruby 做语法检查。
- 兼容性结论：字段全可选 + 服务端缺省不返 → 旧服务端响应可被新 SDK 正常解析（新增字段缺席时不报错）。

## 5. 跨仓依赖

- 上游：`api.shipzy.me` `non-api-carrier-tracking`（后端已落地并推送 468725f；公开 API 返回可选字段）。
- 下游消费：`user.shipzy.me` `tracking-source-indicator`（前端展示来源标识与降级提示，已推送 28f8baa）；`me.shipzy.falcon` 抓取侧（写回 `scrape_status`）；`carrier-progress-model`（`DataSource` 枚举）。
- 本 change 完成后由 `requirements` 交接文档标注上述跨仓依赖。
