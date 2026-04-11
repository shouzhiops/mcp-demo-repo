# Optimize Admin Dashboard Spec

## Why
当前莲麻村治理中心管理后台的“工作台（Dashboard）”数据维度较为单薄，缺乏“四实”（人、房、企、物）的全面大盘数据；核心指标卡片无法点击下钻；“快捷入口”存在预期违背（如点击“四实台账”仅跳到人口列表），且缺少最近待办事项的外显，不利于内勤人员快速闭环业务。需要进行产品层面的优化升级。

## What Changes
- **扩充数据看板**：在顶层指标区补全“四实”数据，包括实有人口、实有房屋、实有单位、实有设施的统计卡片。
- **指标下钻（Click-through）**：使所有的统计指标卡片支持点击跳转至对应的台账列表页。点击“待处理隐患”时应跳转至隐患工单列表。
- **重构快捷入口**：将原来的“四实台账”入口拆分为四个独立的高频入口（人口、房屋、单位、设施），消除用户跳转预期偏差。
- **新增待办列表微看板**：在快捷入口下方或右侧新增一个“最近待办隐患”列表，展示前 5 条待处理的工单，支持一键点击前往处理。

## Impact
- Affected code: `src/pages/admin/Dashboard.tsx`
- Affected features: 后台首页的数据展示和快捷导航。

## ADDED Requirements
### Requirement: Comprehensive Data Overview
The Dashboard SHALL display the total counts for all primary entities (Addresses, Populations, Houses, Units, Facilities, and Orders).

### Requirement: Interactive Dashboard
All statistic cards SHALL be clickable and navigate the user to the corresponding list view.

### Requirement: Pending Tasks View
The Dashboard SHALL display a list of up to 5 pending orders to facilitate quick action.