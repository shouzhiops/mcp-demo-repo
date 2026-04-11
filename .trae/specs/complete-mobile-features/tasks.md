# Tasks
- [x] Task 1: 完善 Home 与 Mine
  - [x] SubTask 1.1: 修改 `Home.tsx`，从 `useStore` 获取 `orders`，动态计算并在快捷操作模块显示未完成（如待分拨/进行中）的工单角标（Badge）或统计数字。
  - [x] SubTask 1.2: 修改 `Mine.tsx`，补充列表项（修改密码、退出登录），并绑定点击事件（如弹出 Confirm 确认框，退出后跳转回首页或重置状态）。

- [x] Task 2: 完善 Report 与 Tasks
  - [x] SubTask 2.1: 在 `Report.tsx` 中，将获取位置的逻辑替换为 `navigator.geolocation.getCurrentPosition`，失败时可回退为 Mock 数据。
  - [x] SubTask 2.2: 在 `Tasks.tsx` 增加工单详情展示：点击工单卡片弹出 `Popup`，展示描述、图片列表及详细流转状态。

- [x] Task 3: 完善 Register 与 人口列表
  - [x] SubTask 3.1: 在 `Register.tsx` 中，使用 Ant Design Mobile Form 的 `rules` 为身份证和手机号添加正则校验。
  - [x] SubTask 3.2: 新增 `Populations.tsx`，接入 Store 的 `populations` 数据，提供搜索过滤，支持侧滑或点击卡片删除/修改人口记录，并在 `MobileApp.tsx` 补充该路由。将 `Home.tsx` 中“人口”的入口改为 `/mobile/populations`，原 `/mobile/register` 仅作为人员登记使用。

- [x] Task 4: 完善 Addresses 与 Houses
  - [x] SubTask 4.1: 修改 `Addresses.tsx`，接入 `useStore` 的 `addresses`、`addAddress` 等方法，替换掉原先的本地状态；实现顶部搜索框对 `name` 或 `type` 的过滤逻辑。
  - [x] SubTask 4.2: 修改 `Houses.tsx`，增加新增房屋的入口（Popup 或 Modal）并接入 `addHouse`；实现对房屋状态或房东姓名的搜索过滤。

- [x] Task 5: 完善 Units 与 Facilities
  - [x] SubTask 5.1: 补充 `Units.tsx` 的完整逻辑，接入 `units` 数据，实现单位列表展示、搜索过滤及新增单位（Popup 弹窗）功能。
  - [x] SubTask 5.2: 修改 `Facilities.tsx`，接入 `facilities` 与更新逻辑，替换本地状态；实现搜索过滤逻辑。

# Task Dependencies
- [Task 1] depends on nothing
- [Task 2] depends on nothing
- [Task 3] depends on nothing
- [Task 4] depends on nothing
- [Task 5] depends on nothing