# Tasks

- [x] Task 1: 后端图谱数据源扩展与多跳接口
  - [x] SubTask 1.1: 扩展 `/api/graph/person/:id`，增加对 `Unit`（如：法人或联系电话匹配的人员）和 `Order`（关联到相同地址或人的异常预警工单）的查询与节点组装。
  - [x] SubTask 1.2: 新增增量查询接口（如 `/api/graph/person/:id/hop` 或复用扩展逻辑），专门用于双击扩展时的二度节点与连线数据获取。

- [x] Task 2: 前端图谱页面布局与控件重构
  - [x] SubTask 2.1: 在 `PersonGraph.tsx` 增加“布局切换”下拉框（支持 Force, Concentric, Circular 等布局动态切换）。
  - [x] SubTask 2.2: 增加悬浮图例过滤器 (Legend Filter) 面板，通过状态控制 G6 画布中各类型节点的显隐。

- [x] Task 3: 图谱节点样式与 Tooltip 定制
  - [x] SubTask 3.1: 重写 Tooltip 插件的 HTML 生成逻辑，根据节点类型（person, house, dispute, unit, order, address）显示精确的业务字段集。
  - [x] SubTask 3.2: 识别风险预警节点（如：危房、待处理工单等），通过 G6 node style 配置红色阴影发光或自定义状态（state）呈现高危动效。

- [x] Task 4: 深度交互能力实现 (Multi-hop & Context Menu)
  - [x] SubTask 4.1: 绑定节点双击事件 (`on('node:dblclick')`)，调用后端增量接口，并将返回的 Nodes 和 Edges 合并至当前画布（过滤重复项）。
  - [x] SubTask 4.2: 引入并配置右键菜单（G6 Menu 插件或自定义 DOM），右键不同节点展示不同的快捷操作入口（如“查看人员台账”、“新增纠纷记录”等，可跳转或弹窗）。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
