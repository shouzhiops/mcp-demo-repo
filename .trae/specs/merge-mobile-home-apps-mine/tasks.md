# Tasks
- [x] Task 1: 合并入口到 Home 页面
  - [x] SubTask 1.1: 在 `Home.tsx` 中引入 `Apps.tsx` 里的“基础业务”九宫格内容。
  - [x] SubTask 1.2: 在 `Home.tsx` 顶部 NavBar 的左侧（`left` 属性）添加一个圆形的个人头像（使用 antd-mobile 的 `Avatar` 或原生 `img`）。
  - [x] SubTask 1.3: 为头像绑定点击事件，使用 `navigate('/mobile/mine')` 跳转到个人中心。

- [x] Task 2: 移除 MobileApp 底部 TabBar
  - [x] SubTask 2.1: 在 `MobileApp.tsx` 中移除 `BottomBar` 组件的定义和使用。
  - [x] SubTask 2.2: 调整路由，保留 `Home`、`Mine` 及各业务页面的路由，确保 `Home` 成为唯一的主页面入口。

# Task Dependencies
- [Task 2] depends on [Task 1]