# Tasks

- [x] Task 1: 更新后端数据库种子数据（Seed）至广州从化莲麻村。
  - [x] SubTask 1.1: 修改 `api/prisma/seed.ts`，将地址名称（如“新华村”）修改为“广州市从化区吕田镇莲麻村-xx号”。
  - [x] SubTask 1.2: 修改经纬度至 `[23.85, 113.89]` 附近，并添加更多贴近真实的农村场景数据（如特色民宿、农家乐、微型消防站等）。
  - [x] SubTask 1.3: 执行 `npx ts-node prisma/seed.ts` 重新生成数据库模拟数据。

- [x] Task 2: 补充后端 API 接口。
  - [x] SubTask 2.1: 在 `api/src/index.ts` 中添加 `GET /api/houses`、`GET /api/units` 和 `GET /api/facilities`，需包含 `address` 的关联查询。

- [x] Task 3: 扩展前端状态管理 (`src/store/index.ts`)。
  - [x] SubTask 3.1: 定义 `House`, `Unit`, `Facility` 接口类型。
  - [x] SubTask 3.2: 在 `StoreState` 中添加 `houses`, `units`, `facilities` 数组及对应的 `fetchHouses`, `fetchUnits`, `fetchFacilities` 异步方法。

- [x] Task 4: 在 PC 管理后台实现缺失的“三实”页面。
  - [x] SubTask 4.1: 创建 `src/pages/admin/House.tsx`，使用 antd `Table` 展示实有房屋台账，包含地址和房屋状态。
  - [x] SubTask 4.2: 创建 `src/pages/admin/Unit.tsx`，展示实有单位（企业、商铺、农家乐等）台账。
  - [x] SubTask 4.3: 创建 `src/pages/admin/Facility.tsx`，展示实有设施/力量（消防点、摄像头、网格员等）台账。
  - [x] SubTask 4.4: 更新 `src/pages/admin/AdminApp.tsx` 的路由和左侧菜单栏，将新页面注册进去，形成完整的“一标四实”导航结构。

- [x] Task 5: 调整可视化大屏地图中心点。
  - [x] SubTask 5.1: 在 `src/pages/screen/ScreenApp.tsx` 中，将 `MapContainer` 的 `center` 属性调整为 `[23.85, 113.89]`，缩放级别适当调整以适应村庄级别显示。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 1]