# 补齐一标四实系统缺失模块与本地化数据 Spec

## Why
目前系统在 PC 管理后台已经实现“一标”（标准地址）和“一实”（实有人口），但作为完整的“一标四实”系统，在前端 UI 和数据展示上缺失了“实有房屋”、“实有单位”、“实有设施/力量”这三实模块。另外，用户希望将系统的基础模拟数据本地化为“广州市从化区莲麻村”，以提升系统演示的真实感和贴合度。

## What Changes
- **新增后端 API 接口**：在 `api/src/index.ts` 中补充获取房屋（`/api/houses`）、单位（`/api/units`）和设施（`/api/facilities`）的 GET 接口。
- **修改数据库种子数据**：更新 `api/prisma/seed.ts`，将所有虚拟地址替换为“广州市从化区莲麻村”的真实地理环境（经纬度定位至从化莲麻村附近，约 23.85, 113.89），并补充更加丰富的房屋、单位、设施测试数据。
- **扩展前端状态管理**：在 `src/store/index.ts` 中新增对房屋、单位和设施数据的状态定义（`houses`, `units`, `facilities`）和获取方法（`fetchHouses`, `fetchUnits`, `fetchFacilities`）。
- **新增 PC 端 UI 模块**：在 `src/pages/admin/` 下新增三个页面组件：`House.tsx`（实有房屋台账）、`Unit.tsx`（实有单位台账）、`Facility.tsx`（实有设施台账）。
- **更新菜单与路由**：在 `src/pages/admin/AdminApp.tsx` 中注册这三个新模块的路由，并添加到左侧导航菜单中。
- **更新大屏与移动端位置**：确保大屏（`ScreenApp.tsx`）的地图中心点切换至广州市从化区莲麻村的坐标。

## Impact
- Affected specs: PC管理后台“四实”台账完整度，全系统地理坐标系。
- Affected code: 
  - 后端：`api/src/index.ts`, `api/prisma/seed.ts`
  - 前端：`src/store/index.ts`, `src/pages/admin/AdminApp.tsx`, `src/pages/screen/ScreenApp.tsx`, 以及新增的三个页面文件。

## ADDED Requirements
### Requirement: 实有房屋管理
系统 SHALL 在 PC 后台提供实有房屋台账。
#### Scenario: 查看房屋属性与人员
- **WHEN** 用户点击菜单进入“实有房屋台账”。
- **THEN** 看到以莲麻村地址为依托的房屋列表，展示房屋状态（如：特色民宿、自建房、危房），并能看到挂靠在地址上的人口信息。

### Requirement: 实有单位与设施管理
系统 SHALL 在 PC 后台提供实有单位和实有设施台账。
#### Scenario: 管理村内经济实体与硬件设施
- **WHEN** 用户点击菜单进入“实有单位台账”或“实有设施台账”。
- **THEN** 看到莲麻村内的经济实体（如：莲麻酒业、农家乐）和安防/公共设施（如：微型消防站、监控点）列表。

## MODIFIED Requirements
### Requirement: 数据本地化
- **Modification**: 所有地址字符串从“新华村”修改为“广州市从化区吕田镇莲麻村”。经纬度从北京的 (39.9, 116.4) 变更为广州从化的 (23.85, 113.89) 附近。
