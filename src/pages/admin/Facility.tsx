import React, { useEffect, useState } from 'react';
import { Table, Card, Button, message, Tag, Space, Input } from 'antd';
import { DownloadOutlined, SafetyCertificateOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function Facility() {
  const { facilities, loading, fetchFacilities } = useStore();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchFacilities();
  }, []);

  const columns = [
    { title: '设施编号', dataIndex: 'id', key: 'id', width: 100 },
    { title: '设施类型', dataIndex: 'type', key: 'type', width: 150 },
    { title: '设施名称', dataIndex: 'name', key: 'name', width: 200 },
    { 
      title: '运行状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 120,
      render: (status: string) => {
        let color = 'green';
        if (status === '维护中') color = 'orange';
        if (status === '损坏') color = 'red';
        return <Tag color={color}>{status || '正常'}</Tag>;
      },
    },
    { title: '管护责任人', dataIndex: 'manager', key: 'manager', width: 150 },
    { title: '标准地址', dataIndex: 'addressId', key: 'addressId', width: 250 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 120,
      render: () => (
        <Space size="middle">
          <a className="text-blue-600">编辑</a>
          <a className="text-red-600">删除</a>
        </Space>
      ),
    },
  ];

  const filteredData = facilities.filter(item => 
    item.type.includes(searchText) || item.addressId.includes(searchText) || (item.name && item.name.includes(searchText)) || (item.manager && item.manager.includes(searchText))
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <SafetyCertificateOutlined className="mr-2" />
          实有设施台账
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索名称/类型/责任人"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />}>新增设施</Button>
          <Button icon={<DownloadOutlined />}>导出</Button>
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
