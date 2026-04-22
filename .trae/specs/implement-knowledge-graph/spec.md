# Implement Knowledge Graph Spec

## Why
为了提升基层综治干部的研判能力，需要将扁平的“一标四实”孤立表格数据升级为“立体关系网络”。通过引入人物关系图谱，可以直观展示人与人、人与房、人与事之间的复杂网络，极大提高排查高危人员社会关系、群体性纠纷的效率。

## What Changes
- **数据库扩展**：在 `schema.prisma` 中新增 `PopulationRelation` 表，用于记录显性的人际关系（如配偶、父子等）。
- **后端聚合接口**：在 Express 中新增 `GET /api/graph/person/:id` 接口，以指定人员为中心，向外辐射 1-2 度关系，组装成节点（nodes）和边（edges）的图数据格式。
- **前端可视化**：引入 `@antv/g6` 库，在管理后台新增“人物图谱”页面或视图，使用力导向布局（Force Layout）渲染关系网。
- **交互功能**：支持节点悬浮提示（Tooltip）、拖拽、以及双击节点下钻加载更多关系的交互。

## Impact
- Affected specs: 人口管理模块的延伸分析能力。
- Affected code: `api/prisma/schema.prisma`, `api/src/index.ts`, `src/pages/admin/Population.tsx`, 新增 `src/pages/admin/PersonGraph.tsx`

## ADDED Requirements
### Requirement: Person Knowledge Graph
The system SHALL provide a visual knowledge graph centered on a specific person, showing their residential, event-involvement, and interpersonal relationships.

#### Scenario: Success case
- **WHEN** the user selects a person to view their graph
- **THEN** the system renders a force-directed graph displaying the person, their associated houses, disputes, and relatives.