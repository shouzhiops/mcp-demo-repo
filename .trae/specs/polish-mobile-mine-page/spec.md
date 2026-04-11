# Polish Mobile Mine Page Spec

## Why
目前移动端的个人中心（`/mobile/mine`，即 `Mine.tsx`）页面主要处于静态 UI 展示阶段。页面上的用户信息（头像、昵称、角色）被硬编码，退出登录功能仅有前端路由跳转而缺乏实际的状态清理（如清除 Token 或调用 Store），并且“消息通知”、“系统设置”等功能菜单项均为死链接，未绑定实际交互。为了提升移动端体验和业务闭环，需要对该页面进行深度优化。

## What Changes
- **数据动态化**：接入全局状态管理（如 `useStore`），读取真实的登录用户信息（若当前无真实用户体系，则暂时保留 Mock 数据，但需改为状态驱动，为后续接入做准备）。
- **完善退出登录闭环**：在退出登录的确认逻辑中，增加清理本地存储（`localStorage`）或重置全局 Store 状态的占位逻辑，并将路由跳转改为 `replace` 模式跳转至登录页（或首页）。
- **功能菜单配置化与交互补全**：将静态的“消息通知”、“系统设置”、“关于我们”提取为数组配置循环渲染，并为它们绑定点击事件（如弹窗提示“功能开发中”或跳转对应路由）。
- **UI 细节打磨**：移除冗余的手动右侧箭头（利用 `antd-mobile` 的原生 `arrow` 属性），提取重复的内联样式，并增加底部安全区（Safe Area）适配。

## Impact
- Affected code: `src/pages/mobile/Mine.tsx`
- Affected features: 移动端个人中心展示与退出登录交互。

## ADDED Requirements
### Requirement: Dynamic User Profile
The Mine page SHALL display user information derived from a state management solution or local storage rather than hardcoded strings.

### Requirement: Configurable Menu List
The action menus (e.g., Settings, About) SHALL be rendered from a configuration array and provide interaction feedback (e.g., Toast) when clicked.

### Requirement: Secure Logout
- **WHEN** user confirms logout
- **THEN** the system MUST clear user session data and navigate using `replace` to prevent back-navigation to the authenticated state.