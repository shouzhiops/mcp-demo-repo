# Mobile iOS Aesthetic Refactor & Feature Iteration Spec

## Why
当前移动端（MobileApp）界面较为基础，缺乏原生的 iOS 质感（如毛玻璃、大圆角、底部 TabBar 等），且功能仅包含简单的随手拍和人员登记。为了更好地满足网格员现场采录和群众使用的诉求，需要将移动端重构为 iOS 风格，并迭代之前在后台完善的 6 大台账功能（标准地址、实有房屋、实有人口、实有单位、实有设施、隐患工单）。

## What Changes
- **UI/UX 重构**：引入 iOS 设计规范（底部 TabBar 导航、`backdrop-blur` 毛玻璃导航栏、`rounded-2xl` 大圆角卡片、平滑过渡动画）。
- **标准地址模块**：新增移动端标准地址列表与快速新增页面。
- **实有房屋与人口模块**：新增房屋列表与档案详情，采用“以房管人”模式，支持与人口联动。
- **实有单位与设施模块**：新增单位走访列表与设施巡检列表。
- **隐患工单迭代**：优化随手拍和待办工单的样式与交互流转。
- [**BREAKING**] 重构 `MobileApp.tsx` 路由结构，引入底部 TabBar（首页、应用、我的）。

## Impact
- Affected code: 
  - `src/pages/mobile/MobileApp.tsx` (路由与整体布局重构)
  - `src/pages/mobile/Home.tsx` (首页质感升级)
  - `src/pages/mobile/Apps.tsx` (新增应用中心页面，聚合 6 大功能入口)
  - `src/pages/mobile/Addresses.tsx`, `Houses.tsx`, `Units.tsx`, `Facilities.tsx` (新增页面)
  - `src/pages/mobile/Report.tsx`, `Tasks.tsx`, `Register.tsx` (样式升级与功能适配)

## ADDED Requirements
### Requirement: iOS Aesthetic Layout
系统需提供类似 iOS 的底部导航栏与毛玻璃顶部导航栏，卡片使用大圆角和弥散阴影。

### Requirement: Feature Iterations
- 提供标准地址查询与定位打卡功能。
- 提供房屋台账及下属人口的联动查看与登记功能。
- 提供设施与单位的轻量级走访巡检列表。