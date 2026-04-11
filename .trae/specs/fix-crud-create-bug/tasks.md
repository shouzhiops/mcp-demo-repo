# Tasks
- [x] Task 1: 修复后端 API 异常捕获缺失
  - [x] SubTask 1.1: 遍历 `api/src/index.ts` 中的 `/api/addresses`, `/api/populations`, `/api/houses`, `/api/units`, `/api/facilities`, `/api/orders` 的 POST, PUT, DELETE 路由。
  - [x] SubTask 1.2: 将这些路由中的 Prisma 数据库操作使用 `try...catch` 包裹，在 catch 块中统一返回 `res.status(400).json({ error: error.message })`。

- [x] Task 2: 修复前端台账组件的表单数据残留与错误捕获
  - [x] SubTask 2.1: 修改 `src/pages/admin/Address.tsx`。在 `handleAdd` 中添加 `form.setFieldsValue({})`。在 `handleModalOk` 中，分离 `validateFields()` 和 API 请求，若 API 报错则 `message.error(error.message)`。
  - [x] SubTask 2.2: 对 `src/pages/admin/Population.tsx` 执行相同修复。
  - [x] SubTask 2.3: 对 `src/pages/admin/House.tsx` 执行相同修复。
  - [x] SubTask 2.4: 对 `src/pages/admin/Unit.tsx` 执行相同修复。
  - [x] SubTask 2.5: 对 `src/pages/admin/Facility.tsx` 执行相同修复。
  - [x] SubTask 2.6: 对 `src/pages/admin/Orders.tsx` 执行相同修复。

# Task Dependencies
- [Task 2] depends on [Task 1]