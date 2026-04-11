# 补全台账增删改查 (CRUD) 规范

## Why
当前系统的六个台账页面（标准地址、实有人口、实有房屋、实有单位、实有设施、隐患分拨调度）只实现了“查（Read）”的功能。列表上的“新增”、“编辑”、“删除”按钮大多是纯展示或模拟操作。为了让系统具备真实的可用性，必须打通从前端到后端的完整增删改流程。

## What Changes
- **后端 API 补充 (`api/src/index.ts`)**：
  - 为 `Address`, `Population`, `House`, `Unit`, `Facility`, `Order` 各实体补充 `POST` (Create)、`PUT` (Update) 和 `DELETE` (Delete) 接口。
- **前端全局状态管理补充 (`store/index.ts`)**：
  - 为每个实体添加对应的 `addXxx`, `updateXxx`, `deleteXxx` 异步请求方法（使用 `axios` 或 `fetch`），并在请求成功后更新本地状态或重新拉取列表。
- **前端 UI 交互补充 (`AdminApp` 子页面)**：
  - 引入 Ant Design 的 `Modal` 和 `Form` 组件。
  - 在每个台账页面实现统一的弹窗表单逻辑，支持复用“新增”和“编辑”两种模式。
  - 为“删除”操作添加 `Popconfirm` 或 `Modal.confirm` 的二次确认。

## Impact
- Affected specs: 所有台账业务的底层接口及前端交互逻辑。
- Affected code:
  - `api/src/index.ts`
  - `src/store/index.ts`
  - `src/pages/admin/Address.tsx`
  - `src/pages/admin/Population.tsx`
  - `src/pages/admin/House.tsx`
  - `src/pages/admin/Unit.tsx`
  - `src/pages/admin/Facility.tsx`
  - `src/pages/admin/Orders.tsx`

## ADDED Requirements
### Requirement: 完整的业务数据闭环
系统 SHALL 允许用户在后台页面上对各台账数据进行完整的增删改操作。
#### Scenario: 新增与编辑
- **WHEN** 用户点击“新增”或“编辑”按钮。
- **THEN** 弹出一个包含该实体所有必填字段的表单，提交后页面数据实时刷新。
#### Scenario: 删除安全确认
- **WHEN** 用户点击“删除”按钮。
- **THEN** 弹出二次确认提示，确认后调用后端接口并从列表中移除该项。