# Tasks
- [x] Task 1: 重构移动端整体布局与 iOS 风格
  - [x] SubTask 1.1: 修改 `MobileApp.tsx`，引入 `antd-mobile` 的 `TabBar`，实现底部导航（首页、工作台、我的）。
  - [x] SubTask 1.2: 全局应用 iOS 质感样式：毛玻璃（backdrop-blur）、大标题（Large Title）、平滑阴影。

- [x] Task 2: 升级首页与工作台（应用中心）
  - [x] SubTask 2.1: 重构 `Home.tsx`，展示数据概览与快捷入口。
  - [x] SubTask 2.2: 新增 `Apps.tsx` 工作台页面，提供 6 大功能模块（地址、房屋、人口、单位、设施、工单）的九宫格入口。

- [x] Task 3: 迭代“标准地址”与“设施/单位”移动端功能
  - [x] SubTask 3.1: 新增 `Addresses.tsx`（标准地址）页面，列表展示并支持新增。
  - [x] SubTask 3.2: 新增 `Units.tsx`（实有单位）页面，展示单位列表，支持走访打卡记录。
  - [x] SubTask 3.3: 新增 `Facilities.tsx`（实有设施）页面，展示设施列表与状态更新。

- [x] Task 4: 迭代“实有房屋”与“实有人口”移动端功能
  - [x] SubTask 4.1: 新增 `Houses.tsx`，展示房屋列表。
  - [x] SubTask 4.2: 重构 `Register.tsx`（实有人口），支持与房屋联动，在房屋详情中快速录入人口信息。

- [x] Task 5: 迭代“隐患工单”移动端功能
  - [x] SubTask 5.1: 升级 `Report.tsx`（随手拍），采用 iOS 风格表单。
  - [x] SubTask 5.2: 升级 `Tasks.tsx`（待办工单），优化状态流转和卡片视觉体验。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 2]