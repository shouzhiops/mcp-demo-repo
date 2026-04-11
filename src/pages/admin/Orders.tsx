import React, { useState } from 'react';
import { Table, Button, Tag, Space, message, Modal, Input, Card } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined, AlertOutlined, DownloadOutlined } from '@ant-design/icons';
import { useStore, Order } from '../../store';

const { confirm } = Modal;

export default function Orders() {
  const { orders, updateOrderStatus } = useStore();
  const [searchText, setSearchText] = useState('');

  const handleDispatch = (id: number) => {
    confirm({
      title: '确认派单?',
      icon: <ExclamationCircleOutlined />,
      content: '是否将此工单派发给处理人员(ID: 101)?',
      onOk() {
        updateOrderStatus(id, '待处置', 101);
        message.success('派单成功');
      },
    });
  };

  const handleVerify = (id: number) => {
    confirm({
      title: '确认核销?',
      icon: <ExclamationCircleOutlined />,
      content: '确认核销该工单，将其标记为已销账?',
      onOk() {
        updateOrderStatus(id, '已销账');
        message.success('核销成功');
      },
    });
  };

  const columns = [
    {
      title: '工单编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '隐患类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    { 
      title: '隐患来源', 
      dataIndex: 'source', 
      key: 'source',
      width: 120,
      render: (source: string) => {
        let color = 'blue';
        if (source === '群众上报') color = 'green';
        if (source === '物联网告警') color = 'red';
        return <Tag color={color}>{source || '网格员巡查'}</Tag>;
      },
    },
    { 
      title: '优先级', 
      dataIndex: 'priority', 
      key: 'priority',
      width: 100,
      render: (priority: string) => {
        let color = 'orange';
        if (priority === '高') color = 'red';
        if (priority === '低') color = 'green';
        return <Tag color={color}>{priority || '中'}</Tag>;
      },
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: Order['status']) => {
        let color = 'default';
        if (status === '待分拨') color = 'error';
        if (status === '待处置') color = 'warning';
        if (status === '已处置') color = 'processing';
        if (status === '已销账') color = 'success';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '详情描述',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      ellipsis: true,
    },
    {
      title: '关联地址',
      dataIndex: 'addressId',
      key: 'addressId',
      width: 200,
    },
    {
      title: '上报时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 150,
      render: (_: any, record: Order) => {
        if (record.status === '待分拨') {
          return (
            <Button 
              type="primary" 
              size="small" 
              onClick={() => handleDispatch(record.id)}
            >
              派单
            </Button>
          );
        }
        if (record.status === '已处置') {
          return (
            <Button 
              type="primary" 
              size="small" 
              className="bg-green-600"
              onClick={() => handleVerify(record.id)}
            >
              核销
            </Button>
          );
        }
        return <span className="text-gray-400">暂无操作</span>;
      },
    },
  ];

  const filteredData = orders.filter(item => 
    item.type.includes(searchText) || item.addressId.includes(searchText) || item.description.includes(searchText) || ((item as any).source && (item as any).source.includes(searchText))
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <div className="flex flex-col">
          <span className="text-lg font-bold"><AlertOutlined className="mr-2" />隐患分拨调度</span>
          <span className="text-sm text-gray-500 font-normal mt-1">负责管理和流转群众上报的隐患工单</span>
        </div>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索类型/描述/地址/来源"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button icon={<DownloadOutlined />}>导出台账</Button>
        </Space>
      }
    >
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id"
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
