# Tasks

- [x] Task 1: 数据库模型与关联设计 (Prisma)
  - [x] SubTask 1.1: 在 `schema.prisma` 中添加 `DisputeRecord`, `Project`, `FloatingRecord`, `HouseInspection`, `SupervisionTask` 5 个模型，定义明确的字段类型、默认值及关联（Relations）。
  - [x] SubTask 1.2: 运行 `npx prisma db push`，验证数据库架构迁移是否成功。
  - [x] SubTask 1.3: （可选）更新 Prisma Client 生成最新的类型。

- [x] Task 2: 后端 API 层实现 (Express)
  - [x] SubTask 2.1: 在 `api/src/index.ts` 中实现 `DisputeRecord` 的 CRUD 接口，特别处理多对多关联的 `populations` 字段 (connect/set/disconnect)。
  - [x] SubTask 2.2: 实现 `Project` 的 CRUD 接口，处理 `leaderId` 关联。
  - [x] SubTask 2.3: 实现 `FloatingRecord` 的 CRUD 接口，处理 `populationId` 和 `houseId` 关联。
  - [x] SubTask 2.4: 实现 `HouseInspection` 的 CRUD 接口。
  - [x] SubTask 2.5: 实现 `SupervisionTask` 的 CRUD 接口。
  - [x] SubTask 2.6: 检查所有新增接口，确保全部添加了 `try...catch` 异常拦截。

- [x] Task 3: 前端全局状态扩展 (Zustand)
  - [x] SubTask 3.1: 在 `src/store/index.ts` 定义 5 个模块的 Interface。
  - [x] SubTask 3.2: 扩展全局 state，添加 5 个数组变量（初始值为 `[]`）。
  - [x] SubTask 3.3: 编写 5 个模块的 `fetch` 方法（调用对应的 GET 接口）。
  - [x] SubTask 3.4: 编写 5 个模块的 `add`, `update`, `delete` 方法。

- [x] Task 4: 前端业务台账页面开发 (React)
  - [x] SubTask 4.1: 开发 `src/pages/admin/Disputes.tsx`（实现表格展示、新增/编辑 Modal、表单项校验及提交清空历史数据）。
  - [x] SubTask 4.2: 开发 `src/pages/admin/Projects.tsx`（同上规范）。
  - [x] SubTask 4.3: 开发 `src/pages/admin/FloatingPopulations.tsx`（同上规范，需引入 populations 和 houses 供下拉选择）。
  - [x] SubTask 4.4: 开发 `src/pages/admin/HouseInspections.tsx`（同上规范）。
  - [x] SubTask 4.5: 开发 `src/pages/admin/SupervisionTasks.tsx`（同上规范，增加逾期状态的高亮渲染）。

- [x] Task 5: 前端路由与菜单集成
  - [x] SubTask 5.1: 在 `src/pages/admin/AdminApp.tsx` 的 Sider `items` 中，利用 Ant Design Menu 分组语法，创建五大业务维度的菜单树。
  - [x] SubTask 5.2: 在 `AdminApp.tsx` 的 `<Routes>` 中添加这 5 个页面的路由映射。
  - [x] SubTask 5.3: 在 `AdminApp.tsx` 的 `useEffect` 初始化中，追加调用新增的 5 个 `fetch` 方法。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]