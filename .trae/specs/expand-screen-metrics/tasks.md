# Tasks

- [x] Task 1: 扩展左侧图表面板 (`LeftPanel.tsx`)。
  - [x] SubTask 1.1: 接收 `orders` 数据。
  - [x] SubTask 1.2: 增加“基层治理效能分析”模块。
  - [x] SubTask 1.3: 计算“隐患化解率”（已销账数 / 总工单数），并渲染 ECharts 仪表盘（Gauge Chart）。
  - [x] SubTask 1.4: 对 `Order.type` 聚合统计，选出数量最多的 5 种隐患类型，并渲染横向柱状图（Bar Chart）。
  - [x] SubTask 1.5: 调整左侧面板的 flex 布局，使三个主要模块（人口画像、房屋状态、治理效能）均衡排布。

- [x] Task 2: 扩展右侧图表面板 (`RightPanel.tsx`)。
  - [x] SubTask 2.1: 接收 `units` 和 `facilities` 数据。
  - [x] SubTask 2.2: 增加“村级经济实体画像”模块。通过对 `Unit.name` 进行模糊匹配（如包含“农家乐”、“餐饮”的归为一类，“酒”、“加工”的归为一类，“合作社”归为一类等），渲染 ECharts 环形饼图。
  - [x] SubTask 2.3: 增加“安防设施覆盖率”模块。对 `Facility.type` 聚合统计，渲染 ECharts 雷达图（Radar Chart）或极坐标柱状图。
  - [x] SubTask 2.4: 调整右侧面板的 flex 布局。上半部分展示上述两个新图表，下半部分保留并压缩原有的“实时异常预警”滚动列表。

# Task Dependencies
- [Task 2] depends on [Task 1]