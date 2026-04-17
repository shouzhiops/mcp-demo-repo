# Tasks
- [ ] Task 1: 数据库模型层 (Prisma) 扩展
  - [ ] SubTask 1.1: 修改 `api/prisma/schema.prisma`。新增 `DisputeRecord`（矛盾纠纷）、`Project`（招商项目）、`FloatingRecord`（流动人口登记）、`HouseInspection`（房屋巡检）、`SupervisionTask`（交办事项）5 个具有代表性的核心业务模型。
  - [ ] SubTask 1.2: 执行 `cd api && npx prisma db push` 应用数据库架构的更改。

- [ ] Task 2: 后端 API 层 (Express) 开发
  - [ ] SubTask 2.1: 修改 `api/src/index.ts`，为 `disputeRecords`, `projects`, `floatingRecords`, `houseInspections`, `supervisionTasks` 提供标准的 GET/POST/PUT/DELETE RESTful 接口。
  - [ ] SubTask 2.2: 确保所有新接口的数据库操作均被 `try...catch` 包裹，返回 400 错误响应。

- [ ] Task 3: 前端全局状态层 (Zustand) 扩展
  - [ ] SubTask 3.1: 修改 `src/store/index.ts`。在 `StoreState` 接口中添加新增模型的数组类型（如 `disputeRecords: any[]`）。
  - [ ] SubTask 3.2: 补充对应的 `fetchX`, `addX`, `updateX`, `deleteX` 网络请求方法。

- [ ] Task 4: 前端管理端 (Admin) 页面开发
  - [ ] SubTask 4.1: 在 `src/pages/admin/` 目录下创建 5 个页面文件：`Disputes.tsx`, `Projects.tsx`, `FloatingPopulations.tsx`, `HouseInspections.tsx`, `SupervisionTasks.tsx`。
  - [ ] SubTask 4.2: 为每个页面编写基础的“公文级表格列表”和带抽屉/弹窗的“新增表单”，复用政务蓝设计语言（`bordered`, `bg-gov-blue`）。
  - [ ] SubTask 4.3: 修改 `src/pages/admin/AdminApp.tsx`，将这 5 个页面引入到 React Router 的 `Routes` 中，并在 `Sider` 的 `items` 菜单中新增五大模块的分组导航。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]