# Tasks
- [x] Task 1: 数据库扩展与迁移
  - [x] SubTask 1.1: 在 `api/prisma/schema.prisma` 中新增 `PopulationRelation` 模型（包含 sourceId, targetId, relation 字段）。
  - [x] SubTask 1.2: 执行 `npx prisma db push` 更新数据库结构。

- [x] Task 2: 开发图谱聚合 API
  - [x] SubTask 2.1: 在 `api/src/index.ts` 中新增 `GET /api/graph/person/:id` 路由。
  - [x] SubTask 2.2: 实现以该人员为中心，查询其基本信息（Node）、名下房屋/居住地（Nodes & Edges）、关联的矛盾纠纷（Nodes & Edges）、以及社会关系（Nodes & Edges）。
  - [x] SubTask 2.3: 统一组装为 `{ nodes, edges }` 格式，并确保节点 ID 唯一去重。

- [x] Task 3: 前端依赖与组件准备
  - [x] SubTask 3.1: 在前端项目根目录执行 `npm install @antv/g6`。
  - [x] SubTask 3.2: 在 `src/pages/admin/` 目录下创建 `PersonGraph.tsx` 组件，并初始化 G6 Graph 实例（使用 Force 布局）。

- [x] Task 4: 图谱数据接入与交互开发
  - [x] SubTask 4.1: 在 `PersonGraph.tsx` 中调用 `/api/graph/person/:id` 获取数据并渲染。
  - [x] SubTask 4.2: 为不同类型的节点（人、房、事）配置不同的样式（颜色、形状）。
  - [x] SubTask 4.3: 实现 Tooltip 悬浮提示和基础的拖拽交互。

- [x] Task 5: 路由与入口集成
  - [x] SubTask 5.1: 在 `AdminApp.tsx` 中配置 `PersonGraph` 路由（支持带参数如 `/admin/population/graph/:id`）。
  - [x] SubTask 5.2: 在 `Population.tsx` (实有人口) 表格操作列中添加“查看图谱”按钮，点击后跳转至该人的图谱页。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 4] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]