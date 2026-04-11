# 大屏顶部挂件扩展 Spec

## Why
目前大屏的顶部仅展示了标题和核心 KPI，缺乏“时间/天气”等反映实时环境的挂件，也没有提供从大屏快速返回后台管理系统的便捷入口。用户希望在右上角增加这些实用组件，以提升大屏的信息完整度和交互便利性。

## What Changes
- **新增实时时钟**：在 `HeaderPanel.tsx` 的右上角添加一个实时跳动的数字时钟（包含年月日和星期）。
- **新增模拟天气挂件**：在时钟旁添加一个展示“广州从化”天气状况（如：多云 26°C）的静态挂件（为保持简洁，初期可不接入第三方天气 API，使用静态或简单的模拟数据）。
- **新增“数据后台”跳转按钮**：在右上角的最右侧添加一个按钮，点击后使用 React Router 的 `navigate` 跳转回 `/admin`。

## Impact
- Affected specs: 可视化大屏顶栏 (`HeaderPanel.tsx`) 的 UI 布局。
- Affected code: `src/pages/screen/components/HeaderPanel.tsx`

## ADDED Requirements
### Requirement: 大屏环境感知与快捷导航
系统 SHALL 在大屏右上角提供时间、天气及后台入口。
#### Scenario: 大屏日常挂机与跳转
- **WHEN** 大屏处于日常展示状态。
- **THEN** 右上角的时钟会每秒实时更新。
- **WHEN** 管理员需要修改数据。
- **THEN** 可以点击右上角的“数据后台”按钮，系统将平滑切换回 PC 管理后台。