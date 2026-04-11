# 台账列表字段扩展与体验优化 Spec

## Why
目前系统的六个核心台账页面（标准地址、实有人口、实有房屋、实有单位、实有设施、隐患分拨调度）的列表字段过于简陋，缺乏深度业务属性（如：身份证号、产权人、隐患来源等）。同时，随着未来真实业务中字段的增多，表格在横向上会出现滚动条，原有的操作列如果没有固定（fixed），会导致用户操作极不便利。

## What Changes
- **扩展后端模型 (`schema.prisma`)**：
  - `Population`: 增加 `idCard`, `gender`
  - `House`: 增加 `usage`, `ownerName`, `ownerPhone`
  - `Unit`: 增加 `type`, `legalPerson`, `contactPhone`
  - `Facility`: 增加 `name`, `status`, `manager`
  - `Order`: 增加 `source`, `priority`
  - *注意：运行 `npx prisma db push` 并更新 `seed.ts` 生成配套数据。*
- **扩展前端类型 (`store/index.ts`)**：
  - 更新对应的 TypeScript 接口，使其与新的后端模型匹配。
- **扩展前端表格列 (`AdminApp` 子页面)**：
  - 在 `Address.tsx`, `Population.tsx`, `House.tsx`, `Unit.tsx`, `Facility.tsx`, `Orders.tsx` 的 `columns` 配置中增加上述新字段。
  - 为所有涉及状态或类型的字段增加 Ant Design 的 `<Tag>` 或格式化展示。
- **固定操作列 (Fixed Action Column)**：
  - 为所有表格的“操作”列（Action Column）添加 `fixed: 'right'` 属性。
  - 为 `<Table>` 组件添加 `scroll={{ x: 'max-content' }}` 属性，确保在字段过多时支持横向滚动而不挤压列宽。

## Impact
- Affected specs: 数据库结构、Seed 数据、前端全局 Store 以及全部的 PC 后台台账页面。
- Affected code:
  - `api/prisma/schema.prisma`
  - `api/prisma/seed.ts`
  - `src/store/index.ts`
  - `src/pages/admin/*.tsx`

## ADDED Requirements
### Requirement: 丰富的业务台账展示
系统 SHALL 在各台账页面展示满足“一标四实”真实业务需求的完整字段。
#### Scenario: 浏览多字段表格
- **WHEN** 用户打开实有人口台账页面。
- **THEN** 表格不仅展示姓名和电话，还展示身份证号、性别等字段。
- **WHEN** 用户将表格向右滚动时。
- **THEN** 最右侧的“操作”列始终固定在屏幕右侧，方便随时点击“编辑”或“删除”。