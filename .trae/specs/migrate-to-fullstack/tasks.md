# Tasks

- [x] Task 1: 初始化后端项目环境（Express + TypeScript + Prisma）。
  - [x] SubTask 1.1: Initialize backend framework following backend_framework_init_guidelines。在根目录或 `api` 目录初始化 `package.json` 和 `tsconfig.json`。
  - [x] SubTask 1.2: 安装必要的后端依赖包（`express`, `cors`, `prisma`, `@prisma/client`, `@types/express`, `ts-node`, `nodemon` 等）。

- [x] Task 2: 数据库设计与建模。
  - [x] SubTask 2.1: 配置 `prisma/schema.prisma` 文件（为了快速跑通环境，推荐使用 `sqlite` 作为开发库）。
  - [x] SubTask 2.2: 建立核心数据模型：标准地址（`Address`）、人口（`Population`）、房屋（`House`）、单位（`Unit`）、设施（`Facility`）、工单（`Order`）。
  - [x] SubTask 2.3: 执行 `npx prisma db push` 创建数据库。
  - [x] SubTask 2.4: 编写 `prisma/seed.ts` 脚本，将原本前端的 Mock 数据导入数据库。

- [x] Task 3: 开发后端 RESTful API 接口。
  - [x] SubTask 3.1: 搭建 Express 服务骨架（引入 `cors`, `express.json()`）。
  - [x] SubTask 3.2: 实现获取所有标准地址（带关联工单数据）的接口（`GET /api/addresses`）。
  - [x] SubTask 3.3: 实现获取人口列表接口（`GET /api/populations`）。
  - [x] SubTask 3.4: 实现获取全部工单接口（`GET /api/orders`）。
  - [x] SubTask 3.5: 实现创建工单接口（随手拍上报）（`POST /api/orders`）。
  - [x] SubTask 3.6: 实现更新工单状态接口（分拨/处置/销账）（`PATCH /api/orders/:id`）。

- [x] Task 4: 改造前端数据流，接入真实后端 API。
  - [x] SubTask 4.1: 在前端安装并配置请求工具（如 `axios`）。
  - [x] SubTask 4.2: 改造 `src/store/index.ts`，引入异步 action（如 `fetchAddresses`, `fetchOrders`, `createOrderAsync`, `updateOrderAsync`）。
  - [x] SubTask 4.3: 去除原有的静态初始数据，改为应用启动时（`useEffect`）调用 API 拉取全量数据。

- [x] Task 5: 全端联调与功能验证。
  - [x] SubTask 5.1: 启动前后端服务，验证移动端提交“随手拍”后，数据库是否有新记录。
  - [x] SubTask 5.2: 验证 PC 端隐患分拨页面是否能正确展示工单并完成派单。
  - [x] SubTask 5.3: 验证大屏端能否从后端拉取实时状态并根据“待处置/待分拨”工单渲染红色预警地图。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]