# Tasks
- [x] Task 1: 准备个人信息状态与表单
  - [x] SubTask 1.1: 在 `src/pages/admin/AdminApp.tsx` 中添加 `isProfileModalVisible` 状态以及 `profileForm` 实例。
  - [x] SubTask 1.2: 修改 `handleUserMenuClick` 中的 `profile` 判断，调用 `setIsProfileModalVisible(true)`，并用 `currentUser` 的数据（如 `username`, `name`）初始化 `profileForm` 的默认值。

- [x] Task 2: 构建并渲染个人信息 Modal
  - [x] SubTask 2.1: 在 `AdminApp.tsx` 返回的 JSX 树中（通常与修改密码 Modal 平级）增加一个新的 `<Modal>`，标题为“个人信息”。
  - [x] SubTask 2.2: 在 Modal 内添加 `<Form>`，包含禁用的用户名输入框（`username`）和可编辑的真实姓名输入框（`name`）。

- [x] Task 3: 绑定提交更新逻辑
  - [x] SubTask 3.1: 编写 `handleProfileSubmit` 方法处理表单提交，调用 store 中的 `updateUser(currentUser.id, values)` 更新数据。
  - [x] SubTask 3.2: 更新成功后，通过 `message.success` 提示用户，并调用 `fetchCurrentUser()` （或手动更新 store）使 Header 同步显示最新的名字，最后关闭弹窗。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]