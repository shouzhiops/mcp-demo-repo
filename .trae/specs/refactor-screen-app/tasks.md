# Tasks

- [x] Task 1: 创建组件目录结构及基础骨架。
  - [x] SubTask 1.1: 在 `src/pages/screen/` 下新建 `components` 目录。
  - [x] SubTask 1.2: 创建空的 `MapLayer.tsx`, `HeaderPanel.tsx`, `LeftPanel.tsx`, `RightPanel.tsx` 文件，定义各自的 props 接口（如需要）。
  - [x] SubTask 1.3: 安装所需依赖：`npm install react-use` (可选，用于窗口尺寸监听) 或自行编写 `useWindowSize` hook。

- [x] Task 2: 重构主容器 (`ScreenApp.tsx`) 实现等比例缩放。
  - [x] SubTask 2.1: 移除原有的地图和图表代码，保留顶层状态获取 (`useStore`) 逻辑和轮询。
  - [x] SubTask 2.2: 编写基于 `transform: scale` 的大屏自适应逻辑（以 `1920x1080` 为基准），将内容包裹在定宽定高的容器中。
  - [x] SubTask 2.3: 在容器内引入并排布 `HeaderPanel`, `LeftPanel`, `RightPanel`, `MapLayer`。
  - [x] SubTask 2.4: 增加选中的工单状态（如 `selectedOrderId`），通过 props 或 Context 向下传递，以实现“表-地”联动。

- [x] Task 3: 实现全局核心指标面板 (`HeaderPanel.tsx`)。
  - [x] SubTask 3.1: 接收 `addresses`, `populations`, `houses`, `orders` 等数据作为 props。
  - [x] SubTask 3.2: 计算总人口、总房屋、今日预警、未处置隐患等核心 KPI，并在顶部展示（可选：增加数字翻牌器或发光特效）。

- [x] Task 4: 实现真实化数据图表 (`LeftPanel.tsx`)。
  - [x] SubTask 4.1: 接收 `populations`，根据 `type` 分组聚合（如：外出务工、留守老人等），渲染 ECharts 饼图。
  - [x] SubTask 4.2: 接收 `houses`，根据 `status`（如：自建房、危房等）聚合，渲染柱状图或环形图。

- [x] Task 5: 优化右侧预警面板 (`RightPanel.tsx`) 与联动交互。
  - [x] SubTask 5.1: 提取原有的预警列表逻辑，接收 `orders` 和 `addresses`。
  - [x] SubTask 5.2: 为列表项绑定 `onClick` 事件，触发父组件传递的 `onOrderSelect(orderId)` 函数。

- [x] Task 6: 优化地图底座与交互 (`MapLayer.tsx`)。
  - [x] SubTask 6.1: 提取原有的 `react-leaflet` 代码，引入天地图配置。
  - [x] SubTask 6.2: 在组件内部实现 `FitBounds` 逻辑：当 `addresses` 变化时，利用 `L.latLngBounds` 计算边界并调用 `map.fitBounds`。
  - [x] SubTask 6.3: 实现 `flyTo` 联动：监听传入的 `selectedOrderId`，找到对应坐标，调用 `map.flyTo` 并自动打开 Popup。
  - [x] SubTask 6.4: 优化 Marker 图标渲染性能，避免循环内重复创建。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 2]
- [Task 6] depends on [Task 2]