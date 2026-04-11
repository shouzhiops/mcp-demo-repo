import type { DataNode } from 'antd/es/tree';

export const PERMISSION_TREE: DataNode[] = [
  {
    title: '后台管理',
    key: 'admin',
    children: [
      { title: '工作台概览', key: '/admin' },
      { title: '标准地址台账', key: '/admin/address' },
      { title: '实有人口台账', key: '/admin/population' },
      { title: '实有房屋台账', key: '/admin/house' },
      { title: '实有单位台账', key: '/admin/unit' },
      { title: '实有设施台账', key: '/admin/facility' },
      { title: '隐患分拨调度', key: '/admin/orders' },
      { title: '村委班子', key: '/admin/users' },
      { title: '权限管理', key: '/admin/roles' },
    ],
  },
  {
    title: '大屏展示',
    key: 'screen',
    children: [
      { title: '数据大屏', key: '/screen' },
    ],
  },
  {
    title: '移动端',
    key: 'mobile',
    children: [
      { title: '随手拍', key: '/mobile/report' },
      { title: '人员登记', key: '/mobile/register' },
      { title: '待办工单', key: '/mobile/tasks' },
      { title: '地址', key: '/mobile/addresses' },
      { title: '房屋', key: '/mobile/houses' },
      { title: '单位', key: '/mobile/units' },
      { title: '设施', key: '/mobile/facilities' },
    ],
  },
];
