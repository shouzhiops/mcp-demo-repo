# 基层治理表单系统全面落地 Spec (详尽版)

## Why
原有的 Spec 仅提供了高维度的方向，缺乏具体到字段级别、接口结构和 UI 交互的详细规范。为了确保五大核心模块（矛盾化解、经济动员、人口服务、空间治理、行政督查）的开发能够精准契合前期梳理的 PRD，需要一份极度详尽的开发规格说明书，明确每一个新增数据模型、每一条 API 路由以及每一个前端页面的构成。

## What Changes

### 1. 数据库模型详细设计 (Prisma)
在 `schema.prisma` 中新增以下 5 个模型，并建立关联：

- **DisputeRecord (矛盾纠纷记录)**
  - `id`: Int (PK)
  - `title`: String (纠纷简述)
  - `type`: String (地界林权/婚姻家庭/劳资纠纷/邻里建房)
  - `content`: String (核心诉求与调解方案)
  - `status`: String (待调解/调解中/已化解/已上交)
  - `mediatorId`: Int? (关联 User 表)
  - `populations`: Population[] (多对多，涉事多方)
  - `createdAt`, `updatedAt`

- **Project (招商与工程项目)**
  - `id`: Int (PK)
  - `name`: String (项目/企业名称)
  - `investment`: Float (拟投资额-万元)
  - `area`: Float (用地需求-亩)
  - `progress`: String (初步对接/实地考察/协议拟定/签约落地)
  - `difficulties`: String? (存在困难)
  - `leaderId`: Int? (关联 User，包保领导)
  - `createdAt`, `updatedAt`

- **FloatingRecord (流动人口登记)**
  - `id`: Int (PK)
  - `populationId`: Int (关联 Population，承租人)
  - `houseId`: Int (关联 House，出租屋)
  - `origin`: String (流入地)
  - `reason`: String (务工/经商/探亲/就学)
  - `expireDate`: DateTime? (预计居住期限)
  - `createdAt`, `updatedAt`

- **HouseInspection (房屋安全巡检)**
  - `id`: Int (PK)
  - `houseId`: Int (关联 House)
  - `structure`: String (砖木/混砖/钢混/土木)
  - `usage`: String (自住/群租房/商用/厂房)
  - `hazards`: String (违规隔断/私拉电线/墙体开裂，存储为逗号分隔)
  - `deadline`: DateTime? (整改期限)
  - `status`: String (未整改/整改中/已验收)
  - `createdAt`, `updatedAt`

- **SupervisionTask (上级交办/督查事项)**
  - `id`: Int (PK)
  - `source`: String (市长热线/县纪委/镇综治办)
  - `content`: String (事项简述)
  - `deadline`: DateTime (要求办结时间)
  - `status`: String (待接收/办理中/待审核/已办结)
  - `handlerId`: Int? (关联 User)
  - `report`: String? (办结报告)
  - `createdAt`, `updatedAt`

### 2. 后端 API 接口规范 (Express)
在 `api/src/index.ts` 中，为上述 5 个模型实现标准 RESTful 接口：
- `GET /api/disputes`, `POST /api/disputes`, `PUT /api/disputes/:id`, `DELETE /api/disputes/:id`
- `GET /api/projects`, `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`
- `GET /api/floatings`, `POST /api/floatings`, `PUT /api/floatings/:id`, `DELETE /api/floatings/:id`
- `GET /api/inspections`, `POST /api/inspections`, `PUT /api/inspections/:id`, `DELETE /api/inspections/:id`
- `GET /api/supervisions`, `POST /api/supervisions`, `PUT /api/supervisions/:id`, `DELETE /api/supervisions/:id`
*注：所有接口必须使用 `try { ... } catch (error: any) { res.status(400).json({ error: error.message }) }` 拦截。*

### 3. 前端 Zustand 状态规范
在 `src/store/index.ts` 中：
- 定义 `DisputeRecord`, `Project`, `FloatingRecord`, `HouseInspection`, `SupervisionTask` 的 TypeScript Interface。
- 在 Store 状态中增加对应的 5 个数组变量。
- 增加 20 个异步方法（每个模块 4 个：fetch, add, update, delete）。

### 4. 前端 UI 页面规范 (Admin)
在 `src/pages/admin/` 新增 5 个 TSX 文件：
- **公共标准**：使用 Ant Design 的 `Table` (带 `bordered` 属性)，`Button`，`Modal`，`Form`。所有颜色统一使用政务蓝主题。
- **页面 1：`Disputes.tsx`** (矛盾纠纷台账)：包含多选人员的 Select (mode="multiple")，状态的 Tag 展示。
- **页面 2：`Projects.tsx`** (招商项目台账)：包含投资额、面积的 InputNumber，进度的下拉选择。
- **页面 3：`FloatingPopulations.tsx`** (流动人口台账)：包含关联人员和房屋的 Select 下拉框，以及日期的 DatePicker。
- **页面 4：`HouseInspections.tsx`** (房屋隐患巡检)：包含多选的 hazards 隐患类型，以及整改状态管理。
- **页面 5：`SupervisionTasks.tsx`** (交办事项台账)：包含逾期高亮显示逻辑（当前时间超过 deadline 且未办结时飘红）。

## Impact
- **深度影响**：完全重构并扩展了系统的数据容量和业务广度，系统将具备成熟的基层政务管理能力。
- **关联代码**：`api/prisma/schema.prisma`, `api/src/index.ts`, `src/store/index.ts`, `src/pages/admin/AdminApp.tsx` 以及新建的 5 个页面文件。