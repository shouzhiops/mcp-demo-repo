# 可视化指挥大屏（ScreenApp）重构 Spec

## Why
当前大屏存在代码臃肿（UI、地图、轮询糅合在单个文件）、假数据（图表未对接真实数据库）、交互缺乏深度（无图地联动）、自适应差等问题。根据 V2.0 版 PRD 的规划，需要将大屏按高内聚低耦合原则拆分为多个子组件，并接入真实状态管理数据，增加全局指标看板及多维联动能力，最终提供一个商用级的可视化指挥中枢。

## What Changes
- **拆分大屏组件**：在 `src/pages/screen/components` 目录下新建 `MapLayer.tsx`、`HeaderPanel.tsx`、`LeftPanel.tsx`、`RightPanel.tsx` 四个核心组件。
- **重写主容器 (`ScreenApp.tsx`)**：将其精简为布局和状态分发容器，引入 CSS3 `transform: scale` 方案以实现基于 `1920x1080` 设计稿的等比例自适应缩放。
- **真实化图表数据**：在 `LeftPanel.tsx` 中，读取 `useStore` 的 `populations` 和 `houses`，通过聚合计算动态生成人口结构饼图和房屋状态柱状图的数据配置。
- **增加核心指标看板**：在 `HeaderPanel.tsx` 中，读取全量数据并展示如总人口、总房屋、今日预警等全局 KPI。
- **实现地图交互增强**：在 `MapLayer.tsx` 中实现基于点位数据的自动居中（FitBounds）；通过状态共享或 Context 实现从 `RightPanel` 点击工单时，地图平滑定位（FlyTo）至事发坐标。

## Impact
- Affected specs: 可视化大屏 (`/screen`) 路由下的全部内容。
- Affected code: 
  - 修改 `src/pages/screen/ScreenApp.tsx`
  - 新增 `src/pages/screen/components/*`

## ADDED Requirements
### Requirement: 动态图表与核心指标
系统 SHALL 在大屏展示基于真实数据的图表及顶部指标。
#### Scenario: 数据驱动展示
- **WHEN** 数据库中存在真实的莲麻村数据并打开大屏。
- **THEN** 左侧饼图真实反映村内人口标签占比，顶部指标正确显示总人口数及活跃预警数。

### Requirement: 地图智能联动
系统 SHALL 允许通过右侧列表联动地图视角。
#### Scenario: 点击预警定位
- **WHEN** 用户在右侧列表点击某条紧急工单。
- **THEN** 地图视角平滑拉近并居中到该工单关联的地理坐标。

## MODIFIED Requirements
### Requirement: 屏幕自适应
- 采用 `transform: scale` 替换现有的简单流式布局，确保大屏在任何分辨率下均保持 `16:9` 比例无损缩放。