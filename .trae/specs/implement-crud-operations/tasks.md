# Tasks

- [x] Task 1: 完善后端 API (`api/src/index.ts`)
  - [x] SubTask 1.1: 为 `Address`, `Population`, `House`, `Unit`, `Facility`, `Order` 分别实现 `POST`, `PUT`, `DELETE` 接口。
  - [x] SubTask 1.2: 接口需能正确接收前端传递的 body 参数，并通过 `prisma.model.create`, `prisma.model.update`, `prisma.model.delete` 执行数据库操作。
  - [x] SubTask 1.3: 对 `Address` 等具备级联关系的表，注意外键删除的级联逻辑或报错提示处理。

- [x] Task 2: 扩展前端 Store 接口 (`src/store/index.ts`)
  - [x] SubTask 2.1: 在 `useStore` 中为每个实体添加对应的 `addXxx`, `updateXxx`, `deleteXxx` 异步请求方法。
  - [x] SubTask 2.2: 使用 `fetch` 或 `axios` 调用对应接口，并在请求成功后重新调用 `fetchXxx` 方法刷新本地状态。

- [x] Task 3: 补全 `Address.tsx` (标准地址) 的增删改查 UI
  - [x] SubTask 3.1: 引入 `Modal`, `Form`, `Popconfirm` 等 Ant Design 组件。
  - [x] SubTask 3.2: 编写新增/编辑表单。
  - [x] SubTask 3.3: 绑定列表操作列的“编辑”、“删除”按钮事件。

- [x] Task 4: 补全 `Population.tsx` (实有人口) 的增删改查 UI
  - [x] SubTask 4.1: 编写新增/编辑表单，支持身份证、性别、电话、类型等字段。
  - [x] SubTask 4.2: 绑定操作列按钮事件。

- [x] Task 5: 补全 `House.tsx` (实有房屋) 的增删改查 UI
  - [x] SubTask 5.1: 编写表单支持状态、用途、产权人等字段。
  - [x] SubTask 5.2: 绑定操作列按钮事件。

- [x] Task 6: 补全 `Unit.tsx` (实有单位) 的增删改查 UI
  - [x] SubTask 6.1: 编写表单支持名称、类型、法人等字段。
  - [x] SubTask 6.2: 绑定操作列按钮事件。

- [x] Task 7: 补全 `Facility.tsx` (实有设施) 的增删改查 UI
  - [x] SubTask 7.1: 编写表单支持名称、类型、状态等字段。
  - [x] SubTask 7.2: 绑定操作列按钮事件。

- [x] Task 8: 补全 `Orders.tsx` (隐患工单) 的增删改查 UI
  - [x] SubTask 8.1: 支持工单状态的流转（如点击“分拨”、“督办”、“审核销账”弹出状态修改对话框）。
  - [x] SubTask 8.2: 绑定工单“删除”事件。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 2]
- [Task 6] depends on [Task 2]
- [Task 7] depends on [Task 2]
- [Task 8] depends on [Task 2]