# Implement Role Permissions Spec

## Why
目前系统的角色（Role）虽然具有 `permissions` 字段，但在“权限管理”菜单中，只能修改角色的名称和基础说明，缺乏实质性的系统级菜单权限分配能力。用户希望通过 UI 界面（弹窗及勾选树），精细化分配某个角色在“后台管理菜单”、“大屏展示”、“移动端菜单”这三端中的具体访问权限。

## What Changes
- **权限数据结构化**：在前端提取一份系统全局菜单/模块配置树（`PERMISSION_TREE`），涵盖后台（Admin）、大屏（Screen）、移动端（Mobile）的三大端点。
- **角色列表拓展**：在 `Roles.tsx`（权限管理）的操作列中，新增“分配权限”按钮。
- **权限分配 UI**：点击“分配权限”时，弹出一个带有 `Tree` 组件（支持复选 Checkbox）的抽屉或弹窗。用户可以通过勾选不同的节点，为角色分配对应的权限标识集合，并将其序列化保存到数据库角色的 `permissions` 字段中。
- **(可选) 鉴权渲染拦截**：根据当前登录用户所属角色的 `permissions`，在前端路由菜单渲染时进行动态过滤（若为 `all` 则全部放行，否则按选中的 key 过滤菜单展示）。

## Impact
- Affected code: `src/pages/admin/Roles.tsx`, `src/pages/admin/AdminApp.tsx`, `src/pages/mobile/Home.tsx` (可选，若实现动态菜单)
- Affected features: 角色的增删改查、系统的细粒度权限控制分配。

## ADDED Requirements
### Requirement: Granular Permission Assignment
The system SHALL provide an interface in the Role Management page to assign specific access permissions across Admin, Screen, and Mobile environments to a role.

#### Scenario: Success case
- **WHEN** the admin clicks "分配权限" on a specific role
- **THEN** a modal opens displaying a tree of available features (Admin, Screen, Mobile).
- **WHEN** the admin checks specific nodes and saves
- **THEN** the role's `permissions` field is updated in the database with the selected keys.