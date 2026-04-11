# Tasks

- [x] Task 1: 在 `HeaderPanel.tsx` 增加实时时钟逻辑。
  - [x] SubTask 1.1: 引入 `useEffect` 和 `setInterval`。
  - [x] SubTask 1.2: 编写状态保存当前时间 `currentTime`，并每秒更新一次，格式化为类似 `YYYY-MM-DD HH:mm:ss 星期X`。

- [x] Task 2: 在 `HeaderPanel.tsx` 增加右上角组件布局。
  - [x] SubTask 2.1: 在 `HeaderPanel` 容器内新增一个 `absolute right-8 top-8 flex items-center gap-6` 的容器。
  - [x] SubTask 2.2: 添加时钟和天气挂件（可用图标和静态温度如：🌤️ 多云 26°C）。
  - [x] SubTask 2.3: 添加“数据后台”跳转按钮（使用 antd 或 Tailwind 样式的按钮），点击后调用 `useNavigate('/admin')`。

# Task Dependencies
- [Task 2] depends on [Task 1]