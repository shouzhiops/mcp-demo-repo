# Merge Mobile Home, Apps, and Mine Spec

## Why
目前移动端底部分了“首页”、“工作台”、“我的”三个 Tab。由于“首页”和“工作台”的功能都比较轻量级，且用户在使用时可能觉得频繁切换 Tab 体验繁琐，用户希望将这三个页面的核心功能和入口融合到一个主页面中，并在左上角提供个人头像作为“我的”页面的入口，从而提升整体的使用效率和一致的 iOS 质感。

## What Changes
- [**BREAKING**] 移除底部的 TabBar 导航 (`MobileApp.tsx`)，因为核心页面将被融合成一个单页面。
- 将原本 `Apps.tsx` 中的“基础业务”入口合并到 `Home.tsx` 中。
- 在 `Home.tsx` 的顶部导航栏左侧添加“我的”个人头像，点击该头像跳转到个人中心 (`Mine.tsx`)。
- `Apps.tsx` 页面可以废弃或保留为路由（但不作为主入口），重点是将内容挪入 `Home.tsx`。
- 修改 `MobileApp.tsx` 中的路由与布局配置，移除 `BottomBar` 相关的逻辑。

## Impact
- Affected code:
  - `src/pages/mobile/MobileApp.tsx` (移除 BottomBar)
  - `src/pages/mobile/Home.tsx` (合并入口，增加头像)
  - `src/pages/mobile/Apps.tsx` (可能被废弃，或作为保留文件)

## ADDED Requirements
### Requirement: Unified Home Layout
- **WHEN** user opens the mobile app
- **THEN** they should see a single comprehensive Home page containing both "快捷操作" (Quick Actions) and "基础业务" (Basic Business Apps).
- **THEN** the top left of the navigation bar should display an avatar.
- **WHEN** user clicks the avatar
- **THEN** they navigate to the personal center (`/mobile/mine`).