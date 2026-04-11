# Tasks
- [x] Task 1: 动态化 Header 用户信息
  - [x] SubTask 1.1: 修改 `src/pages/admin/AdminApp.tsx`，从 `currentUser` 中提取 `name` 或 `username`。
  - [x] SubTask 1.2: 将静态的问候语和头像文字替换为真实数据（如提取名字的第一个字作为头像）。

- [x] Task 2: 引入下拉菜单并绑定事件
  - [x] SubTask 2.1: 导入 `Dropdown`, `MenuProps` 以及相关图标（`UserOutlined`, `KeyOutlined`）。
  - [x] SubTask 2.2: 定义 `userMenuItems` 数组，包含个人信息、修改密码、退出登录（danger: true）。
  - [x] SubTask 2.3: 定义 `handleUserMenuClick` 函数，将 key 为 `logout` 的点击绑定到已有的 `handleLogout` 方法上。
  - [x] SubTask 2.4: 使用 `<Dropdown>` 包裹头像与问候语区域，增加 `cursor-pointer` 样式类。

- [x] Task 3: (可选拓展) 实现修改密码弹窗
  - [x] SubTask 3.1: 在 `AdminApp.tsx` 中增加一个 `Modal` 与 `Form`，用于修改密码（含新密码、确认密码校验）。
  - [x] SubTask 3.2: 绑定 `handleUserMenuClick` 的 `password` 事件以打开此弹窗。
  - [x] SubTask 3.3: 提交时调用后端的更新用户接口（通过 `updateUser` 或自定义请求），并在成功后提示用户重新登录。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]