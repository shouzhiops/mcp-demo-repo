# Tasks
- [x] Task 1: 搭建前端全栈基础项目环境（基于 React + TailwindCSS + Vite）。
  - [x] SubTask 1.1: 初始化 Vite 项目并安装相关依赖（React Router, TailwindCSS, Ant Design / Vant, Lucide Icons, ECharts 等）。
  - [x] SubTask 1.2: 建立路由结构（区分移动端 `/mobile/*`、PC后台 `/admin/*` 和可视化大屏 `/screen`）。
  - [x] SubTask 1.3: 配置全局样式、主题色（政务蓝/生态绿/暗黑科技风）及公共组件库。
- [x] Task 2: 实现移动端（网格员/村干部）核心功能页面。
  - [x] SubTask 2.1: 实现移动端首页（快捷工作台卡片入口、随手拍悬浮按钮）。
  - [x] SubTask 2.2: 实现“随手拍隐患上报”表单页（支持模拟拍照上传、定位、隐患类型选择）。
  - [x] SubTask 2.3: 实现“人员登记”表单页（录入返乡人员、留守老人/儿童，打标签）。
  - [x] SubTask 2.4: 实现“待办工单”列表页及详情页（接收派单提醒、标记“已处置”、上传处置结果）。
- [x] Task 3: 实现PC管理后台（书记/内勤）核心功能页面。
  - [x] SubTask 3.1: 实现PC端框架（左侧导航树、顶部用户信息、主体内容区）。
  - [x] SubTask 3.2: 实现“一标”（标准地址）数据台账管理页，支持增删改查及地图标注查看。
  - [x] SubTask 3.3: 实现“四实”（实有人口、房屋、单位、设施）数据台账管理页，支持以房查人。
  - [x] SubTask 3.4: 实现台账数据“一键导出Excel”模拟功能。
  - [x] SubTask 3.5: 实现“隐患分拨调度”中心页（接收移动端隐患工单，智能关联，手动派单，核销功能）。
- [x] Task 4: 实现可视化指挥大屏（指挥调度）页面。
  - [x] SubTask 4.1: 搭建大屏全景框架结构（暗黑科技风，左右数据面板，中间主视觉地图）。
  - [x] SubTask 4.2: 集成 2D 地图组件（如 React-Leaflet），绘制村庄院落散点分布（模拟数据）。
  - [x] SubTask 4.3: 实现大屏左右侧统计图表（人口结构、隐患排查进度、警报总览）。
  - [x] SubTask 4.4: 联调地图上的红色隐患点与PC端销账逻辑（状态同步展示）。
- [x] Task 5: 前端模拟数据（Mock）及状态管理。
  - [x] SubTask 5.1: 使用 Zustand 或 Context API 建立全局共享状态（如隐患工单列表状态）。
  - [x] SubTask 5.2: 编写 Mock 数据，跑通“发现-分拨-处置-销账”的完整前端交互演示闭环。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 2], [Task 3], [Task 4]
