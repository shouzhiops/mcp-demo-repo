# Tasks

- [ ] Task 1: 扩展后端 Prisma 模型。
  - [ ] SubTask 1.1: 修改 `api/prisma/schema.prisma`，在各模型中补充必要字段（人口增加身份证/性别、房屋增加用途/产权人等、单位增加类型/法人、设施增加名称/状态、工单增加来源/优先级等）。
  - [ ] SubTask 1.2: 运行 `npx prisma db push` 或 `migrate dev`，确保数据库结构更新。

- [ ] Task 2: 扩展 `api/prisma/seed.ts` 生成配套数据。
  - [ ] SubTask 2.1: 在 `seed.ts` 的随机数据生成逻辑中，补充这些新字段的虚拟值（例如，使用随机函数生成假的身份证号码、随机分派男/女性别等）。
  - [ ] SubTask 2.2: 运行 `npx ts-node prisma/seed.ts` 重新初始化具有丰富字段的大规模数据。

- [ ] Task 3: 扩展前端 TypeScript 类型接口。
  - [ ] SubTask 3.1: 在 `src/store/index.ts` 的 `Population`, `House`, `Unit`, `Facility`, `Order` 等接口中增加对应的新属性定义。

- [ ] Task 4: 更新前端六个台账页面的表格组件。
  - [ ] SubTask 4.1: 修改 `Address.tsx`, `Population.tsx`, `House.tsx`, `Unit.tsx`, `Facility.tsx`, `Orders.tsx` 的 `columns` 配置，加入新的数据列。
  - [ ] SubTask 4.2: 为所有页面的 `<Table>` 组件添加 `scroll={{ x: 'max-content' }}` 属性。
  - [ ] SubTask 4.3: 为所有页面的“操作”列配置对象增加 `fixed: 'right'` 属性。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 3]