import React, { useEffect, useState } from 'react';
import { Table, Card, Button, message, Tag, Space, Input } from 'antd';
import { DownloadOutlined, HomeOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function House() {
  const { houses, loading, fetchHouses } = useStore();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchHouses();
  }, []);

  const columns = [
    { title: '房屋编号', dataIndex: 'id', key: 'id', width: 100 },
    { 
      title: '房屋状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 150,
      render: (status: string) => {
        let color = 'green';
        if (status.includes('危房')) color = 'red';
        if (status.includes('空心房')) color = 'orange';
        if (status.includes('民宿') || status.includes('农家乐')) color = 'purple';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: '房屋用途', dataIndex: 'usage', key: 'usage', width: 120 },
    { title: '产权人', dataIndex: 'ownerName', key: 'ownerName', width: 120 },
    { title: '产权人电话', dataIndex: 'ownerPhone', key: 'ownerPhone', width: 150 },
    { title: '挂载地址', dataIndex: 'addressId', key: 'addressId', width: 250 },
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

  const filteredData = houses.filter(item => 
    item.addressId.includes(searchText) || item.status.includes(searchText) || (item.ownerName && item.ownerName.includes(searchText))
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <HomeOutlined className="mr-2" />
          实有房屋台账
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索地址/状态/产权人"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />}>新增房屋</Button>
          <Button icon={<DownloadOutlined />}>导出</Button>
        </Space>
      }
    >
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
