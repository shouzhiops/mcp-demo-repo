# Polish Mobile iOS Aesthetics Spec

## Why
移动端目前已经具备基础功能的闭环和一定的 iOS UI 风格，但根据用户需求，需要彻底检查每一个页面，保证所有 9 个核心页面在 UI 细节上（如毛玻璃导航栏、卡片大圆角、平滑阴影、安全区适配、统一背景色等）完全统一且符合高标准的 iOS 美感规范，不能有任何遗漏。

## What Changes
- 全局检查并统一 9 个页面的背景色（采用 iOS 标准底色如 `bg-gray-50` 或 `bg-[#f2f2f7]`）。
- 统一所有页面的 NavBar：使用毛玻璃效果（`backdrop-blur-md bg-white/70` 或类似），移除生硬边框，增加平滑滚动阴影。
- 统一卡片与列表：应用大圆角（`rounded-2xl`）、微小阴影（`shadow-sm`）和按压反馈（`active:scale-[0.98]` 或 `active:bg-gray-100`）。
- 统一输入框与表单：取消硬朗边框，采用 iOS 风格的内部灰色填充（`bg-gray-100`）、圆角输入框。
- 统一布局结构：保证顶部安全区域（Safe Area）和滚动区域的一致沉浸感。

## Impact
- Affected specs: 提升全站视觉一致性与 iOS 端体验
- Affected code: `src/pages/mobile/*.tsx` (包含 9 个核心页面及相关列表)

## ADDED Requirements
### Requirement: Strict iOS UI Consistency
The system SHALL provide a uniform iOS aesthetic across all 9 specified pages.

#### Scenario: Success case
- **WHEN** user navigates through any of the 9 pages
- **THEN** they experience consistent frosted glass headers, rounded cards, seamless shadows, and uniform typography without visual breaks.