# Fix CRUD Create Bug Spec

## Why
目前管理后台的各类台账组件（如 Address、Population 等）在执行“新增”操作时，如果用户在此前点击过“编辑”，表单内部会残留底层数据的嵌套关联数组（如 populations, houses）。这导致前端发送的新增 Payload 携带了不合法字段，而由于后端对应的 POST 接口缺乏 try-catch 保护，请求直接发生 500 Unhandled Promise Rejection。同时，前端错把网络错误当成了“表单校验失败”进行拦截，最终导致用户界面毫无反应，弹窗卡死。

## What Changes
- **彻底清空前端表单残留数据**：在各个台账组件的 `handleAdd` 方法中，不再仅仅使用 `form.resetFields()`，而是先调用 `form.setFieldsValue({})` 强制清空表单内部的所有残留历史记录。
- **分离前端错误捕获逻辑**：在 `handleModalOk` 方法中，将表单校验（`validateFields`）与后端 API 请求分离。如果 API 请求失败，应当弹出 `message.error` 明确提示用户，而不是将错误静默吞掉。
- **补全后端接口异常捕获**：在 `api/src/index.ts` 中，为 Address、Population、House、Unit、Facility、Order 等业务台账的 POST、PUT、DELETE 接口统一包裹 `try...catch` 块，确保在数据库报错时返回 `400` 错误响应。

## Impact
- Affected code: `src/pages/admin/*.tsx` (Address, Population, House, Unit, Facility, Orders), `api/src/index.ts`
- Affected features: 所有后台业务台账的新增、编辑和删除功能。

## MODIFIED Requirements
### Requirement: Data Entity Creation
The system SHALL ensure clean form states for new entity creation and gracefully handle/display any backend validation or database errors during CRUD operations.

#### Scenario: Success case
- **WHEN** user clicks "编辑" on a record, cancels, and then clicks "新增"
- **THEN** the form is completely cleared of previous hidden relational data, and the creation succeeds.
- **WHEN** an error occurs during backend creation
- **THEN** the server returns a proper JSON error response, and the frontend displays a visible error message to the user.