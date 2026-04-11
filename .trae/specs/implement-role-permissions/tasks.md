# Tasks
- [x] Task 1: 定义全端权限树配置
  - [x] SubTask 1.1: 在 `src/pages/admin/Roles.tsx` (或单独的 config 文件) 中定义一个 `PERMISSION_TREE` 数据结构，包含顶层节点：`admin` (后台)、`screen` (大屏)、`mobile` (移动端)。
  - [x] SubTask 1.2: 在各顶层节点下定义子菜单（如：`admin:address`, `admin:population`, `mobile:report`, `screen:view` 等）作为树的叶子节点。

- [x] Task 2: 扩展角色管理页面 (Roles.tsx)
  - [x] SubTask 2.1: 在表格的“操作”列中，新增一个 `<a>分配权限</a>` 或 Button。
  - [x] SubTask 2.2: 引入 Ant Design 的 `Modal` 或 `Drawer`，内部放置 `Tree` 组件，开启 `checkable` 属性。
  - [x] SubTask 2.3: 编写处理逻辑：点击分配时，解析当前角色的 `permissions` 字段（如果为 `'all'`，默认全选；如果是 JSON/逗号分隔的 key 列表，则勾选对应节点），映射到 Tree 的 `checkedKeys`。
  - [x] SubTask 2.4: 在弹窗中点击“保存”时，将 Tree 的 `checkedKeys` 转化为字符串（如 JSON 字符串），通过调用现有的更新角色接口 (`updateRole` in store) 保存到后端。

- [x] Task 3: 前端动态菜单拦截 (可选但推荐，以实现真正的权限控制)
  - [x] SubTask 3.1: 在 `AdminApp.tsx` 渲染菜单前，根据 `currentUser.role.permissions` 对 `menuItems` 进行过滤。如果不是 `all`，只有当菜单的 key 包含在权限集合中时才渲染。
  - [x] SubTask 3.2: 同样，在 `src/pages/mobile/Home.tsx` 中对移动端应用网格入口进行简单的鉴权过滤。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]