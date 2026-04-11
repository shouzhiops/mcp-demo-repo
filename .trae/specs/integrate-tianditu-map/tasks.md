# Tasks

- [x] Task 1: 更新数据库模型与后端 API。
  - [x] SubTask 1.1: 在 `api/prisma/schema.prisma` 中新增 `Config` 模型（包含 `id`, `tiandituKey` 等字段），并执行 `npx prisma db push`。
  - [x] SubTask 1.2: 在 `api/prisma/seed.ts` 中添加一条默认的 `Config` 记录（`tiandituKey` 留空）。
  - [x] SubTask 1.3: 在 `api/src/index.ts` 中增加 `GET /api/config`（获取配置）和 `PATCH /api/config`（更新配置）接口。

- [x] Task 2: 扩展前端状态管理。
  - [x] SubTask 2.1: 在 `src/store/index.ts` 中定义 `Config` 接口。
  - [x] SubTask 2.2: 在 `StoreState` 中添加 `config` 状态，以及 `fetchConfig` 和 `updateConfig` 异步方法。

- [x] Task 3: 在 PC 后台新增“系统设置”页面。
  - [x] SubTask 3.1: 创建 `src/pages/admin/Settings.tsx` 页面，包含一个输入天地图 API Key 的表单。
  - [x] SubTask 3.2: 提交表单时调用 `updateConfig` 方法，并使用 `message` 组件提示成功。
  - [x] SubTask 3.3: 在 `src/pages/admin/AdminApp.tsx` 中注册 `/admin/settings` 路由，并在侧边栏菜单中添加“系统设置”入口（如 `<SettingOutlined />`）。

- [x] Task 4: 改造可视化大屏（`ScreenApp.tsx`）接入天地图。
  - [x] SubTask 4.1: 在 `ScreenApp.tsx` 的 `useEffect` 中增加对 `fetchConfig` 的调用。
  - [x] SubTask 4.2: 修改 `MapContainer` 内部逻辑。当 `config?.tiandituKey` 存在时，使用天地图的影像底图瓦片 URL（如 `http://t0.tianditu.gov.cn/img_w/wmts?...&tk=${key}`）和注记层（`cia_w`）。
  - [x] SubTask 4.3: 当 `tiandituKey` 为空时，渲染一个醒目的遮罩层提示：“未配置天地图 API Key，请前往管理后台的系统设置进行配置”。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2]