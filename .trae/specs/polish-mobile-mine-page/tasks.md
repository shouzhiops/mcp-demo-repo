# Tasks
- [x] Task 1: 动态化用户信息与菜单配置
  - [x] SubTask 1.1: 在 `Mine.tsx` 中定义 `userInfo` 状态（可从 `useStore` 获取或暂时定义为局部状态对象）。
  - [x] SubTask 1.2: 将“消息通知”、“系统设置”、“关于我们”提取为一个配置数组 `menuItems`。
  - [x] SubTask 1.3: 使用 `.map` 渲染菜单列表，利用 `antd-mobile` 原生的 `arrow` 属性，移除手动传入的 `<ChevronRight />`。
  - [x] SubTask 1.4: 为菜单项绑定 `onClick` 事件，点击时通过 `Toast.show('功能开发中')` 给出反馈。

- [x] Task 2: 完善退出登录与 UI 细节
  - [x] SubTask 2.1: 修改 `handleLogout` 方法，在 `onConfirm` 中增加清理 `localStorage`（如 `token`, `userInfo`）的逻辑。
  - [x] SubTask 2.2: 将退出后的路由跳转修改为 `navigate('/', { replace: true })`（假设跳回首页）。
  - [x] SubTask 2.3: 提取重复的 `style={{ '--border-top': 'none', '--border-bottom': 'none' }}` 为常量。
  - [x] SubTask 2.4: 在外层容器的 `pb-20` 基础上，增加 CSS `env(safe-area-inset-bottom)` 适配全面屏底部安全区。

# Task Dependencies
- [Task 1] depends on nothing
- [Task 2] depends on [Task 1]