# Tasks
- [x] Task 1: 优化 Dashboard 柱状图
  - [x] SubTask 1.1: 在 `src/pages/Dashboard.tsx` 中修改 ECharts 配置，将纯色替换为渐变色，增加质感。
- [x] Task 2: 修复原生 Select 下拉框样式
  - [x] SubTask 2.1: 在 `src/pages/Ledger.tsx` 和 `src/pages/admin/Incidents.tsx` 的 `<option>` 标签增加深色背景的 class（如 `className="bg-gray-800 text-white"`）。
- [x] Task 3: 优化移动端上报按钮交互
  - [x] SubTask 3.1: 在 `src/pages/mobile/Report.tsx` 中，将“确认上报”按钮改为吸底（Sticky Bottom）布局，并给表单区域底部增加 padding。
- [x] Task 4: 增加全局 Toast 提示
  - [x] SubTask 4.1: 实现一个简单的 Toast 组件，或通过全局状态管理展示 Toast。
  - [x] SubTask 4.2: 在 `src/pages/admin/Incidents.tsx` 中，在“派发”和“结案”操作成功后触发明确的 Toast 提示。

# Task Dependencies
- [Task 1]、[Task 2]、[Task 3] 无依赖，可并行开发。
- [Task 4] 需要先创建 Toast 组件，然后在 Incidents 中调用。