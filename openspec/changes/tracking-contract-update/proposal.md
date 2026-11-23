# Tracking Contract Update — Proposal

## 背景

Shipzy 非 API 跟踪链路（主仓 `api.shipzy.me` change `non-api-carrier-tracking`）已进入 build：承运商抓取（EMS/EUB/国内主流等）产出的跟踪数据将附带来源与抓取状态元数据。为让 SDK 消费方可识别数据来源并展示降级提示，本 change 在 shipzy-sdks 各语言跟踪契约中新增**向后兼容可选字段**，保持既有字段、签名与方法不变。

主仓契约锚点：`E:\workspace\api.shipzy.me\openspec\changes\non-api-carrier-tracking\design.md` §3.5 / §3.6 / §3.7。

## 目标

- SDK 跟踪接口（详情 / 列表 / 事件）新增可选字段：`data_source`、`last_scrape_at`、`scrape_status`、`raw_status_text`。
- 各语言包同步契约（按实际模块落点逐语言更新）。
- 版本号（顶层 `VERSION=2.0.2` 及任意语言包版本）**不擅改**；仅更新契约与 CHANGELOG。
- 静态核查既有调用方兼容；无法本地编译的语言标注"待编译验证"。

## 影响面

| 语言 | 契约文件 | 变更类型 |
|---|---|---|
| Go | `go/tms/tracking.go` | 类型加可选字段 |
| Node/TS | `node/src/tracking.ts` | 类型加可选字段 |
| Rust | `rust/src/tracking.rs` | 类型加可选字段 |
| .NET | `dotnet/src/Shipzy/Models/TrackingModels.cs` | 类型加可选字段 |
| Swift | `swift/Sources/ShipzySDK/TrackingClient.swift` | 类型加可选字段 |
| Python / PHP / Ruby | 动态返回（Dict/array/Hash） | 字段自动透传，注释补充说明 |
| Java / Kotlin / Zig | 无 tracking 契约模块 | 不涉及 |

## 无破坏性保证

- 所有新增字段均为可选（`omitempty` / `Option` / 可空 / 缺省不反序列化）。
- 服务端缺省不返回时，既有调用方行为完全不变。
