import React, { useEffect } from 'react';
import { Table, Card, Button, message, Tag } from 'antd';
import { DownloadOutlined, ShopOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function Unit() {
  const { units, loading, fetchUnits } = useStore();

  useEffect(() => {
    fetchUnits();
  }, []);

  const columns = [
    {
      title: '单位名称',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: '单位类型',
      key: 'type',
      render: (_: any, record: any) => {
        let color = 'cyan';
        if (record.name.includes('农家乐')) color = 'orange';
        if (record.name.includes('酒业')) color = 'purple';
        if (record.name.includes('卫生')) color = 'red';
        return <Tag color={color}>实体经济</Tag>;
      },
      width: '20%',
    },
    {
      title: '标准地址',
      dataIndex: 'addressId',
      key: 'addressId',
      width: '30%',
    },
    {
      title: '位置描述',
      key: 'location',
      render: (_: any, record: any) => record.address?.name || '-',
      width: '20%',
    }
  ];

  const handleExport = () => {
    message.success('实有单位台账导出成功！(模拟)');
  };

  return (
    <Card 
      title={<span className="text-lg font-bold"><ShopOutlined className="mr-2" />实有单位台账</span>}
      extra={<Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>一键导出</Button>}
      className="shadow-sm"
    >
      <Table 
        columns={columns} 
        dataSource={units} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
