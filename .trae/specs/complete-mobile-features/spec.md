# Complete Mobile Features Spec

## Why
目前移动端多个页面（如首页、随手拍、待办工单、人口登记及各大基础台账）仍处于 UI 原型阶段，缺乏数据持久化（未完全接入全局 Store）、真实 API 调用（如 GPS 定位）、表单校验、搜索过滤以及核心业务的 CRUD 闭环。需要逐个模块完善这些缺失功能，使移动端真正可用。

## What Changes
- **Home & Mine**: 在 `Home.tsx` 中增加基于 `useStore` 数据的动态统计展示（如待办数量）；在 `Mine.tsx` 补充退出登录、清除缓存等操作弹窗交互。
- **Report & Tasks**: 在 `Report.tsx` 中使用真实的浏览器 `Geolocation API` 获取 GPS 定位取代随机数据；在 `Tasks.tsx` 增加工单详情弹窗（Popup）以查看具体描述和图片。
- **Register & Populations**: 在 `Register.tsx` 增加手机号（11位）和身份证号（18位）的严格正则校验；新增人员列表页（可通过“人口”模块入口访问）以便查阅和管理。
- **Addresses, Houses, Units, Facilities**: 全面接入全局 Store，实现数据的异步拉取、新增、状态更新（或删除）以及顶部的关键字本地搜索过滤功能。

## Impact
- Affected code: `src/pages/mobile/*.tsx`
- Affected features: 所有移动端台账页面的搜索与数据持久化、定位获取。

## ADDED Requirements
### Requirement: Data Persistence & Search
所有列表页（Addresses, Houses, Units, Facilities, Populations）必须使用 `useStore` 中的数据，且支持通过顶部搜索框根据名称、类型等关键字段进行过滤。

### Requirement: Real GPS Location
`Report.tsx` 必须调用 `navigator.geolocation.getCurrentPosition` 获取真实经纬度。

### Requirement: Form Validation
所有新增或编辑表单必须包含基础校验（如非空校验），身份证和手机号需要符合格式。