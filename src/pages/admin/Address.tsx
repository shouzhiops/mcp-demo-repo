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
    { title: '标准地址编码', dataIndex: 'id', key: 'id' },
    { title: '地址名称', dataIndex: 'name', key: 'name' },
    { title: '经度', dataIndex: 'longitude', key: 'longitude' },
    { title: '纬度', dataIndex: 'latitude', key: 'latitude' },
    { 
      title: '关联数据', 
      key: 'stats',
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
      render: () => (
        <Space size="middle">
          <a className="text-blue-600 hover:text-blue-800">编辑</a>
          <a className="text-red-600 hover:text-red-800">删除</a>
        </Space>
      ),
    },
  ];

  const filteredData = addresses.filter(item => 
    (item.name && item.name.includes(searchText)) || 
    (item.id && item.id.includes(searchText))
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
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
