# 系统 UI/UX 体验进阶优化 Spec

## Why
当前系统已经具备极佳的视觉基础，但在一些高级细节上还有提升空间。为了在比赛中呈现真正“大厂级”的专业水准，我们需要对大屏图表质感、PC端原生控件的暗色模式兼容性、移动端的单手握持操作体验以及危险/确认操作的全局反馈进行精细化打磨。

## What Changes
- 优化 Dashboard 中的 ECharts 柱状图，将纯色替换为渐变色，提升大屏质感。
- 优化 Ledger 和 Incidents 页面中原生 `<select>` 标签的 `<option>` 样式，强制暗色背景以避免部分系统下白底刺眼。
- 优化 Mobile Report 页面，将“确认上报”按钮改为吸底悬浮（Sticky Bottom），方便户外单手操作。
- 新增全局 Toast 轻提示组件，并在 Incidents 的“派发”与“结案”操作后给予明确的成功反馈。

## Impact
- Affected specs: 系统全局UI/UX。
- Affected code: `src/pages/Dashboard.tsx`, `src/pages/Ledger.tsx`, `src/pages/admin/Incidents.tsx`, `src/pages/mobile/Report.tsx`, 新增 `src/components/Toast.tsx`。

## MODIFIED Requirements
### Requirement: Dashboard Bar Chart
大屏中的“各组务工人数分布”柱状图 SHALL 使用从 `#4fd1c5` 到 `#319795` 的线性渐变，并保持顶部圆角。

### Requirement: PC Admin Select Dropdowns
台账页与工单中心的状态筛选下拉框 SHALL 为所有的 `<option>` 添加深色背景样式，保证暗色模式体验的一致性。

### Requirement: Mobile Report Button
移动端隐患上报页面的“确认上报”按钮 SHALL 吸附在屏幕最下方，并且表单内容区需预留底部 padding 防止遮挡。

### Requirement: Incident Actions Feedback
当管理员在后台派发或结案工单时，系统 SHALL 弹出一个居中或顶部的 Toast 提示（如“✅ 工单 001 已成功结案”），并在几秒后自动消失。
