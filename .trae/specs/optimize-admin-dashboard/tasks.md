# Tasks
- [x] Task 1: 扩充与优化核心指标区
  - [x] SubTask 1.1: 从 `useStore` 引入 `populations`, `houses`, `units`, `facilities` 数据。
  - [x] SubTask 1.2: 在 `Dashboard.tsx` 顶部重构 `Row`，展示包括标准地址、人口、房屋、单位、设施、待处理隐患在内的 6 个核心指标卡片（可采用 2 行 3 列或 1 行 6 列布局）。
  - [x] SubTask 1.3: 为每个指标卡片绑定 `onClick` 事件，实现点击跳转（下钻）到对应的路由（如 `/admin/address`, `/admin/population` 等）。

- [x] Task 2: 重构快捷入口区
  - [x] SubTask 2.1: 将原“快捷入口”区域的网格布局扩展，拆分原有的“四实台账”入口为独立的人口、房屋、单位、设施快捷入口。

- [x] Task 3: 新增“最近待办隐患”微看板
  - [x] SubTask 3.1: 在页面下方新增一个卡片（或与快捷入口左右排布），使用 Ant Design 的 `List` 或 `Table` 组件。
  - [x] SubTask 3.2: 过滤 `orders` 获取状态为“待分拨”或“待处置”的工单，截取前 5 条进行渲染。
  - [x] SubTask 3.3: 为每条记录提供一个“去处理”按钮，点击跳转至 `/admin/orders`。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]