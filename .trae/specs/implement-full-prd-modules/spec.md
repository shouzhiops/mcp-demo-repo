# 基层治理表单系统全面落地 Spec

## Why
在前面的分析与 PRD 编写中，我们已经明确了系统需要从“扁平的数据登记册”向“实战化的基层治理平台”演进。为了实现矛盾化解、经济动员、人口服务、空间治理和行政督查这五大核心业务的闭环流转，必须在现有的“一标四实”数据库底座上，全量扩建相应的业务流水表单、API 接口和管理前端页面。

## What Changes
- **数据库模型层 (Prisma) 扩展**：在 `schema.prisma` 中新增 5 大模块的业务模型（如 `DisputeRecord`, `Project`, `FloatingRecord`, `HouseInspection`, `SupervisionTask` 等），并通过外键强关联现有的基础表（`Population`, `Address`, `House`）。
- **后端 API 层 (Express) 开发**：在 `api/src/index.ts` 中补充新增模型对应的全套 CRUD 路由，并包裹规范的 `try...catch` 异常处理。
- **前端全局状态层 (Zustand) 扩展**：在 `src/store/index.ts` 中新增对应业务状态的 `fetch`, `add`, `update`, `delete` 方法。
- **前端管理端 (Admin) 页面开发**：在 `src/pages/admin/` 下新增 5 个具有代表性的业务台账页面，并将其接入到 `AdminApp.tsx` 的左侧 Sider 菜单和 React Router 路由体系中。

## Impact
- Affected code: `api/prisma/schema.prisma`, `api/src/index.ts`, `src/store/index.ts`, `src/pages/admin/*`
- Affected features: 管理后台全面升级，增加五大业务维度的台账管理能力。

## ADDED Requirements
### Requirement: Comprehensive Governance Modules
The system SHALL provide structural modules for Dispute Resolution, Economic Assets, Population Services, Space Infrastructure, and Administrative Supervision.

#### Scenario: Success case
- **WHEN** the admin accesses the system
- **THEN** they see new menus for each governance module in the sidebar.
- **WHEN** the admin clicks "矛盾纠纷台账"
- **THEN** they can view, add, and manage dispute records that are relationally linked to the core `Population` and `User` entities.