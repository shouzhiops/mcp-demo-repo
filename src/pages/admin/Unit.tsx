import React, { useEffect, useState } from 'react';
import { Table, Card, Button, message, Tag, Space, Input } from 'antd';
import { DownloadOutlined, ShopOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function Unit() {
  const { units, loading, fetchUnits } = useStore();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchUnits();
  }, []);

  const columns = [
    { title: '单位编号', dataIndex: 'id', key: 'id', width: 100 },
    { title: '单位名称', dataIndex: 'name', key: 'name', width: 250 },
    { 
      title: '单位类型', 
      dataIndex: 'type', 
      key: 'type',
      width: 150,
      render: (type: string) => {
        let color = 'cyan';
        if (type?.includes('餐饮') || type?.includes('住宿')) color = 'orange';
        if (type?.includes('机关') || type?.includes('服务')) color = 'blue';
        if (type?.includes('制造') || type?.includes('加工')) color = 'purple';
        return <Tag color={color}>{type || '未分类'}</Tag>;
      },
    },
    { title: '法定代表人', dataIndex: 'legalPerson', key: 'legalPerson', width: 120 },
    { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', width: 150 },
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

  const handleExport = () => {
    message.success('实有单位台账导出成功！(模拟)');
  };

  const filteredData = units.filter(item => 
    (item.name && item.name.includes(searchText)) || 
    (item.addressId && item.addressId.includes(searchText)) || 
    (item.legalPerson && item.legalPerson.includes(searchText))
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <ShopOutlined className="mr-2" />
          实有单位台账
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索名称/地址/法人"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />}>新增单位</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
        </Space>
      }
    >
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id"
        scroll={{ x: 'max-content' }}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
