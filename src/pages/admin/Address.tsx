import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Card } from 'antd';
import { SearchOutlined, PlusOutlined, DownloadOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function Address() {
  const { addresses, fetchAddresses } = useStore();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (fetchAddresses) {
      fetchAddresses();
    }
  }, []);

  const columns = [
    { title: '标准地址编码', dataIndex: 'id', key: 'id', width: 200 },
    { title: '地址名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '地址层级', dataIndex: 'level', key: 'level', width: 120 },
    { title: '地址类型', dataIndex: 'type', key: 'type', width: 120 },
    { title: '经度', dataIndex: 'longitude', key: 'longitude', width: 150 },
    { title: '纬度', dataIndex: 'latitude', key: 'latitude', width: 150 },
    { 
      title: '关联数据', 
      key: 'stats',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="middle">
          <span className="text-blue-600">人口: {record.populations?.length || 0}</span>
          <span className="text-green-600">房屋: {record.houses?.length || 0}</span>
        </Space>
      )
    },
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

  const filteredData = addresses.filter(item => 
    item.name.includes(searchText) || item.id.includes(searchText)
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <EnvironmentOutlined className="mr-2" />
          标准地址台账
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索地址名称/编码"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />}>新增地址</Button>
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
