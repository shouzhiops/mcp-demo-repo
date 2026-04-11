import React, { useState } from 'react';
import { Table, Button, Space, Tag, Input, Card } from 'antd';
import { SearchOutlined, PlusOutlined, DownloadOutlined, TeamOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function Population() {
  const { populations } = useStore();
  const [searchText, setSearchText] = useState('');

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { 
      title: '联系电话', 
      dataIndex: 'phone', 
      key: 'phone',
      render: (text: string) => text || <span className="text-gray-400">暂无</span>
    },
    {
      title: '人口类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        let color = 'blue';
        if (type.includes('老人') || type.includes('儿童')) color = 'volcano';
        if (type.includes('外出')) color = 'geekblue';
        if (type.includes('干部') || type.includes('军人')) color = 'green';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    { title: '居住地址编码', dataIndex: 'addressId', key: 'addressId' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a className="text-blue-600">编辑</a>
          <a className="text-red-600">删除</a>
        </Space>
      ),
    },
  ];

  const filteredData = populations.filter(item => 
    item.name.includes(searchText) || item.addressId.includes(searchText)
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <TeamOutlined className="mr-2" />
          实有人口台账
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索姓名/地址编码"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />}>新增人口</Button>
          <Button icon={<DownloadOutlined />}>导出</Button>
        </Space>
      }
    >
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
