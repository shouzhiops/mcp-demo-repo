# Tasks
- [x] Task 1: 扩展后端数据库模型与种子数据
  - [x] SubTask 1.1: 在 `schema.prisma` 中新增 `User`（含 username, password, name, status, roleId 等字段）和 `Role`（含 name, permissions）模型。
  - [x] SubTask 1.2: 在 `api/package.json` 中安装 `bcryptjs` 和 `jsonwebtoken` 及其类型声明。
  - [x] SubTask 1.3: 更新 `api/prisma/seed.ts`，清空旧数据并默认创建超级管理员角色及超管用户（`admin` / `admin123`，使用 bcrypt 加密密码）。执行 `prisma db push` 和 `prisma db seed`。

- [x] Task 2: 开发后端认证与管理 API
  - [x] SubTask 2.1: 在 `api/src/index.ts` 中实现 `/api/auth/register` (状态默认 pending) 和 `/api/auth/login` (返回 JWT Token 及用户信息)。
  - [x] SubTask 2.2: 在 `api/src/index.ts` 中实现对 `users` 的 CRUD（支持审核更新 status）以及对 `roles` 的 CRUD。
  - [x] SubTask 2.3: 添加简单的 JWT 验证中间件，保护所有非 `/api/auth` 路由（考虑到大屏展示，可暂时对 GET 请求放行或按需配置，核心是保护 POST/PUT/DELETE 和用户信息路由，为简便起见，此步骤中要求请求携带 token）。

- [x] Task 3: 前端状态管理与登录注册页面
  - [x] SubTask 3.1: 在 `src/store/index.ts` 中增加 `auth` 相关的 state（token, currentUser）以及 `login`, `register`, `logout` 方法。增加 `users` 和 `roles` 的获取与更新方法。
  - [x] SubTask 3.2: 创建 `src/pages/Login.tsx` 和 `src/pages/Register.tsx` 页面，设计符合系统风格的居中表单，调用 store 对应方法。
  - [x] SubTask 3.3: 修改 `src/App.tsx`，配置路由守卫：访问 `/admin/*` 或 `/mobile/*` 时检查 store 中的 token，若无则重定向至 `/login`。

- [x] Task 4: 开发后台“村委班子”与“权限管理”页面
  - [x] SubTask 4.1: 创建 `src/pages/admin/Users.tsx`（显示为：村委班子），以表格展示用户列表，对 `pending` 状态的用户提供“通过”和“拒绝”按钮；支持修改用户信息和分配角色。
  - [x] SubTask 4.2: 创建 `src/pages/admin/Roles.tsx`（显示为：权限管理），提供角色的增删改查。
  - [x] SubTask 4.3: 在 `src/pages/admin/AdminApp.tsx` 侧边栏菜单中，新增“村委班子”和“权限管理”菜单项，并配置对应路由。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]