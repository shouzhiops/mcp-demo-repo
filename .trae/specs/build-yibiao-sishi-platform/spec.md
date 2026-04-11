# 农村“一标四实”综合管理平台 Spec

## Why
目前系统仅包含数据大屏展示，缺乏基层数据采集与PC端后台管理的业务闭环。农村基层治理需要一套完整的系统，支持网格员在移动端随手采集上报数据，支持村委干部在PC端管理台账、分拨任务，最后将数据汇聚至大屏端。

## What Changes
- 扩展数据状态模型，增加事件/隐患工单库（Incidents）。
- 新增移动端采集界面（Mobile端），适配手机屏幕，包含网格员的采集、上报（含模拟AI语音输入、OCR识别录入）、工单处理。
- 扩建PC端管理后台（Admin端），包含详细的人口库、房屋库、设施库的增删改查（CRUD）管理，以及工单派发与流转跟踪。
- 完善现有的可视化大屏，使其数据与后端的增删改查及工单状态实时联动。

## Impact
- Affected specs: 基础前端展示。
- Affected code: `src/App.tsx`, `src/store/index.ts`, `src/pages/*`, 新增 `src/pages/admin/*`, 新增 `src/pages/mobile/*`。

## ADDED Requirements
### Requirement: 移动端网格员工作台
系统 SHALL 提供一个移动端界面供网格员使用：
- 支持查看分配的走访任务。
- 支持上报隐患，模拟提供AI语音转文字和OCR提取信息功能。

### Requirement: PC端综合管理后台
系统 SHALL 提供一个管理后台界面供村委内勤使用：
- 支持“一标四实”数据的全量查询与增删改操作。
- 支持接收移动端上报的隐患，进行派单和结案审核。

## MODIFIED Requirements
### Requirement: 现有可视化大屏
调整原有大屏和台账页面的路由结构，将其归入整个平台的展示模块，并与全新的Zustand数据流完全打通。
