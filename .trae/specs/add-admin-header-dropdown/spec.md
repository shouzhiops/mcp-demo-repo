# Admin Header Dropdown Spec

## Why
目前管理后台的顶部 Header 区域中，右侧的用户名和头像仅为一个静态展示的 `div`。用户在使用过程中，点击自己的头像或用户名没有任何反馈。为了提升系统的易用性和符合通用后台管理系统的操作直觉，需要为该区域增加下拉菜单（Dropdown），提供“修改密码”、“个人信息”以及快捷“退出登录”等功能。

## What Changes
- **交互组件引入**：在 `AdminApp.tsx` 中引入 Ant Design 的 `Dropdown` 和 `MenuProps` 组件。
- **用户名与头像动态化**：将写死的“欢迎回来，村委书记/内勤”和静态的“书”字头像，替换为从 `currentUser` 状态中动态获取的用户姓名或账号名。
- **下拉菜单配置**：为头像和用户名区域包裹 `Dropdown`，提供“个人信息”（展示用）、“修改密码”（预留或实现简单弹窗）和“退出登录”（复用现有的 `handleLogout` 逻辑）。
- **(可选) 密码修改弹窗**：实现一个简单的密码修改 Modal，调用更新用户接口修改当前登录用户的密码。

## Impact
- Affected code: `src/pages/admin/AdminApp.tsx`
- Affected features: 管理后台顶部导航栏的用户交互。

## ADDED Requirements
### Requirement: User Profile Dropdown
The system SHALL provide a dropdown menu when clicking the user profile section in the admin header.

#### Scenario: Success case
- **WHEN** user clicks their avatar/name in the header
- **THEN** a dropdown menu appears showing "Profile", "Change Password", and "Logout".
- **WHEN** user clicks "Logout"
- **THEN** they are logged out and redirected to the login page.