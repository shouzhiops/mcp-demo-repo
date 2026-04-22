# Tasks

- [x] Task 1: 图谱内检索功能 (In-graph Search)
  - [x] SubTask 1.1: 在图谱顶部控制栏增加“图谱内检索”搜索框 (`Input.Search`)。
  - [x] SubTask 1.2: 监听搜索事件，遍历当前画布节点，匹配 label 或 properties 字段。将匹配的节点设置为 `highlight` 状态，不匹配的节点设置为 `dim` (灰显) 状态，并在 G6 `nodeStateStyles` 中配置相应样式。

- [x] Task 2: 最短路径探路功能 (Shortest Path)
  - [x] SubTask 2.1: 监听节点点击事件 (`node:click`)，判断 `e.originalEvent.ctrlKey` 或 `e.originalEvent.metaKey`，允许用户最多选中 2 个节点，设置 `selected` 状态。
  - [x] SubTask 2.2: 提供“关系探路”按钮。点击后，使用 G6 自带的 `@antv/algorithm` 最短路径算法（如 findShortestPath）或自定义 BFS 算法计算两节点间的最短路径。
  - [x] SubTask 2.3: 高亮最短路径涉及的 Nodes 和 Edges，并将画布其余元素灰显。提供“清除探路/检索”的重置按钮。

- [x] Task 3: 真实打通右键菜单业务闭环 (Context Menu Business Flow)
  - [x] SubTask 3.1: “查看台账详情”：实现带参跳转，通过 `useNavigate` 跳转到对应的列表页（如 `/admin/population` 等），或者直接在当前页面利用弹窗展示台账详情，确保形成闭环。
  - [x] SubTask 3.2: “新增纠纷记录”：在 `PersonGraph.tsx` 中引入纠纷表单 Modal。调用 Zustand 的 `addDisputeRecord` 方法完成创建，并触发图谱刷新，将新纠纷节点追加到图谱中。

# Task Dependencies
- [Task 2] depends on [Task 1] (共享节点状态样式配置如 `highlight`, `dim`)
- [Task 3] can run in parallel with [Task 1] and [Task 2]