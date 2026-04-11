# Auth and RBAC Spec

## Why
目前系统处于开放访问状态，任何用户都能直接进入管理后台或移动端查看和修改台账与工单数据。为了确保系统数据安全与业务合规，需要引入用户身份认证机制（注册与登录），同时加入村委班子（用户管理）和权限管理（角色管理），并且限制新注册用户必须经过后台审核才能使用系统。

## What Changes
- **后端数据库模型扩展**：新增 `User`（用户）和 `Role`（角色）模型，建立关联关系。
- **默认管理员生成**：初始化数据库时（Seed），默认生成超管用户，账号 `admin`，密码 `admin123`，并绑定超管角色。
- **认证授权 API**：增加 `/api/auth/login` 与 `/api/auth/register` 接口。注册用户初始状态为“待审核”（`pending`）。
- **用户与角色管理 API**：增加对 `User` 和 `Role` 的增删改查接口，重点支持对新注册用户的状态审核。
- **前端登录注册页**：开发 `Login.tsx` 和 `Register.tsx` 页面，并且使用前端路由守卫拦截未登录用户访问后台或移动端页面。
- **后台管理菜单扩展**：在管理后台左侧导航栏新增“村委班子”（对应用户管理，可审核注册申请）和“权限管理”（对应角色管理）页面。

## Impact
- Affected code: `api/prisma/schema.prisma`, `api/src/index.ts`, `api/prisma/seed.ts`, `src/App.tsx`, `src/pages/admin/AdminApp.tsx`, `src/store/index.ts`
- Affected features: 全局路由访问控制、管理后台菜单扩展。

## ADDED Requirements
### Requirement: User Authentication
The system SHALL provide login and registration forms. Registration requires admin approval. Unauthenticated access to `/admin` or `/mobile` MUST redirect to the login page.

#### Scenario: Success case
- **WHEN** a new user registers via the registration page
- **THEN** their account is created with a `pending` status and they cannot log in yet.
- **WHEN** the `admin` logs in, navigates to "村委班子", and approves the user
- **THEN** the user's status becomes `active` and they can successfully log in.