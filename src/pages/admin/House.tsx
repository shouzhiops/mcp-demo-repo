import React, { useEffect } from 'react';
import { Table, Card, Button, message, Tag } from 'antd';
import { DownloadOutlined, HomeOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function House() {
  const { houses, loading, fetchHouses } = useStore();

  useEffect(() => {
    fetchHouses();
  }, []);

  const columns = [
    {
      title: '标准地址',
      dataIndex: 'addressId',
      key: 'addressId',
      width: '25%',
    },
    {
      title: '挂载户主',
      key: 'owner',
      render: (_: any, record: any) => record.address?.name || '-',
      width: '20%',
    },
    {
      title: '房屋状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        if (status.includes('危房')) color = 'red';
        else if (status.includes('民宿')) color = 'blue';
        return <Tag color={color}>{status}</Tag>;
      },
      width: '15%',
    },
    {
      title: '关联居住人口',
      key: 'populations',
      render: (_: any, record: any) => {
        const pops = record.address?.populations || [];
        if (pops.length === 0) return '-';
        return (
          <div className="flex flex-wrap gap-1">
            {pops.map((p: any) => (
              <Tag key={p.id}>{p.name} ({p.type})</Tag>
            ))}
          </div>
        );
      }
    }
  ];

  const handleExport = () => {
    message.success('实有房屋台账导出成功！(模拟)');
  };

  return (
    <Card 
      title={<span className="text-lg font-bold"><HomeOutlined className="mr-2" />实有房屋台账</span>}
      extra={<Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>一键导出</Button>}
      className="shadow-sm"
    >
      <Table 
        columns={columns} 
        dataSource={houses} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
