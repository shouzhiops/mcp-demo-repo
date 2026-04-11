# 接入天地图与系统设置 Spec

## Why
目前可视化大屏虽然拥有独立路由并已在工作台留有入口，但底图采用的是外网公共瓦片地图。用户希望接入更加官方和精准的“天地图”作为大屏底座，由于“天地图”的访问需要依赖用户的专属 API Key，因此需要开发一个“系统设置”页面，允许用户在管理后台动态配置 API Key，使大屏能读取该配置以加载天地图资源。

## What Changes
- **新建后端配置模型**：在 Prisma 数据库中增加 `Config` 表，用于存储如天地图 API Key 之类的系统全局设置。
- **开发配置 API**：在后端 `api/src/index.ts` 提供获取（GET）和更新（POST/PATCH）系统配置的接口。
- **扩展前端状态**：在 `src/store/index.ts` 中增加 `config` 状态及对应获取、更新的异步方法。
- **开发系统设置页面**：在 PC 端（`/admin`）新增“系统设置”页面（`/admin/settings`），提供表单让用户输入并保存天地图的 API Key（`tiandituKey`）。
- **更新大屏底图源**：修改 `src/pages/screen/ScreenApp.tsx` 中的 `TileLayer` 属性。在获取到 `config.tiandituKey` 后，使用天地图的影像瓦片（如 `img_w`）及标注瓦片（如 `cia_w`）作为底图。
- **增强无 Key 体验**：在大屏组件中处理未配置 Key 时的降级体验（如显示提示文字或暂时使用默认底图）。

## Impact
- Affected specs: 后端数据库结构、大屏地图展示模块。
- Affected code: 
  - 后端：`schema.prisma`, `api/src/index.ts`
  - 前端：`store/index.ts`, `ScreenApp.tsx`, `AdminApp.tsx` 以及新增的 `Settings.tsx`

## ADDED Requirements
### Requirement: 动态配置天地图
系统 SHALL 允许管理员动态配置天地图 API Key，并应用于可视化大屏。

#### Scenario: 配置 API Key 并生效
- **WHEN** 管理员进入“系统设置”页面，输入天地图 API Key 并保存。
- **THEN** 后端数据库更新，用户再次打开大屏（`/screen`）时，底图自动切换为高清的天地图影像图。

#### Scenario: 未配置 API Key 时的提示
- **WHEN** 数据库中尚未配置天地图 API Key 时用户打开大屏。
- **THEN** 大屏应给与醒目的提示，提醒管理员前往后台进行配置。