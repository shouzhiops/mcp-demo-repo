# Implement User Profile Modal Spec

## Why
在管理后台右上角的个人下拉菜单中，点击“个人信息”会提示“个人信息功能开发中”。为了闭环基础的用户功能，允许用户查看和更新自己的个人基础信息（如姓名），我们需要实现该“个人信息”弹窗。

## What Changes
- **交互逻辑修改**：在 `AdminApp.tsx` 中的 `handleUserMenuClick` 逻辑中，当点击 `profile` 时不再弹出提示，而是打开一个新的 Modal。
- **个人信息展示与编辑弹窗**：新增 `isProfileModalVisible` 状态和对应的 Ant Design `Modal`，内嵌 `Form` 表单。
- **用户信息更新**：表单初始值为当前用户的基本信息（如 `username` 和 `name`）。当用户修改并提交时，调用 `updateUser` 接口（或者新增的专属接口）更新用户的真实姓名（`name`），更新成功后同步更新客户端本地的全局 `currentUser` 数据。

## Impact
- Affected code: `src/pages/admin/AdminApp.tsx`, `src/store/index.ts`
- Affected features: 管理后台的用户个人信息查看与修改。

## ADDED Requirements
### Requirement: View and Edit Profile
The system SHALL allow authenticated users to view and update their profile details.

#### Scenario: Success case
- **WHEN** user clicks "个人信息" from the header dropdown
- **THEN** a modal opens displaying their current `username` (disabled) and `name` (editable).
- **WHEN** user changes their `name` and clicks OK
- **THEN** the system updates their profile in the database, reflects the new name in the header, and closes the modal.