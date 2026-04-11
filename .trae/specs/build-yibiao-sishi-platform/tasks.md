# Tasks
- [x] Task 1: 扩展底层数据模型与状态管理
  - [x] SubTask 1.1: 扩展 `src/types/index.ts`，增加工单/事件（Incident）的类型定义。
  - [x] SubTask 1.2: 更新 `src/store/index.ts`，支持所有实体（人口、房屋、设施、事件）的 CRUD 操作，并预置模拟数据。
- [x] Task 2: 搭建移动端网格员工作台（Mobile）
  - [x] SubTask 2.1: 创建移动端基础布局与路由（`/mobile`）。
  - [x] SubTask 2.2: 实现移动端“随手拍/隐患上报”表单，包含模拟AI语音录入功能。
  - [x] SubTask 2.3: 实现移动端“待办任务”列表，支持处理工单。
- [x] Task 3: 搭建PC端综合管理后台（Admin）
  - [x] SubTask 3.1: 优化整体路由，区分 `/screen`（大屏）、`/admin`（后台）、`/mobile`（移动端）。
  - [x] SubTask 3.2: 实现后台的人房台账管理模块（支持增删改查）。
  - [x] SubTask 3.3: 实现后台的事件/工单分拨管理中心。
- [x] Task 4: 平台联调整合
  - [x] SubTask 4.1: 修改 `App.tsx` 导航结构，提供角色入口选择页（大屏/后台/移动端）。
  - [x] SubTask 4.2: 验证三端数据流转是否闭环（移动端上报 -> 后台分拨 -> 移动端处理 -> 大屏状态更新）。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2], [Task 3]
