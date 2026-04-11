import React, { useEffect } from 'react';
import { Table, Card, Button, message, Tag } from 'antd';
import { DownloadOutlined, SafetyOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function Facility() {
  const { facilities, loading, fetchFacilities } = useStore();

  useEffect(() => {
    fetchFacilities();
  }, []);

  const columns = [
    {
      title: '设施/力量类型',
      dataIndex: 'type',
      key: 'type',
      width: '30%',
      render: (type: string) => {
        let color = 'blue';
        if (type.includes('消防')) color = 'red';
        if (type.includes('监控') || type.includes('雪亮')) color = 'purple';
        if (type.includes('垃圾')) color = 'green';
        return <Tag color={color}>{type}</Tag>;
      }
    },
    {
      title: '标准地址',
      dataIndex: 'addressId',
      key: 'addressId',
      width: '40%',
    },
    {
      title: '具体位置/挂载点',
      key: 'location',
      render: (_: any, record: any) => record.address?.name || '-',
      width: '30%',
    }
  ];

  const handleExport = () => {
    message.success('实有设施/力量台账导出成功！(模拟)');
  };

  return (
    <Card 
      title={<span className="text-lg font-bold"><SafetyOutlined className="mr-2" />实有设施台账</span>}
      extra={<Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>一键导出</Button>}
      className="shadow-sm"
    >
      <Table 
        columns={columns} 
        dataSource={facilities} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
